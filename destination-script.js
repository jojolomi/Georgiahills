// Lightweight runtime for static destination pages
(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {});
    });
  }

  const UI = {
    init() {
      this.setupMobileMenu();
      this.setupScrollEffects();
      this.updateCopyright();
    },

    setupMobileMenu() {
      const menuBtn = document.getElementById('mobile-menu-btn');
      const closeBtn = document.getElementById('close-menu-btn');
      const menu = document.getElementById('mobile-menu');
      const links = document.querySelectorAll('.mobile-link, .mobile-btn-book');

      if (!menu) return;

      const toggle = () => {
        const isOpen = menu.classList.toggle('open');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('overflow-hidden', isOpen);
      };

      if (menuBtn) menuBtn.addEventListener('click', toggle);
      if (closeBtn) closeBtn.addEventListener('click', toggle);
      links.forEach((link) => link.addEventListener('click', toggle));
    },

    setupScrollEffects() {
      window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) {
          const scrolled = window.scrollY > 20;
          nav.classList.toggle('shadow-md', scrolled);
          nav.classList.toggle('scrolled', scrolled);
        }
      }, { passive: true });
    },

    updateCopyright() {
      const yearEl = document.getElementById('year');
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    }
  };

  window.App = {
    share() {
      if (navigator.share) {
        navigator.share({ title: 'Georgia Hills', url: window.location.href }).catch(() => {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).catch(() => {});
      }
    }
  };

  window.addEventListener('DOMContentLoaded', () => UI.init());
})();
