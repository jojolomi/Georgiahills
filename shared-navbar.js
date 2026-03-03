(function () {
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

  function getBasePrefix() {
    const segs = (window.location.pathname || '').replace(/^\//, '').split('/');
    if (segs.length > 1 && segs[0]) return '../';
    return '';
  }

  function detectArabic(filename) {
    const params = new URLSearchParams(window.location.search);
    const queryLang = params.get('lang');
    if (queryLang === 'ar') return true;
    if (queryLang === 'en') return false;
    if (filename === 'arabic.html' || filename.endsWith('-ar.html')) return true;
    return document.documentElement.lang === 'ar';
  }

  function applyNavbarOffset() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const offset = Math.ceil(nav.getBoundingClientRect().height || 0);
    if (!offset) return;
    document.documentElement.style.setProperty('--gh-navbar-offset', offset + 'px');
    if (document.body) {
      document.body.style.paddingTop = offset + 'px';
    }
  }

  function getPagePairs() {
    return {
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
    };
  }

  function buildLangSwitch(filename, isArabic) {
    if (filename === 'destination.html') {
      const params = new URLSearchParams(window.location.search);
      params.set('lang', isArabic ? 'en' : 'ar');
      const query = params.toString();
      return 'destination.html' + (query ? ('?' + query) : '');
    }

    const pairs = getPagePairs();
    return pairs[filename] || (isArabic ? 'index.html' : 'arabic.html');
  }

  function getConfig(filename, isArabic) {
    const p = getBasePrefix();
    const home = p + (isArabic ? 'arabic.html' : 'index.html');
    const langSwitchTarget = (p && filename === 'index.html' && isArabic)
      ? 'index.html'
      : buildLangSwitch(filename, isArabic);
    return {
      isArabic,
      prefix: p,
      home,
      about: p + (isArabic ? 'about-ar.html' : 'about.html'),
      services: p + (isArabic ? 'services-ar.html' : 'services.html'),
      guide: p + (isArabic ? 'guide-ar.html' : 'guide.html'),
      blog: p + (isArabic ? 'blog-ar.html' : 'blog.html'),
      contact: p + (isArabic ? 'contact-ar.html' : 'contact.html'),
      booking: p + (isArabic ? 'booking-ar.html' : 'booking.html'),
      langSwitch: p + langSwitchTarget,
      texts: {
        home: isArabic ? 'الرئيسية' : 'Home',
        about: isArabic ? 'من نحن' : 'About',
        destinations: isArabic ? 'الوجهات' : 'Destinations',
        services: isArabic ? 'الخدمات' : 'Services',
        fleet: isArabic ? 'السيارات' : 'Fleet',
        reviews: isArabic ? 'الآراء' : 'Reviews',
        guide: isArabic ? 'الدليل' : 'Guide',
        blog: isArabic ? 'المدونة' : 'Blog',
        contact: isArabic ? 'اتصل بنا' : 'Contact',
        book: isArabic ? 'احجز الآن' : 'Book Now',
        lang: isArabic ? 'English' : 'العربية',
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
    const p = cfg.prefix;
    const homeDestinations = cfg.home + '#destinations';
    const homeFleet = cfg.home + '#fleet';
    const homeReviews = cfg.home + '#reviews';
    const desktopLinks = `
      <div id="desktop-links-container" style="display:contents">
        <a href="${cfg.home}" data-nav-link="home" data-nav-text="home" class="nav-link${activeClass(filename, 'home')}">${cfg.texts.home}</a>
        <a href="${cfg.about}" data-nav-link="about" data-nav-text="about" class="nav-link${activeClass(filename, 'about')}">${cfg.texts.about}</a>
        <a href="${cfg.services}" data-nav-link="services" data-nav-text="services" class="nav-link${activeClass(filename, 'services')}">${cfg.texts.services}</a>
        <a href="${cfg.guide}" data-nav-link="guide" data-nav-text="guide" class="nav-link${activeClass(filename, 'guide')}">${cfg.texts.guide}</a>
        <a href="${cfg.blog}" data-nav-link="blog" data-nav-text="blog" class="nav-link${activeClass(filename, 'blog')}">${cfg.texts.blog}</a>
        <a href="${cfg.contact}" data-nav-link="contact" data-nav-text="contact" class="nav-link${activeClass(filename, 'contact')}">${cfg.texts.contact}</a>
      </div>
    `;

    return `
      <nav id="navbar" class="navbar" dir="${cfg.isArabic ? 'rtl' : 'ltr'}" data-shared-navbar="true">
        <div class="container">
          <div class="navbar-inner">
            <a href="${cfg.home}" class="nav-logo">
              <div><img src="${p}favicon.ico" width="56" height="56" alt="Georgia Hills Logo" class="nav-logo-img"></div>
              <span data-nav-brand="text">Georgia Hills</span>
            </a>

            <div class="desktop-menu">
              ${desktopLinks}

              <div style="display:flex; gap:0.75rem;">
                <div class="custom-select-wrapper" id="currency-desktop">
                  <button class="action-btn custom-select-trigger" data-currency-toggle="desktop" aria-haspopup="true">
                    <span class="currency-flag-sm currency-flag-emoji" id="curr-flag-desktop" aria-hidden="true">🇬🇪</span>
                    <span id="curr-code-desktop">GEL</span>
                    <i class="fa-solid fa-chevron-down" style="font-size:0.7rem;"></i>
                  </button>
                  <div class="custom-options" id="curr-options-desktop"></div>
                </div>

                <a href="${cfg.langSwitch}" class="action-btn" aria-label="Language switch">
                  <i class="fa-solid fa-globe"></i><span class="lang-text">${cfg.texts.lang}</span>
                </a>
              </div>

              <a href="${cfg.booking}" data-nav-link="booking" data-nav-text="book" class="btn-book-nav${activeClass(filename, 'booking')}">${cfg.texts.book}</a>
            </div>

            <div class="mobile-controls">
              <a href="${cfg.langSwitch}" class="action-btn" aria-label="Language switch" style="padding: 0.375rem 0.75rem; font-size: 0.75rem;">
                <i class="fa-solid fa-globe text-primary"></i><span class="lang-text">${cfg.texts.lang}</span>
              </a>
              <button id="mobile-menu-btn" class="btn-mobile-menu" aria-label="${cfg.texts.toggle}" aria-expanded="false" aria-controls="mobile-menu"><i class="fa-solid fa-bars"></i></button>
            </div>
          </div>
        </div>
      </nav>

      <div id="mobile-menu" aria-hidden="true" style="position:fixed;inset:0;transform:translateX(100%);width:100%;height:100vh;height:100svh;overflow-y:auto;z-index:60;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:1.5rem;padding:2rem 0;text-align:center;background:#fff;">
        <button id="close-menu-btn" class="close-menu-btn" aria-label="${cfg.texts.close}"><i class="fa-solid fa-xmark"></i></button>
        <div id="mobile-links-container">
          <a href="${cfg.home}" data-nav-link="home" data-nav-text="home" class="mobile-link${activeClass(filename, 'home')}">${cfg.texts.home}</a>
          <a href="${cfg.about}" data-nav-link="about" data-nav-text="about" class="mobile-link${activeClass(filename, 'about')}">${cfg.texts.about}</a>
          <a href="${cfg.services}" data-nav-link="services" data-nav-text="services" class="mobile-link${activeClass(filename, 'services')}">${cfg.texts.services}</a>
          <a href="${cfg.guide}" data-nav-link="guide" data-nav-text="guide" class="mobile-link${activeClass(filename, 'guide')}">${cfg.texts.guide}</a>
          <a href="${cfg.blog}" data-nav-link="blog" data-nav-text="blog" class="mobile-link${activeClass(filename, 'blog')}">${cfg.texts.blog}</a>
          <a href="${cfg.contact}" data-nav-link="contact" data-nav-text="contact" class="mobile-link${activeClass(filename, 'contact')}">${cfg.texts.contact}</a>
        </div>

        <div class="mobile-settings">
          <div class="custom-select-wrapper" id="currency-mobile">
            <button class="action-btn custom-select-trigger" data-currency-toggle="mobile" aria-haspopup="true">
              <span class="currency-flag-sm currency-flag-emoji" id="curr-flag-mobile" aria-hidden="true">🇬🇪</span>
              <span id="curr-code-mobile">GEL</span>
              <i class="fa-solid fa-chevron-down" style="font-size:0.7rem;"></i>
            </button>
            <div class="custom-options" id="curr-options-mobile"></div>
          </div>
        </div>

        <a href="${cfg.booking}" data-nav-link="booking" data-nav-text="book" class="mobile-btn-book${activeClass(filename, 'booking')}">${cfg.texts.book}</a>
      </div>
    `;
  }

  function renderSharedNavbar() {
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

    applyNavbarOffset();

    document.querySelectorAll('[data-currency-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        const type = button.getAttribute('data-currency-toggle');
        if (!type) return;
        if (window.GHCoreUI && typeof window.GHCoreUI.toggleCurrencyDropdown === 'function') {
          window.GHCoreUI.toggleCurrencyDropdown(type);
          return;
        }
        if (window.UIManager && typeof window.UIManager.toggleCurrencyDropdown === 'function') {
          window.UIManager.toggleCurrencyDropdown(type);
          return;
        }
        const wrapper = document.getElementById('currency-' + type);
        if (wrapper) wrapper.classList.toggle('open');
      });
    });

    window.__GH_SHARED_NAVBAR__ = true;
  }

  window.addEventListener('resize', applyNavbarOffset, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSharedNavbar);
  } else {
    renderSharedNavbar();
  }
})();
