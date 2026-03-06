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

  function detectArabic(filename) {
    const params = new URLSearchParams(window.location.search);
    const queryLang = params.get('lang');
    if (queryLang === 'ar') return true;
    if (queryLang === 'en') return false;
    if (filename === 'arabic.html' || filename.endsWith('-ar.html')) return true;
    return document.documentElement.lang === 'ar';
  }

  function toRootPath(path) { if (!path || path.startsWith('/') || path.startsWith('#') || path.startsWith('javascript:')) { return path; } if (/^https?:\/\//i.test(path)) { return path; } return '/' + path; }
  function getConfig(isArabic) {
    return {
      isArabic,
      texts: {
        brand: 'Georgia Hills',
        desc: isArabic
          ? 'حلول نقل فاخرة في جورجيا. أمان وراحة وخبرة محلية في كل ميل.'
          : 'Premium transport solutions in Georgia. Safety, comfort, and local expertise in every mile.',
        privacy: isArabic ? 'سياسة الخصوصية' : 'Privacy Policy',
        terms: isArabic ? 'شروط الخدمة' : 'Terms of Service',
        cancellation: isArabic ? 'سياسة الإلغاء' : 'Cancellation Policy',
        insurance: isArabic ? 'تأمين السفر' : 'Travel Insurance',
        licensing: isArabic ? 'الترخيص' : 'Licensing',
        quickLinks: isArabic ? 'روابط سريعة' : 'Quick Links',
        home: isArabic ? 'الرئيسية' : 'Home',
        fleet: isArabic ? 'السيارات' : 'Our Fleet',
        reviews: isArabic ? 'الآراء' : 'Reviews',
        book: isArabic ? 'احجز الآن' : 'Book Now',
        contact: isArabic ? 'اتصل بنا' : 'Contact Us',
        map: isArabic ? 'موقعنا' : 'Load Map',
        rights: isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.',
        homeLink: toRootPath(isArabic ? 'arabic.html' : 'index.html'),
        bookLink: toRootPath(isArabic ? 'booking-ar.html' : 'booking.html'),
        legalLink: toRootPath(isArabic ? 'legal-ar.html' : 'legal.html'),
        privacyLink: toRootPath(isArabic ? 'legal-ar.html#privacy' : 'legal.html#privacy'),
        termsLink: toRootPath(isArabic ? 'legal-ar.html#terms' : 'legal.html#terms'),
        cancellationLink: toRootPath(isArabic ? 'legal-ar.html#cancellation' : 'legal.html#cancellation'),
        insuranceLink: toRootPath(isArabic ? 'legal-ar.html#insurance' : 'legal.html#insurance'),
        licensingLink: toRootPath(isArabic ? 'legal-ar.html#licensing' : 'legal.html#licensing'),
      }
    };
  }

  function buildMarkup(cfg) {
    return `
      <div class="container">
        <div id="footer-content" class="footer-grid">
            <!-- Brand -->
            <div>
                <div class="footer-brand">
                    <div class="footer-brand-icon"><i class="fa-solid fa-mountain"></i></div>
                    <span class="footer-brand-text">${cfg.texts.brand}</span>
                </div>
                <p style="color:var(--color-gray-300); font-size:0.875rem; line-height:1.6; margin-bottom:1.5rem;">${cfg.texts.desc}</p>
                <div class="footer-social">
                    <a href="https://instagram.com/georgiahills" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                    <a href="https://facebook.com/georgiahills" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                    <button onclick="window.App && typeof App.share === 'function' && App.share()" class="social-btn" aria-label="Share Website"><i class="fa-solid fa-share-nodes"></i></button>
                </div>
                <div style="margin-top:1.5rem; display:flex; flex-wrap:wrap; gap:1rem; font-size:0.75rem; color:var(--color-gray-400);">
                    <a href="${cfg.texts.privacyLink}" style="color:inherit;text-decoration:none;">${cfg.texts.privacy}</a>
                    <a href="${cfg.texts.termsLink}" style="color:inherit;text-decoration:none;">${cfg.texts.terms}</a>
                    <a href="${cfg.texts.cancellationLink}" style="color:inherit;text-decoration:none;">${cfg.texts.cancellation}</a>
                    <a href="${cfg.texts.insuranceLink}" style="color:inherit;text-decoration:none;">${cfg.texts.insurance}</a>
                    <a href="${cfg.texts.licensingLink}" style="color:inherit;text-decoration:none;">${cfg.texts.licensing}</a>
                </div>
            </div>
            <!-- Links -->
            <div>
                <h3>${cfg.texts.quickLinks}</h3>
                <ul>
                    <li><a href="${cfg.texts.homeLink}#home">${cfg.texts.home}</a></li>
                    <li><a href="${cfg.texts.homeLink}#fleet">${cfg.texts.fleet}</a></li>
                    <li><a href="${cfg.texts.homeLink}#reviews">${cfg.texts.reviews}</a></li>
                    <li><a href="${cfg.texts.bookLink}">${cfg.texts.book}</a></li>
                </ul>
            </div>
            <!-- Contact -->
            <div>
                <h3>${cfg.texts.contact}</h3>
                <ul style="color:var(--color-gray-400);">
                    <li class="footer-contact-item"><i class="fa-solid fa-phone text-accent"></i> <a href="tel:+995579088537" dir="ltr">+995 579 08 85 37</a></li>
                    <li class="footer-contact-item"><i class="fa-brands fa-whatsapp text-accent"></i> <a href="https://wa.me/995579088537" target="_blank" rel="noopener noreferrer" dir="ltr">+995 579 08 85 37</a></li>
                    <li class="footer-contact-item"><i class="fa-solid fa-envelope text-accent"></i> <a href="mailto:info@georgiahills.com">info@georgiahills.com</a></li>
                    <li class="footer-contact-item"><i class="fa-solid fa-location-dot text-accent"></i> <span>123 Rustaveli Ave, Tbilisi, GE</span></li>
                </ul>
            </div>
            <!-- Map -->
            <div>
                <div class="footer-map-container">
                    <span class="footer-map-overlay"><i class="fa-solid fa-map-location-dot"></i> <span>${cfg.texts.map}</span></span>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            &copy; <span id="year">2026</span> Georgia Hills. ${cfg.texts.rights}
        </div>
      </div>
    `;
  }

  function renderSharedFooter() {
    if (window.__GH_SHARED_FOOTER__) return;

    const footer = document.querySelector('footer.footer') || document.getElementById('footer');
    if (!footer) return;

    const filename = getFilename();
    const isArabic = detectArabic(filename);
    const cfg = getConfig(isArabic);

    footer.innerHTML = toTrustedHTML(buildMarkup(cfg));

    // Update year
    const yearSpan = footer.querySelector('#year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    window.__GH_SHARED_FOOTER__ = true;
  }

  function renderSharedFooterDeferred() {
    const runAfterPaint = () => {
      window.requestAnimationFrame(() => renderSharedFooter());
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(runAfterPaint, { timeout: 800 });
    } else {
      setTimeout(runAfterPaint, 120);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSharedFooterDeferred, { once: true });
  } else {
    renderSharedFooterDeferred();
  }
})();
