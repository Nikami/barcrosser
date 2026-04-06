import type { PostDTO } from '@shared/dto/post.dto';

// Type definitions for GM functions mapped via Webpack BannerPlugin and @types/tampermonkey
// The script will execute in the context of barcross.ru

const DEV_TARGET = 'http://localhost:4200';
const PROD_TARGET = 'https://app.vercel.app'; // Update to the real vercel URL later

export async function parsePosts(): Promise<void> {
  const isDevMode = GM_getValue('dev_mode', true);
  const targetUrl = isDevMode ? DEV_TARGET : PROD_TARGET;

  console.log('[BarCrosser Tracker] Starting parser on current page...');

  const posts: PostDTO[] = [];
  
  // This is a naive selector. We will need to adjust it to the real forum DOM
  const postElements = document.querySelectorAll('.post'); 

  for (const postEl of postElements) {
    const postId = postEl.id || `post-${Date.now()}-${Math.random()}`;
    const textContent = postEl.textContent || '';
    
    // We assume there might be a topic title around
    const topicTitle = document.title;
    
    const charCount = textContent.trim().length;
    
    posts.push({
      postId,
      topicTitle,
      charCount,
      date: Date.now(),
      url: window.location.href,
      forumId: 'default-forum' // Update based on URL or DOM
    });
  }

  console.log(`[BarCrosser Tracker] Parsed ${posts.length} posts. Synchronizing...`);

  if (posts.length > 0) {
    // We open a small popup or just a background tab if possible
    // Due to browser policies, window.open might be blocked if not initiated by a user click
    // For now we just open it and send messages
    const win = window.open(targetUrl, '_blank');
    if (win) {
      // Small delay to let Angular Boot up
      await new Promise((resolve) => setTimeout(resolve, 3000));
      for (const post of posts) {
        win.postMessage({ type: 'BARCROSSER_SYNC', payload: post }, targetUrl);
      }
      console.log('[BarCrosser Tracker] Synchronized successfully.');
    } else {
      console.error('[BarCrosser Tracker] Popup blocked by browser. Please allow popups for barcross.ru to sync.');
    }
  } else {
    console.log('[BarCrosser Tracker] No posts found.');
  }
}

// Minimal UI to trigger sync
function initUI(): void {
  const btn = document.createElement('button');
  btn.innerText = 'Sync Barcrosser';
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '999999',
    padding: '10px 15px',
    background: '#007BFF',
    color: '#FFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  });
  
  btn.onclick = (e: MouseEvent) => {

    e.preventDefault();
    parsePosts();
  };
  
  document.body.appendChild(btn);
}

initUI();
