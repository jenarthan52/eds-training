export default function decorate(block) {
  const cards = [...block.children];
  cards.forEach((card) => {
    card.classList.add('custom-card');

    const imageWrapper = card.querySelector('picture')?.parentElement;
    imageWrapper?.classList.add('custom-card-image-wrapper');

    const image = card.querySelector('img');
    image?.classList.add('custom-card-image');

    const description = card.querySelector('p:not(:has(img))');
    description?.classList.add('custom-card-description');
    const title = card.querySelector('h3');
    title?.classList.add('custom-card-title');
  });

  // Product card
  if (block.classList.contains('product')) {
    cards.forEach((card) => {
      const paragraphs = [...card.querySelectorAll('p')];

      const price = paragraphs.find((p) => !p.querySelector('a'));
      price?.classList.add('product-price');

      const link = card.querySelector('a');

      if (link) {
        link.classList.add('product-button');

        link.closest('p')?.classList.add('product-button-wrapper');
      }

      const priceRow = document.createElement('div');
      priceRow.classList.add('product-price-row');

      price?.parentElement?.insertBefore(priceRow, price);

      priceRow.appendChild(price);

      const rating = document.createElement('div');
      rating.classList.add('product-rating');
      rating.textContent = '★★★★★';

      priceRow.appendChild(rating);
    });
  }
  // article section
  if (block.classList.contains('article')) {
    cards.forEach((card) => {
      const imageWrapper = card.querySelector('.custom-card-image-wrapper');
      const date = card.querySelector('.custom-card-description');
      if (date) {
        date.classList.add('article-date');
        imageWrapper?.appendChild(date);
      }
      const meta = [...card.querySelectorAll('p')].find((p) => p.querySelector('picture'));
      if (meta) {
        meta.classList.add('article-meta');
        const avatar = meta.querySelector('picture');
        const text = meta.textContent.replace(/^[\s\-–—]+/, '').replace(/\s+/g, ' ').trim();
        let author;
        let category;
        if (text.includes('|')) {
          const [first, ...rest] = text.split('|').map((part) => part.trim());
          author = first;
          category = rest.join(' ');
        } else {
          const [first, ...rest] = text.split(' ');
          author = first;
          category = rest.join(' ');
        }
        meta.textContent = '';
        const avatarWrapper = document.createElement('span');
        avatarWrapper.classList.add('article-avatar');
        avatarWrapper.appendChild(avatar);
        const authorEl = document.createElement('span');
        authorEl.classList.add('article-author');
        authorEl.textContent = `- ${author}`;
        meta.append(avatarWrapper, authorEl);
        if (category) {
          const divider = document.createElement('span');
          divider.classList.add('article-divider');
          divider.setAttribute('aria-hidden', 'true');
          const categoryEl = document.createElement('span');
          categoryEl.classList.add('article-category');
          categoryEl.textContent = category;
          meta.append(divider, categoryEl);
        }
      }
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
      heading?.classList.add('article-title');
    });
  }
}
