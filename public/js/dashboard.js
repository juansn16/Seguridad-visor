document.addEventListener('DOMContentLoaded', async () => {
  const userLabel = document.getElementById('userLabel');
  const defaultMessage = document.getElementById('defaultMessage');
  const iframeTabs = document.getElementById('iframeTabs');
  const tabsContainer = document.getElementById('tabsContainer');
  const iframePanels = document.getElementById('iframePanels');

  try {
    const res = await fetch('/dashboard/user');
    const user = await res.json();

    userLabel.textContent = user.username;

    if (!user.iframes || user.iframes.length === 0) return;

    const iframes = user.iframes;

    if (iframes.length === 1) {
      const container = document.createElement('div');
      container.className = 'h-100';
      container.innerHTML = buildIframe(iframes[0].url);

      defaultMessage.classList.add('d-none');
      iframePanels.appendChild(container);
      iframePanels.classList.remove('d-none');
      return;
    }

    tabsContainer.innerHTML = iframes.map((iframe, i) => `
      <li class="nav-item" role="presentation">
        <button class="nav-link ${i === 0 ? 'active' : ''}" data-bs-toggle="tab" data-bs-target="#panel-${i}" type="button">${escapeHtml(iframe.name)}</button>
      </li>
    `).join('');

    iframePanels.innerHTML = `<div class="tab-content h-100">${iframes.map((iframe, i) => `
      <div class="tab-pane fade h-100 ${i === 0 ? 'show active' : ''}" id="panel-${i}">
        ${buildIframe(iframe.url)}
      </div>
    `).join('')}</div>`;

    defaultMessage.classList.add('d-none');
    iframeTabs.classList.remove('d-none');
    iframePanels.classList.remove('d-none');
  } catch {
    userLabel.textContent = 'Error al cargar datos';
  }
});

function buildIframe(url) {
  return `<iframe src="${escapeHtml(url)}" frameborder="0" width="100%" height="100%" allow="fullscreen" style="border:1px solid #EAEAEA;border-radius:4px;"></iframe>`;
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
