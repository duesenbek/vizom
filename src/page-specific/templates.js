document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  // Sync active item in mobile bottom navigation
  (function(){
    const path = (location.pathname || '').toLowerCase();
    const links = document.querySelectorAll('.mobile-nav .nav-item');
    links.forEach(a => a.classList.remove('is-active'));
    const setActive = (href) => {
      const el = document.querySelector(`.mobile-nav a[href$="${href}"]`);
      if (el) el.classList.add('is-active');
    };
    if (path.includes('templates')) setActive('templates.html');
    else if (path.includes('generator')) setActive('generator.html');
    else setActive('index.html');
  })();
});
