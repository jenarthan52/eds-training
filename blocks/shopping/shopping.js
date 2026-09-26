export default function decorate(block) {

  if (!block.classList.contains('shopping')) return;

  const items = [...block.children];

  items.forEach((item) => {
    item.classList.add('shopping-item');

    const content = item.querySelector(':scope > div');

    if (!content) return;

    const imageBox = content.querySelector(':scope > p:first-child');

    if (imageBox) {
      imageBox.classList.add('shopping-image-box');

      const image = imageBox.querySelector('img');

      if (image) {
        image.classList.add('shopping-image');

        image.removeAttribute('width');
        image.removeAttribute('height');
      }
    }

    const title = content.querySelector(':scope > p:nth-child(2)');

    if (title) {
      title.classList.add('shopping-title');
    }
  });
}