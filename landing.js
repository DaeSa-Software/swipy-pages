(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var menuButton = document.querySelector('.menu-button');
  var nav = document.getElementById('site-nav');

  function updateHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  }

  function closeMenu() {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      var open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
      document.body.classList.toggle('menu-open', !open);
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  var ua = (navigator.userAgent || '').toLowerCase();
  var platform = (navigator.platform || '').toLowerCase();
  var isMac = /mac/.test(platform) || /macintosh|mac os x/.test(ua);
  var isIos = /iphone|ipad|ipod/.test(ua) || platform === 'iphone' || platform === 'ipad';
  if (isIos) isMac = false;

  var downloadButton = document.getElementById('download-swipy');
  var downloadLabel = document.getElementById('download-label');
  var versionLabel = document.getElementById('download-version');
  var platformLabel = document.getElementById('download-platform-label');
  var platformIcon = document.getElementById('download-platform-icon');
  var heroEyebrow = document.getElementById('hero-eyebrow');
  var windowsTip = document.getElementById('tip-windows');
  var macTip = document.getElementById('tip-mac');

  if (isMac) {
    if (downloadLabel) downloadLabel.textContent = 'Descargar para macOS';
    if (platformLabel) platformLabel.textContent = 'macOS 11 o superior';
    if (versionLabel) versionLabel.textContent = 'Preview Avalonia para Apple Silicon';
    if (heroEyebrow) heroEyebrow.textContent = 'Punto de venta para macOS · Preview Avalonia';
    if (windowsTip) windowsTip.hidden = true;
    if (macTip) macTip.hidden = false;
    if (platformIcon) {
      platformIcon.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M17.1 12.1c0-2.8 2.3-4.2 2.4-4.2-1.3-1.9-3.3-2.2-4.1-2.2-1.7-.2-3.4 1-4.2 1-.9 0-2.2-1-3.7-1-1.9 0-3.6 1.1-4.6 2.8-2 3.4-.5 8.4 1.4 11.2.9 1.4 2 2.9 3.5 2.8 1.4-.1 1.9-.9 3.6-.9s2.2.9 3.7.9c1.5 0 2.5-1.4 3.4-2.7 1.1-1.6 1.5-3.1 1.5-3.2 0 0-2.9-1.1-2.9-4.5ZM14.3 4.1c.8-.9 1.3-2.3 1.2-3.6-1.1.1-2.5.8-3.3 1.7-.7.8-1.4 2.2-1.2 3.4 1.3.1 2.5-.6 3.3-1.5Z" fill="currentColor"/>' +
        '</svg>';
    }
  }

  function chooseAsset(assets) {
    if (!Array.isArray(assets) || !assets.length) return null;

    if (isMac) {
      return assets.find(function (asset) { return /(?:mac|osx).*\.pkg$/i.test(asset.name); }) ||
        assets.find(function (asset) { return /(?:mac|osx)-arm64.*\.zip$/i.test(asset.name); }) ||
        assets.find(function (asset) { return /(?:mac|osx).*\.zip$/i.test(asset.name); }) ||
        assets.find(function (asset) { return /(?:mac|osx).*\.dmg$/i.test(asset.name); });
    }

    return assets.find(function (asset) { return /setup.*\.exe$/i.test(asset.name); }) ||
      assets.find(function (asset) { return /\.exe$/i.test(asset.name); }) ||
      assets.find(function (asset) { return /\.zip$/i.test(asset.name); }) ||
      assets[0];
  }

  if (downloadButton && typeof window.fetch === 'function') {
    window.fetch('https://api.github.com/repos/DaeSa-Software/swipy-pages/releases/latest', {
      headers: { Accept: 'application/vnd.github+json' }
    })
      .then(function (response) {
        return response.ok ? response.json() : null;
      })
      .then(function (release) {
        if (!release) return;
        var asset = chooseAsset(release.assets);
        if (asset && asset.browser_download_url) {
          downloadButton.href = asset.browser_download_url;
        }
        if (versionLabel && release.tag_name) {
          var format = asset && /\.exe$/i.test(asset.name) ? 'Instalador' : isMac ? 'Preview Avalonia' : 'Paquete';
          versionLabel.textContent = format + ' · ' + release.tag_name;
        }
      })
      .catch(function () {
        // El enlace estable a Releases permanece disponible como respaldo.
      });
  }
}());
