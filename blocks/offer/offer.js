export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return; 
  row.classList.add('offer-band');

  const cell = row.firstElementChild;
  if (!cell) return;
  cell.classList.add('offer-content');

  const picture = cell.querySelector('picture');
  const jar = picture ? (picture.closest('p') || picture) : null;
  jar?.classList.add('offer-jar');

  cell.querySelector('h1, h2, h3, h4, h5, h6')?.classList.add('offer-title');

  const link = cell.querySelector('a');
  const cta = link ? (link.closest('p') || link) : null;
  if (cta && cta !== jar) cta.classList.add('offer-cta');

  cell.querySelectorAll(':scope > p').forEach((p) => {
    if (p !== jar && p !== cta) p.classList.add('offer-sub');
  });
}