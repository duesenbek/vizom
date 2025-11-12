export function initPremiumInteractions(root = document) {
  if (!root) return;

  // Ripple effect for buttons
  const buttons = Array.from(root.querySelectorAll('.btn'));
  buttons.forEach((btn) => {
    if (btn.dataset.rippleBound) return;
    btn.dataset.rippleBound = 'true';

    btn.addEventListener('click', (event) => {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      btn.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Animate on scroll (simple IntersectionObserver)
  if (typeof IntersectionObserver !== 'undefined') {
    const animatedEls = Array.from(root.querySelectorAll('[data-animate="fade-up"]'));

    if (animatedEls.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-fade-in-up');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
        }
      );

      animatedEls.forEach((el) => observer.observe(el));
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initPremiumInteractions();
  });
}
