/**
 * Simple Tailwind-styled notification system
 */

let container: HTMLDivElement | null = null;

function getContainer(): HTMLDivElement {
  if (!container) {
    container = document.createElement('div');
    container.className = 'bc-notification-container';
    document.body.appendChild(container);
  }
  return container;
}

export function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  const cont = getContainer();
  const alertEl = document.createElement('div');

  let bgClass = 'bc-bg-blue-500';
  let borderClass = 'bc-border-blue-600';
  let textClass = 'bc-text-white';

  if (type === 'success') {
    bgClass = 'bc-bg-green-500';
    borderClass = 'bc-border-green-600';
  } else if (type === 'error') {
    bgClass = 'bc-bg-red-500';
    borderClass = 'bc-border-red-600';
  }

  alertEl.className = `bc-flex bc-items-center bc-p-4 bc-mb-4 bc-text-sm ${textClass} ${borderClass} ${bgClass} bc-border bc-rounded-lg bc-shadow-lg bc-transition-opacity bc-duration-300`;
  alertEl.innerHTML = `
    <div>
      <span class="bc-font-medium">${type === 'error' ? 'Ошибка:' : type === 'success' ? 'Успех!' : 'Инфо:'}</span> ${message}
    </div>
  `;

  cont.appendChild(alertEl);

  // Auto remove after 5 seconds
  setTimeout(() => {
    alertEl.style.opacity = '0';
    setTimeout(() => {
      alertEl.remove();
    }, 300); // Wait for transition
  }, 5000);
}
