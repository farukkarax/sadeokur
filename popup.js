document.addEventListener('DOMContentLoaded', () => {
  const activateButton = document.getElementById('activateButton');
  const themeSelect = document.getElementById('theme');
  const fontSelect = document.getElementById('font');
  const fontSizeInput = document.getElementById('fontSize');

  // 1. Ayarları yükle
  browser.storage.sync.get(['theme', 'font', 'fontSize']).then((settings) => {
    themeSelect.value = settings.theme || 'light';
    fontSelect.value = settings.font || 'serif';
    fontSizeInput.value = settings.fontSize || 18;
  });

  // 2. Ayarları kaydet
  themeSelect.addEventListener('change', () => { browser.storage.sync.set({ theme: themeSelect.value }); });
  fontSelect.addEventListener('change', () => { browser.storage.sync.set({ font: fontSelect.value }); });
  fontSizeInput.addEventListener('change', () => { browser.storage.sync.set({ fontSize: fontSizeInput.value }); });
  
  // 3. Buton eylemi
  activateButton.addEventListener('click', async () => {
    try {
      let [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id) {
        browser.tabs.sendMessage(tab.id, { type: 'TOGGLE_MODE' });
        window.close();
      }
    } catch (error) {
      console.error("Sade Okur: Sekmeye ulaşılamadı veya sayfa korumalı.", error);
      activateButton.textContent = "Bu Sayfada Çalışmaz";
      activateButton.disabled = true;
    }
  });
});