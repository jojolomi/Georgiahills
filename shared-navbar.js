(function () {
  const PAGE_PAIRS = Object.freeze({
    'index.html': 'arabic.html',
    'arabic.html': 'index.html',
    'about.html': 'about-ar.html',
    'about-ar.html': 'about.html',
    'services.html': 'services-ar.html',
    'services-ar.html': 'services.html',
    'guide.html': 'guide-ar.html',
    'guide-ar.html': 'guide.html',
    'blog.html': 'blog-ar.html',
    'blog-ar.html': 'blog.html',
    'booking.html': 'booking-ar.html',
    'booking-ar.html': 'booking.html',
    'contact.html': 'contact-ar.html',
    'contact-ar.html': 'contact.html',
    'batumi.html': 'batumi-ar.html',
    'batumi-ar.html': 'batumi.html',
    'kazbegi.html': 'kazbegi-ar.html',
    'kazbegi-ar.html': 'kazbegi.html',
    'martvili.html': 'martvili-ar.html',
    'martvili-ar.html': 'martvili.html',
    'signagi.html': 'signagi-ar.html',
    'signagi-ar.html': 'signagi.html',
    'tbilisi.html': 'tbilisi-ar.html',
    'tbilisi-ar.html': 'tbilisi.html',
    'honeymoon.html': 'honeymoon-ar.html',
    'honeymoon-ar.html': 'honeymoon.html',
    'article-7-days-georgia.html': 'article-7-days-georgia-ar.html',
    'article-7-days-georgia-ar.html': 'article-7-days-georgia.html',
    'article-georgian-food.html': 'article-georgian-food-ar.html',
    'article-georgian-food-ar.html': 'article-georgian-food.html',
    'article-is-georgia-safe.html': 'article-is-georgia-safe-ar.html',
    'article-is-georgia-safe-ar.html': 'article-is-georgia-safe.html',
    'destinations-hub.html': 'destinations-hub-ar.html',
    'destinations-hub-ar.html': 'destinations-hub.html',
    'family-travel-hub.html': 'family-travel-hub-ar.html',
    'family-travel-hub-ar.html': 'family-travel-hub.html',
    'halal-travel-hub.html': 'halal-travel-hub-ar.html',
    'halal-travel-hub-ar.html': 'halal-travel-hub.html',
    'itineraries-hub.html': 'itineraries-hub-ar.html',
    'itineraries-hub-ar.html': 'itineraries-hub.html',
    'safety-hub.html': 'safety-hub-ar.html',
    'safety-hub-ar.html': 'safety-hub.html'
  });

  function toTrustedHTML(html) {
    if (window.trustedTypes && typeof window.trustedTypes.createPolicy === 'function') {
      if (!window.__GH_TRUSTED_TYPES_DEFAULT__) {
        try {
          window.__GH_TRUSTED_TYPES_DEFAULT__ = window.trustedTypes.createPolicy('default', {
            createHTML: (input) => input,
            createScript: (input) => input,
            createScriptURL: (input) => input
          });
        } catch (error) {
          if (!window.__GH_TRUSTED_TYPES_DEFAULT__) {
            return html;
          }
        }
      }

      if (window.__GH_TRUSTED_TYPES_DEFAULT__ && typeof window.__GH_TRUSTED_TYPES_DEFAULT__.createHTML === 'function') {
        return window.__GH_TRUSTED_TYPES_DEFAULT__.createHTML(html);
      }
    }

    return html;
  }

  function getFilename() {
    const path = (window.location.pathname || '').split('/').pop();
    return path || 'index.html';
  }

  function detectArabic(filename) {
    const params = new URLSearchParams(window.location.search);
    const queryLang = params.get('lang');
    if (queryLang === 'ar') return true;
    if (queryLang === 'en') return false;
    if (filename === 'arabic.html' || filename.endsWith('-ar.html')) return true;
    return document.documentElement.lang === 'ar';
  }

  function toRootPath(path) {
    if (!path || path.startsWith('/') || path.startsWith('#') || path.startsWith('javascript:')) {
      return path;
    }

    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    return `/${path}`;
  }

  function buildLangSwitch(filename, isArabic) {
    if (filename === 'destination.html') {
      const params = new URLSearchParams(window.location.search);
      params.set('lang', isArabic ? 'en' : 'ar');
      const query = params.toString();
      return toRootPath('destination.html' + (query ? ('?' + query) : ''));
    }

    return toRootPath(PAGE_PAIRS[filename] || (isArabic ? 'index.html' : 'arabic.html'));
  }

  function getConfig(filename, isArabic) {
    const home = toRootPath(isArabic ? 'arabic.html' : 'index.html');
    return {
      isArabic,
      home,
      about: toRootPath(isArabic ? 'about-ar.html' : 'about.html'),
      services: toRootPath(isArabic ? 'services-ar.html' : 'services.html'),
      guide: toRootPath(isArabic ? 'guide-ar.html' : 'guide.html'),
      blog: toRootPath(isArabic ? 'blog-ar.html' : 'blog.html'),
      contact: toRootPath(isArabic ? 'contact-ar.html' : 'contact.html'),
      booking: toRootPath(isArabic ? 'booking-ar.html' : 'booking.html'),
      destinationsHub: toRootPath(isArabic ? 'destinations-hub-ar.html' : 'destinations-hub.html'),
      destinations: {
        tbilisi: toRootPath(isArabic ? 'tbilisi-ar.html' : 'tbilisi.html'),
        batumi: toRootPath(isArabic ? 'batumi-ar.html' : 'batumi.html'),
        kazbegi: toRootPath(isArabic ? 'kazbegi-ar.html' : 'kazbegi.html'),
        martvili: toRootPath(isArabic ? 'martvili-ar.html' : 'martvili.html'),
        signagi: toRootPath(isArabic ? 'signagi-ar.html' : 'signagi.html'),
      },
      langSwitch: buildLangSwitch(filename, isArabic),
      texts: {
        home: isArabic ? 'الرئيسية' : 'Home',
        about: isArabic ? 'من نحن' : 'About',
        destinations: isArabic ? 'الوجهات' : 'Destinations',
        destinationsAll: isArabic ? 'كل الوجهات' : 'All Destinations',
        tbilisi: isArabic ? 'تبليسي' : 'Tbilisi',
        batumi: isArabic ? 'باتومي' : 'Batumi',
        kazbegi: isArabic ? 'كازبيجي' : 'Kazbegi',
        martvili: isArabic ? 'مارتفيلي' : 'Martvili',
        signagi: isArabic ? 'سغناغي' : 'Signagi',
        services: isArabic ? 'الخدمات' : 'Services',
        fleet: isArabic ? 'السيارات' : 'Fleet',
        reviews: isArabic ? 'الآراء' : 'Reviews',
        guide: isArabic ? 'الدليل' : 'Guide',
        blog: isArabic ? 'المدونة' : 'Blog',
        contact: isArabic ? 'اتصل بنا' : 'Contact',
        book: isArabic ? 'احجز الآن' : 'Book Now',
        lang: isArabic ? 'English' : 'العربية',
        whatsapp: isArabic ? 'واتساب' : 'WhatsApp',
        close: isArabic ? 'إغلاق القائمة' : 'Close Navigation Menu',
        toggle: isArabic ? 'فتح القائمة' : 'Toggle Navigation Menu'
      }
    };
  }

  function activeClass(filename, target) {
    if (!filename) return '';

    if (target === 'home' && (filename === 'index.html' || filename === 'arabic.html')) return ' active';
    if (target === 'about' && (filename === 'about.html' || filename === 'about-ar.html')) return ' active';
    if (target === 'services' && (filename === 'services.html' || filename === 'services-ar.html')) return ' active';
    if (target === 'guide' && (filename === 'guide.html' || filename === 'guide-ar.html')) return ' active';
    if (target === 'blog' && (filename === 'blog.html' || filename === 'blog-ar.html')) return ' active';
    if (target === 'contact' && (filename === 'contact.html' || filename === 'contact-ar.html')) return ' active';
    if (target === 'booking' && (filename === 'booking.html' || filename === 'booking-ar.html')) return ' active';

    if (target === 'destinations') {
      const destinationPages = [
        'destination.html', 'tbilisi.html', 'tbilisi-ar.html', 'batumi.html', 'batumi-ar.html',
        'kazbegi.html', 'kazbegi-ar.html', 'martvili.html', 'martvili-ar.html',
        'signagi.html', 'signagi-ar.html'
      ];
      if (destinationPages.includes(filename)) return ' active';
    }

    if (target === 'fleet' && (filename === 'honeymoon.html' || filename === 'honeymoon-ar.html')) return ' active';

    return '';
  }

  function buildMarkup(cfg, filename) {
    const activeDestinations = activeClass(filename, 'destinations');
    const desktopLinks = `
      <div id="desktop-links-container" style="display:contents">
        <a href="${cfg.home}" data-nav-link="home" data-nav-text="home" class="nav-link${activeClass(filename, 'home')}">${cfg.texts.home}</a>
        <a href="${cfg.about}" data-nav-link="about" data-nav-text="about" class="nav-link${activeClass(filename, 'about')}">${cfg.texts.about}</a>
        <div class="nav-dropdown-trigger${activeDestinations}" data-nav-link="destinations" role="navigation" aria-label="${cfg.texts.destinations}">
          <button class="nav-link nav-dropdown-btn${activeDestinations}" aria-haspopup="true" aria-expanded="false" aria-controls="dest-dropdown">
            ${cfg.texts.destinations}<i class="fa-solid fa-chevron-down nav-dropdown-chevron" aria-hidden="true"></i>
          </button>
          <div class="nav-dropdown-menu" id="dest-dropdown" role="menu">
            <a href="${cfg.destinationsHub}" class="nav-dropdown-item nav-dropdown-all" role="menuitem">
              <span class="nav-dropdown-icon"><i class="fa-solid fa-map-location-dot"></i></span>
              <span>${cfg.texts.destinationsAll}</span>
            </a>
            <div class="nav-dropdown-divider"></div>
            <a href="${cfg.destinations.tbilisi}" class="nav-dropdown-item" role="menuitem">
              <span class="nav-dropdown-icon"><i class="fa-solid fa-city"></i></span>
              <span>${cfg.texts.tbilisi}</span>
            </a>
            <a href="${cfg.destinations.batumi}" class="nav-dropdown-item" role="menuitem">
              <span class="nav-dropdown-icon"><i class="fa-solid fa-umbrella-beach"></i></span>
              <span>${cfg.texts.batumi}</span>
            </a>
            <a href="${cfg.destinations.kazbegi}" class="nav-dropdown-item" role="menuitem">
              <span class="nav-dropdown-icon"><i class="fa-solid fa-mountain"></i></span>
              <span>${cfg.texts.kazbegi}</span>
            </a>
            <a href="${cfg.destinations.martvili}" class="nav-dropdown-item" role="menuitem">
              <span class="nav-dropdown-icon"><i class="fa-solid fa-water"></i></span>
              <span>${cfg.texts.martvili}</span>
            </a>
            <a href="${cfg.destinations.signagi}" class="nav-dropdown-item" role="menuitem">
              <span class="nav-dropdown-icon"><i class="fa-solid fa-wine-glass"></i></span>
              <span>${cfg.texts.signagi}</span>
            </a>
          </div>
        </div>
        <a href="${cfg.services}" data-nav-link="services" data-nav-text="services" class="nav-link${activeClass(filename, 'services')}">${cfg.texts.services}</a>
        <a href="${cfg.guide}" data-nav-link="guide" data-nav-text="guide" class="nav-link${activeClass(filename, 'guide')}">${cfg.texts.guide}</a>
        <a href="${cfg.blog}" data-nav-link="blog" data-nav-text="blog" class="nav-link${activeClass(filename, 'blog')}">${cfg.texts.blog}</a>
        <a href="${cfg.contact}" data-nav-link="contact" data-nav-text="contact" class="nav-link${activeClass(filename, 'contact')}">${cfg.texts.contact}</a>
      </div>
    `;

    return `
      <div id="scroll-progress" aria-hidden="true"></div>

      <nav id="navbar" class="navbar" dir="ltr" data-shared-navbar="true">
        <div class="container">
          <div class="navbar-inner">
            <a href="${cfg.home}" class="nav-logo">
              <div><img src="/logo-256.avif" width="56" height="56" alt="Georgia Hills Logo" class="nav-logo-img"></div>
              <span data-nav-brand="text">Georgia Hills</span>
            </a>

            <div class="desktop-menu">
              ${desktopLinks}

              <div style="display:flex; gap:0.75rem;">
                <div class="custom-select-wrapper" id="currency-desktop">
                  <button class="action-btn custom-select-trigger" onclick="UIManager.toggleCurrencyDropdown('desktop')" aria-haspopup="true">
                    <img src="https://flagcdn.com/w40/ge.png" alt="GEL" class="currency-flag-sm" id="curr-flag-desktop">
                    <span id="curr-code-desktop">GEL</span>
                    <i class="fa-solid fa-chevron-down" style="font-size:0.7rem;"></i>
                  </button>
                  <div class="custom-options" id="curr-options-desktop"></div>
                </div>

                <a href="${cfg.langSwitch}" class="action-btn">
                  <i class="fa-solid fa-globe"></i><span class="lang-text">${cfg.texts.lang}</span>
                </a>
              </div>

              <a href="${cfg.booking}" data-nav-link="booking" data-nav-text="book" class="btn-book-nav${activeClass(filename, 'booking')}">${cfg.texts.book}</a>
            </div>

            <div class="mobile-controls">
              <a href="${cfg.langSwitch}" class="action-btn" style="padding: 0.375rem 0.75rem; font-size: 0.75rem;">
                <i class="fa-solid fa-globe text-primary"></i><span class="lang-text">${cfg.texts.lang}</span>
              </a>
              <button id="mobile-menu-btn" class="btn-mobile-menu" aria-label="${cfg.texts.toggle}" aria-expanded="false" aria-controls="mobile-menu"><i class="fa-solid fa-bars"></i></button>
            </div>
          </div>
        </div>
      </nav>

      <div id="mobile-menu" aria-hidden="true">
        <button id="close-menu-btn" class="close-menu-btn" aria-label="${cfg.texts.close}"><i class="fa-solid fa-xmark"></i></button>
        <div id="mobile-links-container">
          <a href="${cfg.home}" data-nav-link="home" data-nav-text="home" class="mobile-link${activeClass(filename, 'home')}">${cfg.texts.home}</a>
          <a href="${cfg.about}" data-nav-link="about" data-nav-text="about" class="mobile-link${activeClass(filename, 'about')}">${cfg.texts.about}</a>
          <a href="${cfg.destinationsHub}" data-nav-link="destinations" data-nav-text="destinations" class="mobile-link${activeDestinations}">${cfg.texts.destinations}</a>
          <a href="${cfg.services}" data-nav-link="services" data-nav-text="services" class="mobile-link${activeClass(filename, 'services')}">${cfg.texts.services}</a>
          <a href="${cfg.guide}" data-nav-link="guide" data-nav-text="guide" class="mobile-link${activeClass(filename, 'guide')}">${cfg.texts.guide}</a>
          <a href="${cfg.blog}" data-nav-link="blog" data-nav-text="blog" class="mobile-link${activeClass(filename, 'blog')}">${cfg.texts.blog}</a>
          <a href="${cfg.contact}" data-nav-link="contact" data-nav-text="contact" class="mobile-link${activeClass(filename, 'contact')}">${cfg.texts.contact}</a>
        </div>

        <div class="mobile-settings">
          <div class="custom-select-wrapper" id="currency-mobile">
            <button class="action-btn custom-select-trigger" onclick="UIManager.toggleCurrencyDropdown('mobile')" aria-haspopup="true">
              <img src="https://flagcdn.com/w40/ge.png" alt="GEL" class="currency-flag-sm" id="curr-flag-mobile">
              <span id="curr-code-mobile">GEL</span>
              <i class="fa-solid fa-chevron-down" style="font-size:0.7rem;"></i>
            </button>
            <div class="custom-options" id="curr-options-mobile"></div>
          </div>
        </div>

        <a href="https://wa.me/995579088537" target="_blank" rel="noopener noreferrer" class="mobile-btn-whatsapp">
          <i class="fa-brands fa-whatsapp"></i> ${cfg.texts.whatsapp}
        </a>

        <a href="${cfg.booking}" data-nav-link="booking" data-nav-text="book" class="mobile-btn-book${activeClass(filename, 'booking')}">${cfg.texts.book}</a>
      </div>
    `;
  }

  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  function initDestinationsDropdown() {
    const DROPDOWN_CLOSE_DELAY = 120;

    const trigger = document.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;
    const btn = trigger.querySelector('.nav-dropdown-btn');
    const menu = trigger.querySelector('.nav-dropdown-menu');
    if (!btn || !menu) return;

    let closeTimer;

    function openDropdown() {
      clearTimeout(closeTimer);
      trigger.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      closeTimer = setTimeout(function () {
        trigger.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }, DROPDOWN_CLOSE_DELAY);
    }

    trigger.addEventListener('mouseenter', openDropdown);
    trigger.addEventListener('mouseleave', closeDropdown);
    menu.addEventListener('mouseenter', openDropdown);
    menu.addEventListener('mouseleave', closeDropdown);

    btn.addEventListener('click', function () {
      const isOpen = trigger.classList.contains('open');
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isOpen = trigger.classList.contains('open');
        if (isOpen) {
          closeDropdown();
        } else {
          openDropdown();
          const firstItem = menu.querySelector('.nav-dropdown-item');
          if (firstItem) firstItem.focus();
        }
      } else if (e.key === 'Escape') {
        closeDropdown();
        btn.focus();
      }
    });

    menu.addEventListener('keydown', function (e) {
      const items = Array.from(menu.querySelectorAll('.nav-dropdown-item'));
      const focused = document.activeElement;
      const idx = items.indexOf(focused);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = items[idx + 1] || items[0];
        if (next) next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = items[idx - 1] || items[items.length - 1];
        if (prev) prev.focus();
      } else if (e.key === 'Escape' || e.key === 'Tab') {
        closeDropdown();
        btn.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!trigger.contains(e.target)) {
        trigger.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function renderSharedNavbar() {
    if (window.__GH_SHARED_NAVBAR__) return;

    const nav = document.getElementById('navbar');
    if (!nav) return;

    const filename = getFilename();
    const isArabic = detectArabic(filename);

    const cfg = getConfig(filename, isArabic);
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenu) {
      mobileMenu.remove();
    }

    nav.insertAdjacentHTML('beforebegin', toTrustedHTML(buildMarkup(cfg, filename)));
    nav.remove();

    initScrollProgress();
    initDestinationsDropdown();

    window.__GH_SHARED_NAVBAR__ = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSharedNavbar, { once: true });
  } else {
    renderSharedNavbar();
  }
})();
