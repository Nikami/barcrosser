import { runScraper } from '../scraper/scraper';
import { createIcons, RefreshCw, X } from 'lucide';
import { showNotification } from './notifications';

export function initUI(): void {
  // Toggle Button
  const toggleBtn = document.createElement('button');
  toggleBtn.title = 'BarCrosser';
  toggleBtn.className = `
    bc-absolute bc-top-5 bc-right-5 bc-z-[999999] bc-p-3 bc-rounded-full 
    bc-shadow-lg bc-transition-colors bc-flex bc-items-center bc-justify-center
    bc-bg-blue-600 bc-text-white hover:bc-bg-blue-700
  `;

  const iconOpenWrapper = document.createElement('span');
  iconOpenWrapper.className = 'bc-block bc-w-6 bc-h-6';
  const iconOpen = document.createElement('i');
  iconOpen.setAttribute('data-lucide', 'refresh-cw');
  iconOpenWrapper.appendChild(iconOpen);

  const iconCloseWrapper = document.createElement('span');
  iconCloseWrapper.className = 'bc-hidden bc-w-6 bc-h-6';
  const iconClose = document.createElement('i');
  iconClose.setAttribute('data-lucide', 'x');
  iconCloseWrapper.appendChild(iconClose);

  toggleBtn.appendChild(iconOpenWrapper);
  toggleBtn.appendChild(iconCloseWrapper);

  // Main Form Wrapper
  const formWrapper = document.createElement('div');
  formWrapper.id = 'bc-plugin-form';
  formWrapper.className = `
    bc-absolute bc-top-20 bc-right-5 bc-z-[999998] bc-bg-white 
    bc-p-5 bc-rounded-lg bc-shadow-2xl bc-border bc-border-gray-200 
    bc-w-72 bc-font-sans bc-text-gray-800 bc-hidden
  `;

  let isOpen = false;

  toggleBtn.onclick = () => {
    isOpen = !isOpen;
    if (isOpen) {
      formWrapper.classList.remove('bc-hidden');
      toggleBtn.classList.remove('bc-bg-blue-600', 'bc-text-white', 'hover:bc-bg-blue-700');
      toggleBtn.classList.add('bc-bg-gray-200', 'bc-text-gray-800', 'hover:bc-bg-gray-300');
      iconOpenWrapper.classList.replace('bc-block', 'bc-hidden');
      iconCloseWrapper.classList.replace('bc-hidden', 'bc-block');
    } else {
      formWrapper.classList.add('bc-hidden');
      toggleBtn.classList.add('bc-bg-blue-600', 'bc-text-white', 'hover:bc-bg-blue-700');
      toggleBtn.classList.remove('bc-bg-gray-200', 'bc-text-gray-800', 'hover:bc-bg-gray-300');
      iconOpenWrapper.classList.replace('bc-hidden', 'bc-block');
      iconCloseWrapper.classList.replace('bc-block', 'bc-hidden');
    }
  };

  // Title
  const title = document.createElement('h3');
  title.innerText = 'BarCrosser';
  title.className = `bc-text-lg bc-font-bold bc-mb-4 bc-text-center bc-text-blue-600`;
  formWrapper.appendChild(title);

  // Username Input
  const usernameDiv = document.createElement('div');
  usernameDiv.className = 'bc-mb-3';
  const usernameLabel = document.createElement('label');
  usernameLabel.innerText = 'Никнейм пользователя:';
  usernameLabel.className = 'bc-block bc-text-sm bc-font-medium bc-mb-1';
  const usernameInput = document.createElement('input');
  usernameInput.type = 'text';
  usernameInput.placeholder = 'Например, Varka';
  usernameInput.value = GM_getValue('last_username', '') as string;
  usernameInput.className =
    'bc-w-full bc-p-2 bc-border bc-border-gray-300 bc-rounded bc-focus:outline-none bc-focus:border-blue-500';
  usernameDiv.appendChild(usernameLabel);
  usernameDiv.appendChild(usernameInput);
  formWrapper.appendChild(usernameDiv);

  // Date Input
  const dateDiv = document.createElement('div');
  dateDiv.className = 'bc-mb-4';
  const dateLabel = document.createElement('label');
  dateLabel.innerText = 'Считать посты не старше:';
  dateLabel.className = 'bc-block bc-text-sm bc-font-medium bc-mb-1';
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  // Default to 1 week ago if nothing saved
  const prevDate = GM_getValue('last_sync_date', null) as string | null;
  if (prevDate) {
    dateInput.value = prevDate;
  } else {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    dateInput.value = d.toISOString().split('T')[0];
  }

  dateInput.className =
    'bc-w-full bc-p-2 bc-border bc-border-gray-300 bc-rounded bc-focus:outline-none bc-focus:border-blue-500';
  dateDiv.appendChild(dateLabel);
  dateDiv.appendChild(dateInput);
  formWrapper.appendChild(dateDiv);

  // Sync Button
  const syncBtn = document.createElement('button');
  syncBtn.innerText = 'Синхронизировать';
  syncBtn.className =
    'bc-w-full bc-bg-blue-600 hover:bc-bg-blue-700 bc-text-white bc-font-bold bc-py-2 bc-px-4 bc-rounded bc-transition-colors';

  syncBtn.onclick = async (e: MouseEvent) => {
    e.preventDefault();
    const uname = usernameInput.value.trim();
    const dateStr = dateInput.value;

    if (!uname) {
      showNotification('Введите никнейм пользователя.', 'error');
      return;
    }

    if (!dateStr) {
      showNotification('Выберите дату.', 'error');
      return;
    }

    GM_setValue('last_username', uname);
    GM_setValue('last_sync_date', dateStr);

    syncBtn.disabled = true;
    syncBtn.innerText = 'Загрузка...';
    syncBtn.classList.add('bc-opacity-50', 'bc-cursor-not-allowed');

    const startDate = new Date(dateStr);

    try {
      await runScraper({ username: uname, startDate });
    } finally {
      syncBtn.disabled = false;
      syncBtn.innerText = 'Синхронизировать';
      syncBtn.classList.remove('bc-opacity-50', 'bc-cursor-not-allowed');
    }
  };

  formWrapper.appendChild(syncBtn);

  document.body.appendChild(toggleBtn);
  document.body.appendChild(formWrapper);

  // Initialize Lucide icons
  createIcons({
    icons: {
      RefreshCw,
      X,
    },
  });
}
