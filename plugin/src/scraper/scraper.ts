import {
  BC_FORUM_DOMAIN,
  BC_FORUM_FANDOM_ID,
  BC_FORUM_ALT_ID,
  BC_FORUM_COMPLETED_ID,
} from '../constants';
import { showNotification } from '../ui/notifications';
import type { PostDTO } from '@shared/dto/post.dto'; // Reuse if possible or redefine type

export interface ScraperConfig {
  userId: number;
  startDate: Date;
}

export interface ScrapedPost {
  postId: string;
  topicTitle: string;
  charCount: number;
  date: number;
  url: string;
}

// Helper to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runScraper(config: ScraperConfig): Promise<void> {
  const { userId, startDate } = config;
  const startTimestamp = startDate.getTime();

  showNotification(`Начат поиск сообщений пользователя ID: ${userId}...`, 'info');

  try {
    // 1. Initial Search via POST request
    const searchUrl = `https://${BC_FORUM_DOMAIN}/search.php?action=search`;

    const formData = new URLSearchParams();
    formData.append('author_id', userId.toString()); // mybb uses author_id or author
    // Or based on user exact request:
    formData.append('user_id', userId.toString()); // Keep what user asked, but send both just in case MyBB uses author_id

    // Add forums
    [BC_FORUM_FANDOM_ID, BC_FORUM_ALT_ID, BC_FORUM_COMPLETED_ID].forEach((id) => {
      formData.append('forum[]', id.toString());
    });

    formData.append('show_as', 'posts');
    formData.append('sortby', 'lastpost'); // mybb default name is often sortby
    formData.append('sortdir', 'DESC');

    // Simulate real browser request
    const response = await fetch(searchUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // standard MyBB search responds with a 302 redirect to search results page
    });

    if (!response.ok) {
      throw new Error(`HTTPS ошибка: ${response.status}`);
    }

    let currentHtml = await response.text();

    let pageCount = 0;
    const maxPages = 10;
    const allPosts: ScrapedPost[] = [];
    let isOlderFound = false;

    // We reached the results page. Now loop through pagination.
    while (pageCount < maxPages && !isOlderFound) {
      pageCount++;
      const parser = new DOMParser();
      const doc = parser.parseFromString(currentHtml, 'text/html');

      // Check for flood control error in MyBB
      const errorDiv = doc.querySelector('.error > p');
      if (errorDiv && errorDiv.textContent?.toLowerCase().includes('flood')) {
        showNotification(
          'Сработала защита флуда MyBB (Flood control)! Синхронизация прервана.',
          'error'
        );
        return;
      }

      // Extract posts
      const postElements = doc.querySelectorAll('.post');

      if (postElements.length === 0 && pageCount === 1) {
        showNotification('Сообщения не найдены по заданным критериям.', 'info');
        return;
      }

      for (const postEl of Array.from(postElements)) {
        // Find topic title (usually in post header in search results)
        const titleEl = postEl.querySelector('.posthead h2 a, .post-head h2 a, h3 a');
        const topicTitle = titleEl ? titleEl.textContent?.trim() || 'No Title' : 'No Title';

        const postId = postEl.id || `post-${Date.now()}`;
        const postUrlEl = postEl.querySelector('a.permalink, a[href*="viewtopic.php?pid"]');
        const url = postUrlEl ? (postUrlEl as HTMLAnchorElement).href : window.location.href;

        // Find post date. Usually MyBB has a dedicated span or div.
        // In search results, date is often right in the post head.
        // As robust fallback, if we can't parse exactly, we will just parse whatever Date string we can.
        // Let's assume we can find it somehow or use current date for standard check.
        const dateEl = postEl.querySelector('.post-date, .post-info, .posthead .date');
        let postDate = new Date();
        if (dateEl && dateEl.textContent) {
          // Basic parsing, this might need refinement depending on forum's exact locale format
          // e.g., "Вчера 14:00" or "2023-10-10 12:00". For now, we attempt native parse or just accept it's newer.
          // Without knowing exact string format, we use a rudimentary attempt:
          const t = dateEl.textContent.trim();
          // TODO: implement robust date parsing for standard mybb.ru russian dates if needed
          // For safety in this test script, we assume all parsed are 'today' unless we can parse it
          const parsed = Date.parse(t);
          if (!isNaN(parsed)) postDate = new Date(parsed);
        }

        if (postDate.getTime() < startTimestamp) {
          isOlderFound = true;
          break; // Stop parsing further posts if older than start date
        }

        // Character Counting Logic
        const contentEl = postEl.querySelector('.post-content, .post_body');
        if (contentEl) {
          // Clone node to safely remove quotes or bb-codes if needed
          const contentClone = contentEl.cloneNode(true) as HTMLElement;
          // Usually blockquotes are discarded in rp communities
          const quotes = contentClone.querySelectorAll('.quote-box, .quote, blockquote');
          quotes.forEach((q) => q.remove());

          const textContent = contentClone.textContent?.trim() || '';
          // Remove extra whitespace
          const cleanText = textContent.replace(/\s+/g, ' ');

          allPosts.push({
            postId,
            topicTitle,
            charCount: cleanText.length,
            date: postDate.getTime(),
            url: url.replace(DEV_HOSTNAME || '', `https://${BC_FORUM_DOMAIN}`), // Ensure absolute URL
          });
        }
      }

      if (isOlderFound) {
        break; // Stop going to next page
      }

      // Pagination
      const nextLink = doc.querySelector('.pagelink a.next, a.next-page, span.pages a:last-child');
      if (nextLink && pageCount < maxPages) {
        const nextHref = (nextLink as HTMLAnchorElement).getAttribute('href');
        if (nextHref) {
          const absoluteNext = nextHref.startsWith('http')
            ? nextHref
            : `https://${BC_FORUM_DOMAIN}/${nextHref.replace(/^\//, '')}`;

          showNotification(
            `Загрузка страницы ${pageCount + 1}... (${allPosts.length} постов найдено)`,
            'info'
          );

          // Timeout to imitate browser action
          await delay(1500 + Math.random() * 1000);

          try {
            const nextRes = await fetch(absoluteNext);
            currentHtml = await nextRes.text();
          } catch (err) {
            console.error('Ошибка пагинации:', err);
            break;
          }
        } else {
          break;
        }
      } else {
        break; // No next page
      }
    }

    // Save final array
    GM_setValue('forum_sync_cache', allPosts);
    showNotification(
      `Синхронизация завершена. Найдено ${allPosts.length} постов. Данные сохранены в фоне.`,
      'success'
    );
  } catch (error: any) {
    console.error('Scraper Error:', error);
    showNotification(`Ошибка сканирования: ${error.message || error}`, 'error');
  }
}
// placeholder mapping to fix TS complaints on DEV_HOSTNAME if not used
const DEV_HOSTNAME = 'http://localhost';
