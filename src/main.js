import './style.css';
import { siteConfig } from './config.js';

const app = document.querySelector('#app');
const requestedPath = window.location.pathname.replace(/\/+$/, '') || '/';
const currentPage = requestedPath === '/about' ? 'about' : document.body.dataset.page ?? 'home';

if (currentPage === 'about') {
  document.title = 'About — Call a Christian';
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content',
    'Why Call a Christian exists and who is behind it.',
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function isPlaceholder(value) {
  return !value || value.startsWith('[[');
}

function founderName(founder) {
  return isPlaceholder(founder.name) ? 'First name coming soon' : founder.name;
}

function founderPortrait(founder) {
  if (!isPlaceholder(founder.image)) {
    return `<img src="${escapeHtml(founder.image)}" alt="Portrait of ${escapeHtml(founderName(founder))}" />`;
  }

  return '<span>Portrait coming soon</span>';
}

function siteHeader() {
  return `
    <header class="site-header">
      <a class="brand" href="/">Call a Christian</a>
    </header>
  `;
}

function siteFooter() {
  const aboutState = currentPage === 'about' ? 'aria-current="page"' : '';

  return `
    <footer class="site-footer">
      <a href="/about" ${aboutState}>About</a>
      <span class="instagram-placeholder" role="img" aria-label="Instagram coming soon" title="Instagram coming soon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" class="instagram-dot" />
        </svg>
      </span>
    </footer>
  `;
}

function phoneDisplay() {
  const ready = siteConfig.contactReady && siteConfig.contactNumberE164;
  const displayNumber = escapeHtml(siteConfig.contactNumberDisplay);

  if (!ready) {
    return `<span class="contact-number contact-number--inactive" title="Number coming soon">${displayNumber}</span>`;
  }

  const phoneHref = `tel:${encodeURIComponent(siteConfig.contactNumberE164)}`;
  return `<a class="contact-number" href="${phoneHref}">${displayNumber}</a>`;
}

function renderMinimalPage(isAbout = false) {
  return `
    <div class="site-shell site-shell--${isAbout ? 'about' : 'home'}">
      ${siteHeader()}
      <main class="home-content" id="main-content">
        <section class="home-intro" aria-labelledby="home-heading">
          <div class="number-panel">
            <h1 id="home-heading">${phoneDisplay()}</h1>
          </div>
          <p class="home-explanation">
            ${isAbout ? 'A simple way to reach someone for prayer, a faith question, or an honest conversation.' : 'Need prayer, a question, or someone to talk to? Call a Christian.'}
          </p>
        </section>

        <blockquote class="scripture-block">
          <p>${escapeHtml(siteConfig.scriptureText)}</p>
          <cite>${escapeHtml(siteConfig.scriptureReference)}</cite>
        </blockquote>
      </main>
      ${siteFooter()}
    </div>
  `;
}

function renderHome() {
  return renderMinimalPage(false);
}

function renderAbout() {
  const people = [
    {
      name: 'Skylar',
      copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Aden',
      copy: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ];

  const cards = people
    .map(
      (person) => `
        <article class="founder-card">
          <div class="founder-portrait" role="img" aria-label="Blank portrait placeholder for ${escapeHtml(person.name)}"></div>
          <h2>${escapeHtml(person.name)}</h2>
          <p class="founder-copy">${escapeHtml(person.copy)}</p>
        </article>
      `,
    )
    .join('');

  return `
    <div class="site-shell site-shell--about">
      ${siteHeader()}
      <main class="about-content" id="main-content">
        <section class="about-people" aria-labelledby="about-heading">
          <p class="eyebrow">About</p>
          <h1 class="about-heading" id="about-heading">Two friends.</h1>
          <div class="founders-grid">${cards}</div>
        </section>
      </main>
      ${siteFooter()}
    </div>
  `;
}

app.innerHTML = currentPage === 'about' ? renderAbout() : renderHome();
