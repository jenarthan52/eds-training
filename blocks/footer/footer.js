import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footerContent = document.createElement('div');
  footerContent.className = 'footer-content';
  while (fragment.firstElementChild) footerContent.append(fragment.firstElementChild);
  block.append(footerContent);

  // ===== TOP SECTION (4 columns: brand, links, posts, company) =====
  const topSection = footerContent.querySelector('.custom-footer-container');
  if (topSection) topSection.classList.add('footer-top');

  const columns = footerContent.querySelectorAll('.custom-footer > div');
  const columnNames = ['footer-col-brand', 'footer-col-links', 'footer-col-posts', 'footer-col-company'];
  columns.forEach((col, i) => {
    if (columnNames[i]) col.classList.add(columnNames[i]);
  });

  // Brand column: logo, description, social icons
  const brandCol = footerContent.querySelector('.footer-col-brand > div');
  if (brandCol) {
    const paras = brandCol.querySelectorAll(':scope > p');
    if (paras[0]) paras[0].classList.add('footer-logo');
    if (paras[1]) paras[1].classList.add('footer-description');
    if (paras[2]) paras[2].classList.add('footer-social');
  }

  // Recent Posts column: group [picture-p, h4, date-p] into .footer-post wrappers
  const postsCol = footerContent.querySelector('.footer-col-posts > div');
  if (postsCol) {
    const children = [...postsCol.children].filter((el) => el.tagName !== 'H3');
    for (let i = 0; i < children.length; i += 3) {
      const pictureEl = children[i];
      const titleEl = children[i + 1];
      const dateEl = children[i + 2];
      if (!pictureEl || !titleEl) break;

      const postWrapper = document.createElement('div');
      postWrapper.className = 'footer-post';

      const postText = document.createElement('div');
      postText.className = 'footer-post-text';

      pictureEl.classList.add('footer-post-image');
      titleEl.classList.add('footer-post-title');
      if (dateEl) dateEl.classList.add('footer-post-date');

      postText.append(titleEl);
      if (dateEl) postText.append(dateEl);

      postWrapper.append(pictureEl, postText);
      postsCol.insertBefore(postWrapper, children[i + 3] || null);
    }
  }

  // ===== BOTTOM SECTION (copyright + payment icons) =====
  const bottomWrapper = footerContent.querySelector('.default-content-wrapper');
  if (bottomWrapper) {
    const bottomSection = bottomWrapper.closest('.section');
    if (bottomSection) bottomSection.classList.add('footer-bottom');

    const paras = bottomWrapper.querySelectorAll(':scope > p');
    if (paras[0]) {
      paras[0].classList.add('footer-copyright');
      // wrap the word "dawa" in a span so it can be colored separately
      paras[0].innerHTML = paras[0].innerHTML.replace(
        /\bdawa\b/i,
        '<span class="footer-brand-highlight">$&</span>',
      );
    }
    if (paras[1]) paras[1].classList.add('footer-payment');
  }
}