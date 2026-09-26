function decorateHeroBaner(block) {
  const [bgRow, contentRow] = [...block.children];
  if (!bgRow || !contentRow) return;

  // background row (decorative)
  bgRow.classList.add('hero-baner-bg');
  bgRow.setAttribute('aria-hidden', 'true');

  const bgImg = bgRow.querySelector('img');
  if (bgImg) {
    const src = bgImg.currentSrc || bgImg.src;
    bgRow.style.setProperty('--hero-baner-bg-image', `url("${src}")`);
  }

  // content row
  contentRow.classList.add('hero-baner-content');
  const [textCol, mediaCol] = [...contentRow.children];

  if (textCol) {
    textCol.classList.add('hero-baner-text');

    // CTA
    const cta = textCol.querySelector('p > a');
    if (cta) {
      cta.classList.add('hero-baner-cta');
      cta.parentElement.classList.add('hero-baner-cta-wrap');
    }
  }

  if (mediaCol && mediaCol.querySelector('picture')) {
    mediaCol.classList.add('hero-baner-media');
    // hero image
    mediaCol.querySelector('img')?.setAttribute('loading', 'eager');
  } else {
    contentRow.classList.add('hero-baner-no-media');
  }
}

/* supplement  */
function decorateSupplement(block) {
  const row = block.firstElementChild;
  if (!row) return;

  row.classList.add('supplement-row');
  const [textCol, mediaCol] = [...row.children];

  // ---- photo side ----
  if (mediaCol && mediaCol.querySelector('picture')) {
    mediaCol.classList.add('supplement-media');
  } else {
    row.classList.add('supplement-no-media');
  }

  if (!textCol) return;
  textCol.classList.add('supplement-text');

  // ---- play icon ----
  const iconPicture = textCol.querySelector('picture');
  const iconWrap = iconPicture ? (iconPicture.closest('p') || iconPicture) : null;
  iconWrap?.classList.add('supplement-icon');

  // ---- "more services" link ----
  const link = textCol.querySelector('a');
  const linkWrap = link ? (link.closest('p') || link) : null;
  if (linkWrap && linkWrap !== iconWrap) linkWrap.classList.add('supplement-link');

  // ---- description  ----
  textCol.querySelectorAll(':scope > p').forEach((p) => {
    if (p !== iconWrap && p !== linkWrap) p.classList.add('supplement-desc');
  });
}

/* ------------------------------------------------------------------ */
export default function decorate(block) {
  if (block.classList.contains('hero-baner')) {
    decorateHeroBaner(block);
    return;
  }

  if (block.classList.contains('supplement')) {
    decorateSupplement(block);
  }
}
