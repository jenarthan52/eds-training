export default function decorate(block) {
  const cards = [...block.children];
  cards.forEach((card) => {
    card.classList.add('custom-card');
    const cardnumber = card.querySelector('h2');
    cardnumber?.classList.add('custom-card__number');
    const image = card.querySelector('p:has(img)');
    image?.classList.add('custom-card__image');
    const description = card.querySelector('p:not(:has(img))');
    description?.classList.add('custom-card__description');
    const title = card.querySelector('h3');
    title?.classList.add('custom-card__title');
  });
}
