const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navigation');
menu.addEventListener('click', () => {
  const isOpen = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(isOpen));
  menu.setAttribute('aria-label', isOpen ? 'Закрити меню' : 'Відкрити меню');
  nav.classList.toggle('open', isOpen);
});
nav.addEventListener('click', event => { if (event.target.closest('a')) { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); } });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); } });

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.project-card')];
let showAll = false;
let activeFilter = 'all';
function filterProjects() {
  let visible = 0;
  cards.forEach(card => {
    const matches = activeFilter === 'all' || card.dataset.categories.split(' ').includes(activeFilter);
    const shown = matches && (showAll || activeFilter !== 'all' || !card.classList.contains('extra-project'));
    card.hidden = !shown;
    if (shown) visible++;
  });
  document.querySelector('#project-count').textContent = `01 — ${String(visible).padStart(2, '0')}`;
}
filterButtons.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  filterProjects();
}));
document.querySelector('#view-all').addEventListener('click', () => {
  showAll = !showAll;
  activeFilter = 'all';
  filterButtons.forEach(item => { const active = item.dataset.filter === 'all'; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  document.querySelector('#view-all').innerHTML = showAll ? 'Згорнути <span>−</span>' : 'Дивитись всі <span>→</span>';
  filterProjects();
});

const projects = [
  { title: 'Відпочинок у лісі', type: 'Вебсайт · Дизайн-концепція', image: 'assets/cabin.jpg', description: 'Концепція сайту для відпочинку серед природи. Атмосферний дизайн, зручний вибір будиночка та зрозумілий шлях до бронювання. Спокійні кольори й великі фотографії передають відчуття місця ще до подорожі.', tags: ['Вебдизайн', 'Бронювання', 'Адаптивний інтерфейс'] },
  { title: 'Детейлінг авто — Car Time 87', type: 'Лендінг · Автодетейлінг', image: 'assets/car-time87.png', description: 'Сайт детейлінг-студії Car Time 87: презентація послуг, приклади робіт та зв’язок зі студією.', tags: ['UI/UX', 'Лендінг', 'Автодетейлінг'] },
  { title: 'EverCraft', type: 'Інтернет-магазин · Візуальна концепція', image: 'assets/evercraft.webp', description: 'Візуальна концепція для бренду виробів з епоксидної смоли. У центрі уваги — фактура матеріалу, деталі ручної роботи та сам продукт. Продумана презентація колекцій і зручний каталог.', tags: ['E-commerce', 'Візуальний стиль', 'Каталог'] },
  { title: 'Nazarchuk — NX', type: 'Брендинг · Власний бренд', image: 'assets/nx-original.png', description: 'Власний бренд Nazarchuk — Digital Design & Development. Срібляста монограма NX, орбітальний рух і стримана темна палітра об’єднують дизайн та розробку в єдиний цифровий простір.', tags: ['Айдентика', 'Вебдизайн', 'Digital'] }
];
const dialog = document.querySelector('#project-dialog');
cards.filter(card => !card.matches('a[href]')).forEach(card => card.addEventListener('click', () => {
  const project = projects[Number(card.dataset.project)];
  const img = document.querySelector('#dialog-image'); img.src = project.image; img.alt = project.title;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-type').textContent = project.type;
  document.querySelector('#dialog-description').textContent = project.description;
  document.querySelector('#dialog-tags').replaceChildren(...project.tags.map(tag => { const span = document.createElement('span'); span.textContent = tag; return span; }));
  dialog.showModal();
  document.body.classList.add('dialog-open');
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
document.querySelector('#year').textContent = new Date().getFullYear();
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { document.querySelectorAll('.navigation a').forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`)); } }), { rootMargin: '-15% 0px -50% 0px' });
['home', 'about', 'projects', 'services', 'contact'].forEach(id => sectionObserver.observe(document.getElementById(id)));
