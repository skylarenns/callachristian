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

function siteHeader() {
  return `
    <header class="site-header">
      <a class="brand" href="/" aria-label="Call a Christian home">
        <span class="brand-mark" aria-hidden="true">+</span>
        <span class="brand-copy">
          <span class="brand-name">Call a Christian</span>
          <span class="brand-kicker">A quiet place to be heard</span>
        </span>
      </a>
      <nav class="site-nav" aria-label="Primary navigation">
        <span class="header-status"><span class="status-dot" aria-hidden="true"></span>Phone line in progress</span>
        <a href="/about" ${currentPage === 'about' ? 'aria-current="page"' : ''}>About</a>
      </nav>
    </header>
  `;
}

function siteFooter() {
  return `
    <footer class="site-footer">
      <p>For prayer, questions, and honest conversation.</p>
      <span>© ${new Date().getFullYear()} Call a Christian</span>
    </footer>
  `;
}

function contactAction() {
  const ready = siteConfig.contactReady && siteConfig.contactNumberE164;

  if (!ready) {
    return `
      <div class="contact-action contact-action--inactive">
        <div>
          <span class="action-label">The line is being set up</span>
          <strong>We’ll share the number here soon.</strong>
        </div>
        <span class="action-arrow" aria-hidden="true">→</span>
      </div>
    `;
  }

  const phoneHref = `tel:${encodeURIComponent(siteConfig.contactNumberE164)}`;
  return `
    <a class="contact-action" href="${phoneHref}">
      <div>
        <span class="action-label">Call the line</span>
        <strong>${escapeHtml(siteConfig.contactNumberDisplay)}</strong>
      </div>
      <span class="action-arrow" aria-hidden="true">→</span>
    </a>
  `;
}

function renderHome() {
  return `
    <div class="site-shell site-shell--home">
      ${siteHeader()}
      <main class="home-content" id="main-content">
        <section class="hero" aria-labelledby="home-heading">
          <div class="hero-copy">
            <p class="eyebrow">A human voice for the hard moments</p>
            <h1 id="home-heading">Some things are easier <em>out loud.</em></h1>
            <p class="hero-description">Call a Christian is a simple way to reach someone for prayer, a faith question, or an honest conversation.</p>
            <div class="hero-actions">
              ${contactAction()}
              <a class="text-link" href="/about">Why this exists <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <aside class="hero-card" aria-label="What this is for">
            <span class="hero-card-mark" aria-hidden="true">✦</span>
            <p class="hero-card-label">No perfect words needed.</p>
            <p class="hero-card-title">Say it<br />as it is.</p>
            <div class="hero-card-rule" aria-hidden="true"></div>
            <p class="hero-card-meta">Prayer <span>·</span> Questions <span>·</span> Conversation</p>
          </aside>
        </section>

        <section class="reasons" aria-labelledby="reasons-heading">
          <p class="section-label" id="reasons-heading">Start wherever you are</p>
          <div class="reason-grid">
            <article><span>01</span><h2>Need prayer?</h2><p>Bring the thing that feels too heavy to hold by yourself.</p></article>
            <article><span>02</span><h2>Have a question?</h2><p>Faith can be complicated. You don’t need a polished question.</p></article>
            <article><span>03</span><h2>Need to talk?</h2><p>Sometimes being listened to is the first good step.</p></article>
          </div>
        </section>

        <blockquote class="scripture-block">
          <span class="quote-mark" aria-hidden="true">“</span>
          <div><p>${escapeHtml(siteConfig.scriptureText)}</p><cite>${escapeHtml(siteConfig.scriptureReference)}</cite></div>
        </blockquote>
      </main>
      ${siteFooter()}
    </div>
  `;
}

function renderAbout() {
  const people = siteConfig.founders.map((founder) => ({
    name: isPlaceholder(founder.name) ? 'Founder details coming soon' : founder.name,
    copy: isPlaceholder(founder.name)
      ? 'We’re still shaping this space and will share more about the people behind it soon.'
      : 'A person behind the project, building a simpler way to start a meaningful conversation.',
    image: founder.image,
  }));

  const cards = people
    .map(
      (person) => `
        <article class="founder-card">
          <div class="founder-portrait" role="img" aria-label="Portrait coming soon">
            ${isPlaceholder(person.image) ? '<span>Portrait coming soon</span>' : `<img src="${escapeHtml(person.image)}" alt="Portrait of ${escapeHtml(person.name)}" />`}
          </div>
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
        <section class="about-hero" aria-labelledby="about-heading">
          <div>
            <p class="eyebrow">About the project</p>
            <h1 class="about-heading" id="about-heading">Start with a voice, not a form.</h1>
          </div>
          <p class="about-lede">Call a Christian is being built around a simple idea: when life gets heavy, a real conversation can be a meaningful next step.</p>
        </section>

        <section class="principles" aria-labelledby="principles-heading">
          <p class="section-label" id="principles-heading">The idea is simple</p>
          <ol>
            <li><span>01</span><strong>You don’t need the right words.</strong><p>Start with what’s true. That’s enough.</p></li>
            <li><span>02</span><strong>This is a conversation, not a performance.</strong><p>No form to fill out. No version of yourself to prepare.</p></li>
            <li><span>03</span><strong>The phone line is still being built.</strong><p>${escapeHtml(siteConfig.responsePromise)}</p></li>
          </ol>
        </section>

        <section class="about-team" aria-labelledby="team-heading">
          <div class="section-heading">
            <p class="section-label">The people behind it</p>
            <h2 id="team-heading">A work in progress, made with care.</h2>
          </div>
          <div class="founders-grid">${cards}</div>
        </section>

        <blockquote class="scripture-block scripture-block--about">
          <span class="quote-mark" aria-hidden="true">“</span>
          <div><p>${escapeHtml(siteConfig.scriptureText)}</p><cite>${escapeHtml(siteConfig.scriptureReference)}</cite></div>
        </blockquote>
      </main>
      ${siteFooter()}
    </div>
  `;
}

app.innerHTML = currentPage === 'about' ? renderAbout() : renderHome();
