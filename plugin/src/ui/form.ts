import { runScraper } from '../scraper/scraper';

export function initUI(): void {
  // Create Main Form Wrapper
  const formWrapper = document.createElement('div');
  formWrapper.id = 'bc-plugin-form';
  formWrapper.className = `
    bc-fixed bc-bottom-5 bc-right-5 bc-z-[999998] bc-bg-white 
    bc-p-5 bc-rounded-lg bc-shadow-2xl bc-border bc-border-gray-200 
    bc-w-72 bc-font-sans bc-text-gray-800
  `;

  // Title
  const title = document.createElement('h3');
  title.innerText = 'BarCrosser Синхронизация';
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
  usernameInput.className = 'bc-w-full bc-p-2 bc-border bc-border-gray-300 bc-rounded bc-focus:outline-none bc-focus:border-blue-500';
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
  
  dateInput.className = 'bc-w-full bc-p-2 bc-border bc-border-gray-300 bc-rounded bc-focus:outline-none bc-focus:border-blue-500';
  dateDiv.appendChild(dateLabel);
  dateDiv.appendChild(dateInput);
  formWrapper.appendChild(dateDiv);

  // Sync Button
  const syncBtn = document.createElement('button');
  syncBtn.innerText = 'Начать скраппинг';
  syncBtn.className = 'bc-w-full bc-bg-blue-600 hover:bc-bg-blue-700 bc-text-white bc-font-bold bc-py-2 bc-px-4 bc-rounded bc-transition-colors';
  
  syncBtn.onclick = async (e: MouseEvent) => {
    e.preventDefault();
    const uname = usernameInput.value.trim();
    const dateStr = dateInput.value;

    if (!uname) {
        alert('Введите никнейм пользователя.');
        return;
    }

    if (!dateStr) {
        alert('Выберите дату.');
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
        syncBtn.innerText = 'Начать скраппинг';
        syncBtn.classList.remove('bc-opacity-50', 'bc-cursor-not-allowed');
    }
  };

  formWrapper.appendChild(syncBtn);
  document.body.appendChild(formWrapper);
}
