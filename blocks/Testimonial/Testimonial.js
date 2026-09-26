export default function decorate(block) {
  const cards = [...block.children];
  cards.forEach((card) => {
    card.classList.add('testimonial-card');
    const [imageCell, contentCell] = [...card.children];
    imageCell?.classList.add('testimonial-image');
    imageCell?.querySelector('img')?.classList.add('testimonial-avatar');
    const name = contentCell?.querySelector('h1, h2, h3, h4, h5, h6');
    name?.classList.add('testimonial-name');
    //  paragraphs:
    const paragraphs = [...(contentCell?.querySelectorAll('p') || [])];
    const quote = paragraphs.length > 1 ? paragraphs[paragraphs.length - 1] : paragraphs[0];
    const role = paragraphs.length > 1 ? paragraphs[0] : null;
    role?.classList.add('testimonial-role');
    quote?.classList.add('testimonial-quote');
    // Avatar + (name | role)
    const info = document.createElement('div');
    info.classList.add('testimonial-info');
    if (name) info.append(name);
    if (role) info.append(role);
    // testimonial-header
    const header = document.createElement('div');
    header.classList.add('testimonial-header');
    if (imageCell) header.append(imageCell);
    header.append(info);
    card.replaceChildren(...[header, quote].filter(Boolean));
  });
}
