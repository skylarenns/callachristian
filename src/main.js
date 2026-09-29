import './style.css';
import { siteConfig } from './config.js';

const app = document.querySelector('#app');

function pageForPath() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return path === '/about' ? 'about' : 'home';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const crossPath = [
  '<path d="M18 3 C19 11 21 22 23 34" />',
  '<path d="M5 19 C14 17 23 15 33 14" />',
].join('');

function crosses(page) {
  const positions = page === 'home'
    ? [[12, 11, -18, 1.1], [83, 9, 16, 1.2], [43, 7, -10, .8], [67, 16, 16, .7], [8, 39, -16, .9], [16, 72, -12, 1], [78, 72, 11, .8], [31, 84, 15, .75], [87, 87, -11, 1], [8, 93, -18, .75]]
    : [[89, 7, 13, .9], [91, 36, -12, .7], [11, 47, -15, .85], [88, 79, 12, 1], [13, 93, -9, .85], [55, 95, 17, .8]];

  return `<div class="cross-field" aria-hidden="true">${positions.map(([x, y, rotation, scale], index) => `
    <svg class="sketch-cross sketch-cross--${index % 3}" viewBox="0 0 38 38" style="--x:${x}%;--y:${y}%;--rotation:${rotation}deg;--scale:${scale}">${crossPath}</svg>
  `).join('')}</div>`;
}

function arrowIcon() {
  return '<svg viewBox="0 0 72 35" aria-hidden="true"><path d="M69 18 C48 18 26 18 5 19 M19 3 C14 9 10 14 5 19 C10 24 15 27 21 32" /></svg>';
}

function phoneAction() {
  const ready = siteConfig.contactReady && siteConfig.contactNumberE164;
  if (!ready) {
    return '<div class="phone-action phone-action--inactive" aria-label="Phone line coming soon">Phone line<br><span>coming soon</span></div>';
  }
  const phoneHref = `tel:${escapeHtml(siteConfig.contactNumberE164)}`;
  return `
    <button class="phone-action phone-action--ready" type="button" aria-expanded="false" aria-controls="contact-options">Call<br><span>${escapeHtml(siteConfig.contactNumberDisplay)}</span></button>
    <div class="contact-options" id="contact-options" hidden>
      <a href="${phoneHref}">Call now</a>
      <button type="button" id="copy-number">Copy number</button>
      <button type="button" id="save-contact">Save contact</button>
    </div>
    <p class="contact-feedback" role="status" aria-live="polite"></p>
  `;
}

function home() {
  return `
    <main id="main-content" class="sketch-page sketch-page--home" tabindex="-1">
      <section class="poster poster--home" aria-labelledby="home-heading">
        ${crosses('home')}
        <div class="poster-content home-content">
          <div class="home-message">
            <h1 id="home-heading">Call a<br><span>Christian</span></h1>
            <div class="scribble-rule" aria-hidden="true"></div>
            ${phoneAction()}
            <p class="home-description">Prayer, faith questions,<br>or someone to talk to.</p>
          </div>
          <a class="about-link" href="/about"><span>About</span>${arrowIcon()}</a>
        </div>
      </section>
    </main>
  `;
}

function portrait(name, side) {
  return `
    <div class="founder founder--${side}">
      <div class="portrait" role="img" aria-label="Portrait of ${escapeHtml(name)} coming soon">
        <svg viewBox="0 0 116 130" aria-hidden="true"><path d="M38 111 C39 92 51 84 59 84 C74 84 84 94 86 111 M58 78 C43 78 38 68 38 51 C38 34 48 23 59 23 C72 23 81 34 81 51 C81 67 73 78 58 78" /></svg>
      </div>
      <p class="founder-name">${escapeHtml(name)}</p>
    </div>
  `;
}

function about() {
  return `
    <main id="main-content" class="sketch-page sketch-page--about" tabindex="-1">
      <section class="poster poster--about" aria-labelledby="about-heading">
        ${crosses('about')}
        <div class="poster-content about-content">
          <a class="back-link" href="/" aria-label="Back to home">${arrowIcon()}<span>Back</span></a>
          <div class="about-intro">
            <h1 id="about-heading">What this is.</h1>
            <div class="scribble-rule" aria-hidden="true"></div>
            <p>A place to ask about faith, request prayer, or have an honest conversation.</p>
          </div>
          <div class="founders" aria-label="The people behind Call a Christian">
            ${portrait('Skylar Enns', 'left')}
            ${portrait('Aden Speight', 'right')}
          </div>
        </div>
      </section>
    </main>
  `;
}

function bindPhoneAction() {
  if (!siteConfig.contactReady || !siteConfig.contactNumberE164) return;
  const trigger = app.querySelector('.phone-action--ready');
  const options = app.querySelector('#contact-options');
  const feedback = app.querySelector('.contact-feedback');

  trigger.addEventListener('click', () => {
    const opening = options.hidden;
    options.hidden = !opening;
    trigger.setAttribute('aria-expanded', String(opening));
  });

  app.querySelector('#copy-number').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.contactNumberDisplay);
      feedback.textContent = 'Number copied.';
    } catch {
      feedback.textContent = 'Copy unavailable in this browser.';
    }
  });

  app.querySelector('#save-contact').addEventListener('click', () => {
    const vcard = `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Call a Christian\r\nTEL;TYPE=VOICE:${siteConfig.contactNumberE164}\r\nEND:VCARD\r\n`;
    const url = URL.createObjectURL(new Blob([vcard], { type: 'text/vcard' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Call a Christian.vcf';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    feedback.textContent = 'Contact downloaded.';
  });
}

function renderPage() {
  const isAbout = pageForPath() === 'about';
  document.title = isAbout ? 'About — Call a Christian' : 'Call a Christian';
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content',
    isAbout
      ? 'A place for prayer, faith questions, and an honest conversation.'
      : 'Call a Christian for prayer, a faith question, or someone to talk to.',
  );
  app.innerHTML = isAbout ? about() : home();
  if (!isAbout) bindPhoneAction();
}

app.addEventListener('click', (event) => {
  const link = event.target.closest('.about-link, .back-link');
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (window.location.pathname !== link.pathname) {
    window.history.pushState(null, '', link.pathname);
    renderPage();
    window.scrollTo(0, 0);
    app.querySelector('main')?.focus({ preventScroll: true });
  }
});

window.addEventListener('popstate', renderPage);
renderPage();
