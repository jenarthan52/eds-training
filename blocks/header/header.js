import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code !== 'Escape') return;

  const nav = document.getElementById('nav');

  if (!nav) return;

  const navSections = nav.querySelector('.nav-sections');

  if (!navSections) return;

  const expanded =
    navSections.querySelector('[aria-expanded="true"]');

  if (expanded && isDesktop.matches) {
    toggleAllNavSections(navSections);
    expanded.focus();
  } else if (!isDesktop.matches) {
    toggleMenu(nav, navSections);
    nav.querySelector('.nav-hamburger button')?.focus();
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;

  if (nav.contains(e.relatedTarget)) return;

  const navSections = nav.querySelector('.nav-sections');

  if (!navSections) return;

  const expanded =
    navSections.querySelector('[aria-expanded="true"]');

  if (expanded && isDesktop.matches) {
    toggleAllNavSections(navSections, false);
  }

}

/**
 * Keyboard dropdown
 */
function openOnKeydown(e) {
  const focused = document.activeElement;

  if (!focused.classList.contains('nav-drop')) return;

  if (e.code !== 'Enter' && e.code !== 'Space') return;

  e.preventDefault();

  const expanded =
    focused.getAttribute('aria-expanded') === 'true';

  toggleAllNavSections(
    focused.closest('.nav-sections')
  );

  focused.setAttribute(
    'aria-expanded',
    expanded ? 'false' : 'true'
  );
}

function focusNavSection() {
  document.activeElement.addEventListener(
    'keydown',
    openOnKeydown
  );
}

/**
 * Toggle all dropdowns
 */
function toggleAllNavSections(
  sections,
  expanded = false
) {
  if (!sections) return;

  sections
    .querySelectorAll(
      '.default-content-wrapper > ul > li'
    )
    .forEach((section) => {
      section.setAttribute(
        'aria-expanded',
        expanded
      );
    });
}

/**
 * Toggle mobile menu
 */
function toggleMenu(
  nav,
  navSections,
  forceExpanded = null
) {
  if (!nav || !navSections) return;

  const expanded =
    forceExpanded !== null
      ? !forceExpanded
      : nav.getAttribute('aria-expanded') === 'true';

  const button =
    nav.querySelector('.nav-hamburger button');

  document.body.style.overflowY =
    expanded || isDesktop.matches
      ? ''
      : 'hidden';

  nav.setAttribute(
    'aria-expanded',
    expanded ? 'false' : 'true'
  );

  toggleAllNavSections(
    navSections,
    false
  );

  if (button) {
    button.setAttribute(
      'aria-label',
      expanded
        ? 'Open navigation'
        : 'Close navigation'
    );
  }

  /*
   * Dropdown keyboard accessibility
   */
  const navDrops =
    navSections.querySelectorAll('.nav-drop');

  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', '0');

        drop.addEventListener(
          'focus',
          focusNavSection
        );
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');

      drop.removeEventListener(
        'focus',
        focusNavSection
      );
    });
  }

  /*
   * Escape / focus lost
   */
  if (!expanded || isDesktop.matches) {
    window.addEventListener(
      'keydown',
      closeOnEscape
    );

    nav.addEventListener(
      'focusout',
      closeOnFocusLost
    );
  } else {
    window.removeEventListener(
      'keydown',
      closeOnEscape
    );

    nav.removeEventListener(
      'focusout',
      closeOnFocusLost
    );
  }
}

/**
 * Header decoration
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');

  const navPath = navMeta
    ? new URL(navMeta, window.location).pathname
    : '/nav';

  const fragment = await loadFragment(navPath);
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  while (fragment.firstElementChild) {
    nav.append(fragment.firstElementChild);
  }

  const classes = [
    'brand',
    'sections',
    'tools',
  ];

  classes.forEach((name, index) => {
    const section = nav.children[index];

    if (section) {
      section.classList.add(
        `nav-${name}`
      );
    }
  });

  /*
   * Brand
   */
  const navBrand =
    nav.querySelector('.nav-brand');

  if (navBrand) {
    const brandLink =
      navBrand.querySelector('.button');

    if (brandLink) {
      brandLink.className = '';

      const buttonContainer =
        brandLink.closest('.button-container');

      if (buttonContainer) {
        buttonContainer.className = '';
      }
    }
  }

  /*
   * Navigation sections
   */
  const navSections =
    nav.querySelector('.nav-sections');

  if (navSections) {
    const menuItems =
      navSections.querySelectorAll(
        ':scope .default-content-wrapper > ul > li'
      );

    menuItems.forEach((navSection) => {
      /*
       * Dropdown
       */
      if (navSection.querySelector('ul')) {
        navSection.classList.add('nav-drop');
      }

      /*
       * Search
       */
      const searchIcon =
        navSection.querySelector(
          'img[data-icon-name="search"]'
        );

      if (searchIcon) {
        navSection.classList.add(
          'nav-search'
        );
      }

      /*
       * Order button
       */
      const text =
        navSection.textContent
          .trim()
          .toLowerCase();

      if (
        text.includes('order now') ||
        text.includes('edit image')
      ) {
        navSection.classList.add(
          'nav-order'
        );
      }

      /*
       * Dropdown click
       */
      navSection.addEventListener(
        'click',
        () => {
          if (!navSection.classList.contains('nav-drop')) return;

          const expanded =
            navSection.getAttribute(
              'aria-expanded'
            ) === 'true';

          toggleAllNavSections(
            navSections
          );

          navSection.setAttribute(
            'aria-expanded',
            expanded
              ? 'false'
              : 'true'
          );
        }
      );
    });
  }

  /*
   * Mobile hamburger
   */
  const hamburger =
    document.createElement('div');

  hamburger.classList.add(
    'nav-hamburger'
  );

  hamburger.innerHTML = `
    <button
      type="button"
      aria-controls="nav"
      aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>
  `;

  hamburger.addEventListener(
    'click',
    () => {
      toggleMenu(
        nav,
        navSections
      );
    }
  );

  nav.prepend(hamburger);

  nav.setAttribute(
    'aria-expanded',
    'false'
  );

  toggleMenu(
    nav,
    navSections,
    isDesktop.matches
  );

  isDesktop.addEventListener(
    'change',
    () => {
      toggleMenu(
        nav,
        navSections,
        isDesktop.matches
      );
    }
  );

  const navWrapper =
    document.createElement('div');

  navWrapper.className =
    'nav-wrapper';

  navWrapper.append(nav);

  block.append(navWrapper);
}