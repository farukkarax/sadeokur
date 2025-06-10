function toggleSadeMode() {
  const overlayId = 'sade-okur-overlay';
  const existingOverlay = document.getElementById(overlayId);

  if (existingOverlay) {
    existingOverlay.remove();
    document.body.style.overflow = '';
    return;
  }
  
  browser.storage.sync.get(['theme', 'font', 'fontSize']).then((settings) => {
    const documentClone = document.cloneNode(true);
    const article = new Readability(documentClone).parse();

    if (!article || !article.content) {
      alert("Bu sayfada okunabilir içerik bulunamadı.");
      return;
    }

    const theme = settings.theme || 'light';
    const font = settings.font || 'serif';
    const fontSize = settings.fontSize || 18;

    const overlay = document.createElement('div');
    overlay.id = overlayId;
    
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Kapat';
    closeButton.onclick = toggleSadeMode;

    const contentContainer = document.createElement('div');
    
    overlay.innerHTML = `
      <style>
        #${overlayId} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: ${theme === 'dark' ? '#1c1c1c' : (theme === 'sepia' ? '#f4f0e8' : '#ffffff')}; z-index: 2147483647; overflow-y: scroll; color: ${theme === 'dark' ? '#e8e6e3' : '#111111'}; font-family: ${font === 'serif' ? 'Georgia, "Times New Roman", Times, serif' : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'}; font-size: ${fontSize}px; line-height: 1.7; }
        #sade-okur-icerik { max-width: 720px; margin: 60px auto; padding: 40px; }
        #sade-okur-kapat { position: fixed; top: 20px; right: 30px; z-index: 2147483647; padding: 10px 15px; background: #333; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; }
        #sade-okur-icerik h1, #sade-okur-icerik h2, #sade-okur-icerik h3 { font-family: ${font === 'serif' ? 'Georgia, "Times New Roman", Times, serif' : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'}; }
        #sade-okur-icerik a { color: ${theme === 'dark' ? '#8cb4ff' : '#005b99'}; }
        #sade-okur-icerik img, #sade-okur-icerik figure, #sade-okur-icerik video { max-width: 100% !important; width: auto !important; height: auto !important; margin: 20px 0; display: block; }
        #sade-okur-icerik pre, #sade-okur-icerik code { background-color: rgba(0,0,0,0.05); padding: 2px 4px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; word-wrap: break-word; }
        #sade-okur-icerik pre { padding: 1em; overflow-x: auto; }
      </style>
    `;

    closeButton.id = 'sade-okur-kapat';
    contentContainer.id = 'sade-okur-icerik';
    contentContainer.innerHTML = `<h1>${article.title}</h1>${article.content}`;

    overlay.appendChild(closeButton);
    overlay.appendChild(contentContainer);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  });
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'TOGGLE_MODE') {
    toggleSadeMode();
  }
});