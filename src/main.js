import './style.css';
import { siteConfig } from './config.js';

const app = document.querySelector('#app');
const requestedPath = window.location.pathname.replace(/\/+$/, '') || '/';
const currentPage = requestedPath === '/about' ? 'about' : document.body.dataset.page ?? 'home';

if (currentPage === 'about') {
  document.title = 'About — Call a Christian';
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content',
    'Why Call a Christian exists.',
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

function siteHeader() {
  const isAbout = currentPage === 'about';
  return `
    <header class="site-header">
      <a class="brand" href="/" aria-label="Call a Christian home">
        <span class="brand-mark" aria-hidden="true">+</span>
        <span class="brand-name">Call a Christian</span>
      </a>
      <nav class="site-nav" aria-label="Primary navigation">
        <a href="${isAbout ? '/' : '/about'}">${isAbout ? 'Home' : 'About'}</a>
      </nav>
    </header>
  `;
}

function contactAction() {
  const ready = siteConfig.contactReady && siteConfig.contactNumberE164;

  if (!ready) {
    return '<div class="contact-action contact-action--inactive">Phone line coming soon</div>';
  }

  const phoneHref = `tel:${encodeURIComponent(siteConfig.contactNumberE164)}`;
  return `<a class="contact-action" href="${phoneHref}">Call ${escapeHtml(siteConfig.contactNumberDisplay)}</a>`;
}

function renderHome() {
  return `
    <div class="site-shell site-shell--home">
      ${siteHeader()}
      <main class="home-content" id="main-content">
        <section class="hero" aria-labelledby="home-heading">
          <h1 id="home-heading">Some things are easier <em>out loud.</em></h1>
          <p class="hero-description">For prayer, faith questions, or an honest conversation.</p>
          ${contactAction()}
        </section>
      </main>
    </div>
  `;
}

function renderAbout() {
  return `
    <div class="site-shell site-shell--about">
      ${siteHeader()}
      <main class="about-content" id="main-content">
        <section class="about-hero" aria-labelledby="about-heading">
          <p class="eyebrow">About</p>
          <h1 id="about-heading">A simple way to start a meaningful conversation.</h1>
          <p class="about-lede">Call a Christian is being built for prayer, faith questions, and the moments when you need someone to listen.</p>
        </section>
      </main>
    </div>
  `;
}

app.innerHTML = currentPage === 'about' ? renderAbout() : renderHome();
