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
/* ---- video modal helpers ---- */
function getVideoEmbed(url) {
  try {
    const u = new URL(url, window.location.href);
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      const id = u.hostname.includes('youtu.be') ? u.pathname.slice(1) : u.searchParams.get('v');
      return { type: 'iframe', src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` };
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return { type: 'iframe', src: `https://player.vimeo.com/video/${id}?autoplay=1` };
    }
  } catch (e) {
    // invalid url -> direct video file
  }
  return { type: 'video', src: url };
}
/* ---- video modal ---- */
/* ---- play video in the same place as the image ---- */
function toggleInlineVideo(mediaCol, url) {
  const existing = mediaCol.querySelector('.supplement-player');

  // 2nd click -> video stop panni image thirumba kaattum
  if (existing) {
    existing.remove();
    mediaCol.classList.remove('is-playing');
    return;
  }

  const { type, src } = getVideoEmbed(url);
  let player;

  if (type === 'iframe') {
    player = document.createElement('iframe');
    player.src = src;
    player.allow = 'autoplay; fullscreen; picture-in-picture';
    player.allowFullscreen = true;
    player.title = 'Supplement video';
  } else {
    player = document.createElement('video');
    player.src = src;
    player.controls = true;
    player.autoplay = true;
    player.playsInline = true;
  }

  player.classList.add('supplement-player');
  mediaCol.append(player);
  mediaCol.classList.add('is-playing');
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

  // ---- video link (right cell) -> URL eduthu link ah hide ----
  let videoUrl = '';
  const videoLink = mediaCol?.querySelector('a');
  if (videoLink) {
    videoUrl = videoLink.href;
    const wrap = videoLink.closest('p');
    const hideTarget = wrap && !wrap.querySelector('picture') ? wrap : videoLink;
    hideTarget.classList.add('supplement-video-link');
  }

  if (!textCol) return;
  textCol.classList.add('supplement-text');

  // ---- play icon ----
  const iconPicture = textCol.querySelector('picture');
  const iconWrap = iconPicture ? (iconPicture.closest('p') || iconPicture) : null;
  iconWrap?.classList.add('supplement-icon');

  if (iconWrap && videoUrl) {
    iconWrap.setAttribute('role', 'button');
    iconWrap.setAttribute('tabindex', '0');
    iconWrap.setAttribute('aria-label', 'Play video');
    iconWrap.addEventListener('click', () => toggleInlineVideo(mediaCol, videoUrl));
    iconWrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleInlineVideo(mediaCol, videoUrl);
      }
    });
  }

  // ---- "more services" link ----
  const link = textCol.querySelector('a');
  const linkWrap = link ? (link.closest('p') || link) : null;
  if (linkWrap && linkWrap !== iconWrap) linkWrap.classList.add('supplement-link');

  // ---- description ----
  textCol.querySelectorAll(':scope > p').forEach((p) => {
    if (p !== iconWrap && p !== linkWrap) p.classList.add('supplement-desc');
  });
}

/* ------------------------------------------------------------------ */
export default function decorate(block) {
  if (block.classList.contains('hero-baner')) {
    block.closest('.section')?.setAttribute('id', 'home');
    decorateHeroBaner(block);
    return;
  }

  if (block.classList.contains('supplement')) {
    decorateSupplement(block);
  }
}
