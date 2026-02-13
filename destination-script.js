// Lightweight runtime for static destination pages
(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {});
    });
  }

  const UI = {
    init() {
      this.applyPageVisualContext();
      this.ensureMobileMenu();
      this.setupMobileMenu();
      this.setupScrollEffects();
      this.normalizeNavigation();
      this.normalizeMicrocopy();
      this.normalizeBookingLinks();
      this.ensureBreadcrumbs();
      this.enhanceSecondaryPageHeader();
      this.injectUniversalProfessionalSection();
      this.injectTrustStrip();
      this.ensureProfessionalFooter();
      this.initTracking();
      this.updateCopyright();
    },

    applyPageVisualContext() {
      const path = (window.location.pathname || '').toLowerCase();
      const isHome = path.endsWith('/') || path.endsWith('/index.html') || path.endsWith('/arabic.html') || path === '/index.html' || path === '/arabic.html';
      if (!isHome) document.body.classList.add('secondary-page');
      if (path.includes('blog')) document.body.classList.add('page-blog');
      if (path.includes('guide')) document.body.classList.add('page-guide');
      if (path.includes('article-')) document.body.classList.add('page-article');
      if (path.includes('booking')) document.body.classList.add('page-booking');
      if (path.includes('about')) document.body.classList.add('page-about');
      if (path.includes('services')) document.body.classList.add('page-services');
      if (path.includes('contact')) document.body.classList.add('page-contact');
      if (path.includes('legal')) document.body.classList.add('page-legal');
    },

    getLangConfig() {
      const isArabic = document.documentElement.lang === 'ar' || document.documentElement.dir === 'rtl';
      return {
        isArabic,
        home: isArabic ? 'arabic.html' : 'index.html',
        services: isArabic ? 'services-ar.html' : 'services.html',
        guide: isArabic ? 'guide-ar.html' : 'guide.html',
        about: isArabic ? 'about-ar.html' : 'about.html',
        blog: isArabic ? 'blog-ar.html' : 'blog.html',
        contact: isArabic ? 'contact-ar.html' : 'contact.html',
        booking: isArabic ? 'booking-ar.html' : 'booking.html',
        langSwitch: isArabic ? 'index.html' : 'arabic.html',
        langText: isArabic ? 'English' : 'العربية',
        homeText: isArabic ? 'الرئيسية' : 'Home',
        servicesText: isArabic ? 'الخدمات' : 'Services',
        guideText: isArabic ? 'الدليل' : 'Guide',
        aboutText: isArabic ? 'من نحن' : 'About',
        blogText: isArabic ? 'المدونة' : 'Blog',
        contactText: isArabic ? 'اتصل بنا' : 'Contact',
        bookText: isArabic ? 'احجز الآن' : 'Book Now'
      };
    },

    ensureMobileMenu() {
      const cfg = this.getLangConfig();

      const navInner = document.querySelector('.navbar-inner');
      if (navInner && !document.getElementById('mobile-menu-btn')) {
        const controls = document.createElement('div');
        controls.className = 'mobile-controls';
        controls.innerHTML = `<button id="mobile-menu-btn" class="btn-mobile-menu" aria-label="Toggle Navigation Menu" aria-expanded="false" aria-controls="mobile-menu"><i class="fa-solid fa-bars"></i></button>`;
        navInner.appendChild(controls);
      }

      if (document.getElementById('mobile-menu')) return;

      const menu = document.createElement('div');
      menu.id = 'mobile-menu';
      menu.setAttribute('aria-hidden', 'true');
      menu.innerHTML = `
        <button id="close-menu-btn" class="close-menu-btn" aria-label="Close Navigation Menu"><i class="fa-solid fa-xmark"></i></button>
        <a href="${cfg.home}" class="mobile-link">${cfg.isArabic ? 'الرئيسية' : 'Home'}</a>
        <a href="${cfg.services}" class="mobile-link">${cfg.isArabic ? 'الخدمات' : 'Services'}</a>
        <a href="${cfg.guide}" class="mobile-link">${cfg.isArabic ? 'الدليل' : 'Guide'}</a>
        <a href="${cfg.about}" class="mobile-link">${cfg.isArabic ? 'من نحن' : 'About'}</a>
        <a href="${cfg.contact}" class="mobile-link">${cfg.isArabic ? 'اتصل بنا' : 'Contact'}</a>
        <a href="${cfg.isArabic ? 'booking-ar.html' : 'booking.html'}" class="mobile-btn-book">${cfg.bookText}</a>`;

      document.body.appendChild(menu);
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
    },

    normalizeNavigation() {
      const cfg = this.getLangConfig();
      const nav = document.getElementById('navbar');
      const navInner = document.querySelector('.navbar-inner');
      const desktopMenu = document.querySelector('.desktop-menu');
      const mobileMenu = document.getElementById('mobile-menu');
      const mobileControls = document.querySelector('.mobile-controls');

      const logoLink = document.querySelector('.nav-logo');
      if (logoLink) logoLink.setAttribute('href', cfg.home);

      if (desktopMenu) {
        desktopMenu.innerHTML = `
          <a href="${cfg.home}" class="nav-link">${cfg.homeText}</a>
          <a href="${cfg.services}" class="nav-link">${cfg.servicesText}</a>
          <a href="${cfg.guide}" class="nav-link">${cfg.guideText}</a>
          <a href="${cfg.about}" class="nav-link">${cfg.aboutText}</a>
          <a href="${cfg.blog}" class="nav-link">${cfg.blogText}</a>
          <a href="${cfg.contact}" class="nav-link">${cfg.contactText}</a>
          <a href="${cfg.langSwitch}" class="action-btn"><i class="fa-solid fa-globe"></i> ${cfg.langText}</a>
          <a href="${cfg.booking}" class="btn-book-nav">${cfg.bookText}</a>`;
      }

      if (mobileControls) {
        mobileControls.innerHTML = `
          <a href="${cfg.langSwitch}" class="action-btn" style="font-size:0.75rem; padding:0.375rem 0.75rem;"><i class="fa-solid fa-globe"></i> ${cfg.langText}</a>
          <button id="mobile-menu-btn" class="btn-mobile-menu" aria-label="Toggle Navigation Menu" aria-expanded="false" aria-controls="mobile-menu"><i class="fa-solid fa-bars"></i></button>`;
      } else if (navInner || nav) {
        const controls = document.createElement('div');
        controls.className = 'mobile-controls';
        controls.innerHTML = `
          <a href="${cfg.langSwitch}" class="action-btn" style="font-size:0.75rem; padding:0.375rem 0.75rem;"><i class="fa-solid fa-globe"></i> ${cfg.langText}</a>
          <button id="mobile-menu-btn" class="btn-mobile-menu" aria-label="Toggle Navigation Menu" aria-expanded="false" aria-controls="mobile-menu"><i class="fa-solid fa-bars"></i></button>`;
        (navInner || nav).appendChild(controls);
      }

      if (mobileMenu) {
        mobileMenu.innerHTML = `
          <button id="close-menu-btn" class="close-menu-btn" aria-label="Close Navigation Menu"><i class="fa-solid fa-xmark"></i></button>
          <a href="${cfg.home}" class="mobile-link">${cfg.homeText}</a>
          <a href="${cfg.services}" class="mobile-link">${cfg.servicesText}</a>
          <a href="${cfg.guide}" class="mobile-link">${cfg.guideText}</a>
          <a href="${cfg.about}" class="mobile-link">${cfg.aboutText}</a>
          <a href="${cfg.blog}" class="mobile-link">${cfg.blogText}</a>
          <a href="${cfg.contact}" class="mobile-link">${cfg.contactText}</a>
          <a href="${cfg.booking}" class="mobile-btn-book">${cfg.bookText}</a>`;
      }
    },

    normalizeBookingLinks() {
      const cfg = this.getLangConfig();
      const target = cfg.isArabic ? 'booking-ar.html' : 'booking.html';
      document.querySelectorAll('a[href="#booking"], a[href="index.html#booking"], a[href="arabic.html#booking"]').forEach((link) => {
        link.setAttribute('href', target);
      });
    },

    normalizeMicrocopy() {
      const cfg = this.getLangConfig();

      document.querySelectorAll('a.btn-book-nav[href*="booking"], a.mobile-btn-book[href*="booking"]').forEach((link) => {
        link.textContent = cfg.bookText;
      });

      document.querySelectorAll('a[href="services.html"].action-btn, a[href="services-ar.html"].action-btn').forEach((link) => {
        link.textContent = cfg.servicesText;
      });

      document.querySelectorAll('a[href="guide.html"].action-btn, a[href="guide-ar.html"].action-btn').forEach((link) => {
        link.textContent = cfg.guideText;
      });

      document.querySelectorAll('a[href="contact.html"].btn-book-nav, a[href="contact-ar.html"].btn-book-nav, a[href="contact.html"].action-btn, a[href="contact-ar.html"].action-btn').forEach((link) => {
        link.textContent = cfg.isArabic ? 'تواصل مع الفريق' : 'Contact Team';
      });

      document.querySelectorAll('a.blog-link').forEach((link) => {
        const iconClass = cfg.isArabic ? 'fa-arrow-left' : 'fa-arrow-right';
        link.innerHTML = `${cfg.isArabic ? 'اقرأ المقال' : 'Read Article'} <i class="fa-solid ${iconClass}"></i>`;
      });

      document.querySelectorAll('a[href="legal.html"]').forEach((link) => {
        link.textContent = cfg.isArabic ? 'سياسة الخصوصية' : 'Privacy Policy';
      });
    },

    ensureBreadcrumbs() {
      const cfg = this.getLangConfig();
      const main = document.getElementById('main-content');
      if (!main || main.querySelector('.pro-breadcrumbs')) return;

      const titleEl = main.querySelector('h1');
      const pageTitle = titleEl ? titleEl.textContent.trim() : document.title.split('|')[0].trim();
      const crumb = document.createElement('div');
      crumb.className = 'pro-breadcrumbs';
      crumb.innerHTML = `<a href="${cfg.home}">${cfg.isArabic ? 'الرئيسية' : 'Home'}</a> <i class="fa-solid fa-chevron-right" style="font-size:0.65rem;"></i> <span>${pageTitle}</span>`;
      main.insertBefore(crumb, main.firstChild);
    },

    enhanceSecondaryPageHeader() {
      if (document.querySelector('.hero, .dest-hero')) return;
      const main = document.getElementById('main-content');
      if (!main || main.querySelector('.pro-header-card')) return;

      const cfg = this.getLangConfig();
      const h1 = main.querySelector('h1');
      const titleText = h1 ? h1.textContent.trim() : document.title.split('|')[0].trim();
      const descMeta = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

      const header = document.createElement('div');
      header.className = 'content-card pro-header-card';
      header.innerHTML = `
        <span class="section-label">${cfg.isArabic ? 'صفحة معلومات' : 'Essential Page'}</span>
        <h2 class="section-title" style="margin-top:0.5rem;">${titleText}</h2>
        <p class="section-desc">${descMeta}</p>
        <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-top:1rem;">
          <a href="${cfg.services}" class="action-btn">${cfg.isArabic ? 'الخدمات' : 'Services'}</a>
          <a href="${cfg.booking}" class="btn-book-nav" style="text-decoration:none;">${cfg.bookText}</a>
        </div>`;

      main.insertBefore(header, main.firstChild);
    },

    injectUniversalProfessionalSection() {
      const path = (window.location.pathname || '').toLowerCase();
      if (path.includes('index.html') || path.includes('arabic.html') || path.endsWith('/') || path.includes('admin.html') || path.includes('404.html')) return;
      if (document.querySelector('.pro-growth-section, .process-grid, .compare-grid, .testimonials-grid')) return;

      const cfg = this.getLangConfig();
      const main = document.getElementById('main-content');
      if (!main) return;

      const section = document.createElement('section');
      section.className = 'content-card pro-growth-section';
      section.style.cssText = 'padding:2rem; margin-top:2rem;';
      section.innerHTML = cfg.isArabic
        ? `
          <h2 class="section-heading">الحجز بطريقة احترافية</h2>
          <div class="process-grid" style="margin-bottom:1.5rem;">
            <article class="process-card"><span class="process-step">1</span><h3 class="process-title">أرسل تفاصيل الرحلة</h3><p class="process-text">المسار، التواريخ، وعدد المسافرين.</p></article>
            <article class="process-card"><span class="process-step">2</span><h3 class="process-title">استلم عرض واضح</h3><p class="process-text">السعر والتفاصيل بدون رسوم مخفية.</p></article>
            <article class="process-card"><span class="process-step">3</span><h3 class="process-title">تأكيد سريع</h3><p class="process-text">تأكيد عبر واتساب وجدول جاهز قبل الوصول.</p></article>
          </div>
          <div class="proof-grid">
            <div class="proof-card"><p class="proof-number">24/7</p><p class="proof-label">دعم واتساب</p></div>
            <div class="proof-card"><p class="proof-number">10 د</p><p class="proof-label">متوسط الرد</p></div>
            <div class="proof-card"><p class="proof-number">4.9/5</p><p class="proof-label">تقييم العملاء</p></div>
            <div class="proof-card"><p class="proof-number">100%</p><p class="proof-label">رحلات خاصة</p></div>
          </div>`
        : `
          <h2 class="section-heading">Professional Booking Flow</h2>
          <div class="process-grid" style="margin-bottom:1.5rem;">
            <article class="process-card"><span class="process-step">1</span><h3 class="process-title">Share trip details</h3><p class="process-text">Route, dates, and passenger count.</p></article>
            <article class="process-card"><span class="process-step">2</span><h3 class="process-title">Get clear quote</h3><p class="process-text">Transparent scope and pricing with no hidden fees.</p></article>
            <article class="process-card"><span class="process-step">3</span><h3 class="process-title">Confirm quickly</h3><p class="process-text">WhatsApp confirmation with ready schedule.</p></article>
          </div>
          <div class="proof-grid">
            <div class="proof-card"><p class="proof-number">24/7</p><p class="proof-label">WhatsApp Support</p></div>
            <div class="proof-card"><p class="proof-number">10m</p><p class="proof-label">Typical Reply</p></div>
            <div class="proof-card"><p class="proof-number">4.9/5</p><p class="proof-label">Guest Rating</p></div>
            <div class="proof-card"><p class="proof-number">100%</p><p class="proof-label">Private Trips</p></div>
          </div>`;

      main.appendChild(section);
    },

    injectTrustStrip() {
      const cfg = this.getLangConfig();
      if (document.querySelector('.trust-strip-pro')) return;
      if (window.location.pathname.includes('index.html') || window.location.pathname.includes('arabic.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) return;

      const footer = document.querySelector('footer.footer');
      if (!footer || !footer.parentNode) return;

      const trust = document.createElement('section');
      trust.className = 'trust-strip-pro';
      trust.innerHTML = `
        <div class="container trust-strip-inner">
          <div class="trust-item-pro"><i class="fa-solid fa-shield-heart"></i> ${cfg.isArabic ? 'خدمة موثوقة' : 'Trusted Service'}</div>
          <div class="trust-item-pro"><i class="fa-solid fa-comments"></i> ${cfg.isArabic ? 'دعم واتساب 24/7' : '24/7 WhatsApp Support'}</div>
          <div class="trust-item-pro"><i class="fa-solid fa-tag"></i> ${cfg.isArabic ? 'أسعار واضحة' : 'Transparent Pricing'}</div>
          <a href="${cfg.booking}" class="btn-book-nav" style="text-decoration:none;">${cfg.bookText}</a>
        </div>`;

      footer.parentNode.insertBefore(trust, footer);
    },

    ensureProfessionalFooter() {
      const footer = document.querySelector('footer.footer');
      if (!footer || footer.querySelector('.footer-grid')) return;

      const cfg = this.getLangConfig();
      const isArabic = cfg.isArabic;
      footer.innerHTML = `
        <div class="container">
          <div class="footer-grid">
            <div>
              <div class="footer-brand">
                <div class="footer-brand-icon"><i class="fa-solid fa-mountain"></i></div>
                <span class="footer-brand-text">Georgia Hills</span>
              </div>
              <p style="color:var(--color-gray-300); font-size:0.875rem; line-height:1.6; margin-bottom:1.5rem;">${isArabic ? 'حلول نقل احترافية في جورجيا مع تركيز على الأمان والراحة والخبرة المحلية.' : 'Professional transport solutions in Georgia focused on safety, comfort, and local expertise.'}</p>
              <div class="footer-social">
                <a href="https://instagram.com/georgiahills" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://facebook.com/georgiahills" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                <button onclick="App.share()" class="social-btn" aria-label="Share Website"><i class="fa-solid fa-share-nodes"></i></button>
              </div>
            </div>
            <div>
              <h3>${isArabic ? 'روابط سريعة' : 'Quick Links'}</h3>
              <ul>
                <li><a href="${cfg.home}">${isArabic ? 'الرئيسية' : 'Home'}</a></li>
                <li><a href="${cfg.services}">${isArabic ? 'الخدمات' : 'Services'}</a></li>
                <li><a href="${cfg.guide}">${isArabic ? 'الدليل' : 'Guide'}</a></li>
                <li><a href="${cfg.about}">${isArabic ? 'من نحن' : 'About'}</a></li>
              </ul>
            </div>
            <div>
              <h3>${isArabic ? 'اتصل بنا' : 'Contact'}</h3>
              <ul style="color:var(--color-gray-400);">
                <li class="footer-contact-item"><i class="fa-solid fa-phone text-accent"></i> <span dir="ltr">+995 579 08 85 37</span></li>
                <li class="footer-contact-item"><i class="fa-brands fa-whatsapp text-accent"></i> <span dir="ltr">+995 579 08 85 37</span></li>
                <li class="footer-contact-item"><i class="fa-solid fa-envelope text-accent"></i> info@georgiahills.com</li>
              </ul>
            </div>
            <div>
              <div class="footer-map-container">
                <span class="footer-map-overlay"><i class="fa-solid fa-map-location-dot"></i> <span>${isArabic ? 'موقعنا' : 'Our Location'}</span></span>
              </div>
            </div>
          </div>
          <div class="footer-bottom">&copy; <span id="year">2026</span> Georgia Hills. ${isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</div>
        </div>`;
    },

    initTracking() {
      document.querySelectorAll('a.btn-book-nav, a.mobile-btn-book, a.action-btn').forEach((el) => {
        el.addEventListener('click', () => {
          try {
            if (typeof gtag === 'function') {
              gtag('event', 'secondary_cta_click', {
                page_path: window.location.pathname,
                cta_text: (el.textContent || '').trim().slice(0, 60)
              });
            }
          } catch (e) {}
        });
      });
    },

    standardizeDestinationLayout() {
      if (!document.body.classList.contains('page-destination')) return;

      const isArabic = document.documentElement.lang === 'ar' || document.documentElement.dir === 'rtl';
      const main = document.getElementById('main-content');
      if (!main) return;

      main.querySelectorAll('a[href$="#packages"], a[href*="index.html#packages"], a[href*="arabic.html#packages"]').forEach((link) => {
        link.setAttribute('href', isArabic ? 'services-ar.html' : 'services.html');
      });
      main.querySelectorAll('a[href$="#guide"], a[href*="index.html#guide"], a[href*="arabic.html#guide"]').forEach((link) => {
        link.setAttribute('href', isArabic ? 'guide-ar.html' : 'guide.html');
      });

      const contentCard = main.querySelector('.content-card');
      if (!contentCard) return;

      const richText = contentCard.querySelector('.rich-text');
      if (richText && !contentCard.querySelector('.overview-heading')) {
        const overviewHeading = document.createElement('h3');
        overviewHeading.className = 'section-heading overview-heading';
        overviewHeading.textContent = isArabic ? 'نظرة عامة' : 'Overview';
        contentCard.insertBefore(overviewHeading, richText);
      }

      const highlights = contentCard.querySelector('.highlights-list');
      if (highlights && !contentCard.querySelector('.itinerary-block')) {
        const itineraryBlock = document.createElement('div');
        itineraryBlock.className = 'content-card itinerary-block';
        itineraryBlock.style.cssText = 'padding:1.25rem; margin:2rem 0; border:1px solid var(--color-gray-200);';
        itineraryBlock.innerHTML = isArabic
          ? '<h3 class="section-heading">برنامج مقترح</h3><p>اليوم 1: الوصول والاستقبال • اليوم 2-3: جولة المدينة • اليوم 4+: رحلة خارجية حسب الوجهة.</p>'
          : '<h3 class="section-heading">Suggested Itinerary</h3><p>Day 1: Arrival & pickup • Day 2-3: City exploration • Day 4+: Day trips based on your route.</p>';
        highlights.insertAdjacentElement('afterend', itineraryBlock);
      }

      if (!contentCard.querySelector('.best-time-block')) {
        const bestTime = document.createElement('div');
        bestTime.className = 'content-card best-time-block';
        bestTime.style.cssText = 'padding:1.25rem; margin:1.25rem 0; border:1px solid var(--color-gray-200);';
        bestTime.innerHTML = isArabic
          ? '<h3 class="section-heading">أفضل وقت للزيارة</h3><p>الربيع والخريف للطقس المعتدل، والشتاء لعشاق الثلج والمنتجعات الجبلية.</p>'
          : '<h3 class="section-heading">Best Time to Visit</h3><p>Spring and autumn offer mild weather; winter is ideal for snow and mountain resorts.</p>';
        contentCard.appendChild(bestTime);
      }

      if (!contentCard.querySelector('.mini-faq-block')) {
        const faq = document.createElement('div');
        faq.className = 'content-card mini-faq-block';
        faq.style.cssText = 'padding:1.25rem; margin:1.25rem 0; border:1px solid var(--color-gray-200);';
        faq.innerHTML = isArabic
          ? '<h3 class="section-heading">أسئلة سريعة</h3><p><strong>هل تكفي رحلة يوم واحد؟</strong> نعم لمعظم الوجهات، مع انطلاق مبكر.</p><p><strong>هل السعر يشمل الوقود؟</strong> نعم غالباً مع خدمة السائق.</p>'
          : '<h3 class="section-heading">Quick FAQ</h3><p><strong>Is a day trip enough?</strong> Yes for most routes with early departure.</p><p><strong>Is fuel included?</strong> Usually yes with driver service.</p>';
        contentCard.appendChild(faq);
      }

      if (!contentCard.querySelector('.destination-cta-block')) {
        const ctaBlock = document.createElement('div');
        ctaBlock.className = 'destination-cta-block';
        ctaBlock.style.cssText = 'margin-top:2rem; display:flex; gap:0.75rem; flex-wrap:wrap;';
        ctaBlock.innerHTML = isArabic
          ? '<a href="services-ar.html" class="action-btn">الخدمات والأسعار</a><a href="guide-ar.html" class="action-btn">الدليل</a><a href="arabic.html#booking" class="btn-book-nav" style="text-decoration:none;">احجز الآن</a>'
          : '<a href="services.html" class="action-btn">Services & Pricing</a><a href="guide.html" class="action-btn">Travel Guide</a><a href="index.html#booking" class="btn-book-nav" style="text-decoration:none;">Book Now</a>';
        contentCard.appendChild(ctaBlock);
      }
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

  window.addEventListener('DOMContentLoaded', () => {
    UI.init();
    UI.standardizeDestinationLayout();
  });
})();
