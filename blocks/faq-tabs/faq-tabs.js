export default function decorate(block) {
  const rows = [...block.children];

  const navContainer = document.createElement('div');
  navContainer.className = 'faq-nav-side';

  const displayContainer = document.createElement('div');
  displayContainer.className = 'faq-display-side';

  rows.forEach((row, index) => {
    const [tabCol, contentCol] = row.children;

    // Left Side Navigation Tab
    const tabButton = document.createElement('div');
    tabButton.className = `faq-tab ${index === 0 ? 'active' : ''}`;
    tabButton.dataset.index = index;
    tabButton.innerHTML = tabCol.innerHTML;

    tabButton.addEventListener('click', () => {
      // Tab active switch
      block.querySelectorAll('.faq-tab').forEach((t) => t.classList.remove('active'));
      tabButton.classList.add('active');

      // Content active switch
      block.querySelectorAll('.content-box').forEach((box) => box.classList.remove('active'));
      const activeBox = displayContainer.children[index];
      if (activeBox) activeBox.classList.add('active');
    });

    navContainer.appendChild(tabButton);

    // Right Side Content Box
    const contentBox = document.createElement('div');
    contentBox.className = `content-box ${index === 0 ? 'active' : ''}`;

    // Header Title
    const headerTitle = document.createElement('div');
    headerTitle.className = 'tab-content-header';
    headerTitle.innerHTML = tabCol.innerHTML;
    contentBox.appendChild(headerTitle);

    // Question (H3) & Answer (P) parsing for Accordion
    const headings = contentCol.querySelectorAll('h3');
    headings.forEach((h3) => {
      const qItem = document.createElement('div');
      qItem.className = 'q-item';

      const qHeader = document.createElement('div');
      qHeader.className = 'q-header';
      qHeader.innerHTML = `
        <p class="q-title">${h3.textContent}</p>
        <span class="toggle-icon"></span>
      `;

      const qAns = document.createElement('div');
      qAns.className = 'q-ans';

      let nextElem = h3.nextElementSibling;
      while (nextElem && nextElem.tagName !== 'H3') {
        qAns.appendChild(nextElem.cloneNode(true));
        nextElem = nextElem.nextElementSibling;
      }

      // Accordion click toggle
      qHeader.addEventListener('click', () => {
        qItem.classList.toggle('open');
      });

      qItem.appendChild(qHeader);
      qItem.appendChild(qAns);
      contentBox.appendChild(qItem);
    });

    displayContainer.appendChild(contentBox);
  });

  // Render transformed markup
  block.innerHTML = '';
  block.classList.add('faq-container');
  block.appendChild(navContainer);
  block.appendChild(displayContainer);
}
