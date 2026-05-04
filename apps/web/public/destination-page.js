(function () {
  const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "AIzaSyApLm0zacQiM1VbSQ5INRlQ28ev3QoTw2o",
    authDomain: "georgiahills-15d19.firebaseapp.com",
    projectId: "georgiahills-15d19",
    storageBucket: "georgiahills-15d19.firebasestorage.app",
    messagingSenderId: "447700508040",
    appId: "1:447700508040:web:379c32079d09523a14ae3d",
    measurementId: "G-PTEM4FPQR1",
    functionsRegion: "europe-west1"
  };

  const firebaseConfig = window.__GH_FIREBASE_CONFIG || DEFAULT_FIREBASE_CONFIG;

  const AppConfig = {
    vehicleRates: { Sedan: 150 },
    currencies: [
      { code: "GEL", flag: "ge" },
      { code: "USD", flag: "us" },
      { code: "EUR", flag: "eu" },
      { code: "AED", flag: "ae" },
      { code: "SAR", flag: "sa" },
      { code: "KWD", flag: "kw" },
      { code: "QAR", flag: "qa" },
      { code: "OMR", flag: "om" }
    ],
    defaultRates: {
      GEL: 1,
      USD: 0.37,
      EUR: 0.34,
      AED: 1.35,
      SAR: 1.38,
      KWD: 0.11,
      QAR: 1.34,
      OMR: 0.14
    }
  };

  const DESTINATION_DATA = {
    tbilisi: {
      img: "Tbilisi.webp",
      gallery: [
        "tbilisi-old-town-1024.webp",
        "Tbilisi-768.webp",
        "Tbilisi-640.webp",
        "Tbilisi-1024.webp"
      ],
      highlights_en: ["Old Town & Sulphur Baths", "Narikala Fortress", "Peace Bridge", "Rustaveli Avenue"],
      highlights_ar: ["المدينة القديمة وحمامات الكبريت", "قلعة ناريكالا", "جسر السلام", "شارع روستافيلي"],
      title_en: "Tbilisi: The Heart of Georgia",
      title_ar: "السياحة في تبليسي: أهم المعالم والأماكن",
      desc_en: "Tbilisi, the capital of Georgia, is a city where old meets new in a spectacular fashion. Founded in the 5th century, its diverse history is reflected in its architecture, which is a mix of medieval, neoclassical, Beaux Arts, Art Nouveau, Stalinist and Modern structures.\n\nWander through the narrow streets of the Old Town, relax in the famous sulfur baths (Abanotubani), and enjoy the stunning panoramic views from Narikala Fortress. Whether you're looking for history, modern nightlife, or culinary adventures, Tbilisi has it all.",
      desc_ar: "تبليسي، عاصمة جورجيا، هي مدينة يلتقي فيها التاريخ بالحداثة في مشهد مذهل. تأسست في القرن الخامس، وتتميز بتاريخها المتنوع الذي ينعكس في عمارتها الفريدة.\n\nتجوّل في الأزقة الضيقة للمدينة القديمة، واسترخِ في حمامات الكبريت الشهيرة (أبانوتوباني)، واستمتع بإطلالات بانورامية خلابة من قلعة ناريكالا. سواء كنت تبحث عن التاريخ، الحياة العصرية، أو تجربة المطبخ الجورجي الأصيل، فإن تبليسي هي وجهتك المثالية."
    },
    kazbegi: {
      img: "Kazbegi.webp",
      gallery: ["kazbegi-hero-1024.webp", "Kazbegi-768.webp"],
      highlights_en: ["Gergeti Trinity Church", "Mount Kazbek View", "Gveleti Waterfall", "Dariali Gorge"],
      highlights_ar: ["كنيسة الثالوث جيرجيتي", "إطلالة جبل كازبيك", "شلال جفيليتي", "مضيق داريالي"],
      title_en: "Kazbegi: Peaks Above the Clouds",
      title_ar: "رحلة كازبيجي: جبال القوقاز والطبيعة",
      desc_en: "Step into a postcard at Kazbegi (Stepantsminda). This region is home to the breathtaking Mount Kazbek and the iconic Gergeti Trinity Church, sitting high at 2,170 meters under the glacier.\n\nThe drive along the Georgian Military Highway is an adventure in itself, passing the Ananuri Fortress and the Russia-Georgia Friendship Monument. It is a perfect destination for nature lovers, hikers, and anyone seeking fresh mountain air.",
      desc_ar: "استمتع بمشهد خيالي في كازبيجي (ستيبانتسميندا). هذه المنطقة هي موطن جبل كازبيك الشاسق وكنيسة الثالوث جيرجيتي الشهيرة التي تتربع على ارتفاع 2170 متراً تحت النهر الجليدي.\n\nالطريق عبر الطريق العسكري الجورجي هو مغامرة بحد ذاته، مروراً بقلعة أنانوري ونصب الصداقة. إنها الوجهة المثالية لعشاق الطبيعة والمشي لمسافات طويلة وكل من يبحث عن هواء الجبل النقي."
    },
    martvili: {
      img: "Martvili.webp",
      gallery: ["Martvili-1024.webp", "Martvili-768.webp"],
      highlights_en: ["Boat Ride in Canyon", "Walking Trails", "Dadiani Palace", "Waterfalls"],
      highlights_ar: ["جولة بالقارب في الوادي", "مسارات المشي", "قصر دادياني", "الشلالات"],
      title_en: "Martvili Canyon: Emerald Waters",
      title_ar: "وادي مارتفيلي: جولة القوارب والشلالات",
      desc_en: "Discover the hidden gem of Western Georgia. Martvili Canyon offers a surreal experience with its emerald green waters, waterfalls, and white limestone cliffs.\n\nThe highlight of any trip here is a boat ride through the stunning gorges. Historically, this was a bathing place for the Dadiani noble family. Today, it stands as one of the most photogenic spots in the country.",
      desc_ar: "اكتشف الجوهرة المخفية في غرب جورجيا. يقدم وادي مارتفيلي تجربة خيالية بمياهه الخضراء الزمردية، والشلالات، والمنحدرات الصخرية البيضاء.\n\nأبرز ما في الرحلة هنا هو ركوب القارب عبر المضائق المذهلة. تاريخياً، كان هذا المكان مسبحاً لعائلة دادياني النبيلة. اليوم، يعد واحداً من أجمل المواقع للتصوير في البلاد."
    },
    signagi: {
      img: "Signagi.webp",
      gallery: ["Signagi-1024.webp", "Signagi-768.webp"],
      highlights_en: ["City Walls Walk", "Bodbe Monastery", "Wine Tasting", "Alazani Valley View"],
      highlights_ar: ["المشي على أسوار المدينة", "دير بودبي", "تذوق النبيذ", "إطلالة وادي ألازاني"],
      title_en: "Signagi: The City of Love",
      title_ar: "سغناغي: مدينة الحب ومزارع العنب",
      desc_en: "Perched on a hilltop overlooking the vast Alazani Valley and the Caucasus Mountains, Signagi is one of Georgia's most charming towns. Known as the 'City of Love', it is famous for its 24/7 wedding house and romantic atmosphere.\n\nWander through cobblestone streets, admire the 18th-century architecture, and explore the ancient city walls. As the heart of the Kakheti wine region, it is also the best place to taste traditional Georgian wine.",
      desc_ar: "تتربع سغناغي على قمة تل يطل على وادي ألازاني الشاسع وجبال القوقاز، وهي واحدة من أكثر المدن سحراً في جورجيا. تُعرف بـ 'مدينة الحب'، وتشتهر بأجوائها الرومانسية ومكتب الزواج الذي يعمل على مدار الساعة.\n\nتجول في الشوارع المرصوفة بالحصى، وتأمل العمارة من القرن الثامن عشر، واستكشف أسوار المدينة القديمة. وباعتبارها قلب منطقة كاخيتي للنبيذ، فهي أفضل مكان لتذوق النبيذ الجورجي التقليدي."
    },
    batumi: {
      img: "Batumi.webp",
      gallery: ["Batumi.webp", "image-1024.webp"],
      highlights_en: ["Ali & Nino Statue", "Batumi Boulevard", "Botanical Garden", "Alphabetic Tower"],
      highlights_ar: ["تمثال علي ونينو", "بوليفارد باتومي", "الحديقة النباتية", "برج الحروف"],
      title_en: "Batumi: Pearl of the Black Sea",
      title_ar: "باتومي: لؤلؤة البحر الأسود",
      desc_en: "Batumi is a vibrant seaside city on the Black Sea coast and capital of Adjara. It's known for its modern architecture, botanical garden, and pebbly beaches.",
      desc_ar: "باتومي هي مدينة ساحلية نابضة بالحياة على ساحل البحر الأسود وعاصمة أدجارا. تشتهر بعمارتها الحديثة وحديقتها النباتية وشواطئها الحصوية."
    }
  };

  const DESTINATION_MEDIA = {
    tbilisi: {
      hero: { mobile: "Tbilisi-640.webp", desktop: "Tbilisi.webp" },
      gallery: {
        mobile: ["tbilisi-old-town-480.webp", "Tbilisi-480.webp", "Tbilisi-640.webp", "Tbilisi-480.webp"],
        desktop: ["tbilisi-old-town-1024.webp", "Tbilisi-768.webp", "Tbilisi-640.webp", "Tbilisi-1024.webp"]
      }
    },
    kazbegi: {
      hero: { mobile: "Kazbegi-640.webp", desktop: "Kazbegi.webp" },
      gallery: {
        mobile: ["Kazbegi-480.webp", "Kazbegi-480.webp"],
        desktop: ["kazbegi-hero-1024.webp", "Kazbegi-768.webp"]
      }
    },
    martvili: {
      hero: { mobile: "Martvili-640-lite.webp", desktop: "Martvili.webp" },
      gallery: {
        mobile: ["Martvili-480.webp", "Martvili-480.webp"],
        desktop: ["Martvili-1024.webp", "Martvili-768.webp"]
      }
    },
    signagi: {
      hero: { mobile: "Signagi-640-lite.webp", desktop: "Signagi.webp" },
      gallery: {
        mobile: ["Signagi-480.webp", "Signagi-480.webp"],
        desktop: ["Signagi-1024.webp", "Signagi-768.webp"]
      }
    },
    batumi: {
      hero: { mobile: "Batumi-480.webp", desktop: "Batumi.webp" },
      gallery: {
        mobile: ["Batumi-480.webp", "image-480.webp"],
        desktop: ["Batumi.webp", "image-1024.webp"]
      }
    }
  };

  let db = null;
  let firebaseBootstrapPromise = null;

  function runWhenIdle(task, timeout) {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(task, { timeout: timeout || 1500 });
      return;
    }
    window.setTimeout(task, 0);
  }

  function sanitizeImageUrl(url) {
    if (typeof url !== "string") return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (/^(https?:)?\/\//i.test(trimmed)) return trimmed;
    if (/^[./a-zA-Z0-9_-]+\.(webp|png|jpg|jpeg|gif|avif|svg)$/i.test(trimmed)) return trimmed;
    return "";
  }

  function normalizeLangCode(rawLang) {
    const value = String(rawLang || "").trim().toLowerCase();
    return value.startsWith("ar") ? "ar" : "en";
  }

  function normalizeDestinationId(rawId) {
    const value = String(rawId || "").trim().toLowerCase();
    if (value && DESTINATION_DATA[value]) return value;
    return "tbilisi";
  }

  function normalizeDestinationShape(id, raw) {
    const source = raw || {};
    const existing = DESTINATION_DATA[id] || DESTINATION_DATA.tbilisi;
    const readText = function (value) {
      return typeof value === "string" ? value : "";
    };
    const readList = function (value) {
      if (Array.isArray(value)) return value.filter(function (item) { return typeof item === "string" && item.trim(); });
      if (typeof value === "string" && value.trim()) return [value.trim()];
      return [];
    };

    return {
      title_en: readText(source.title_en) || readText(source.title && source.title.en) || existing.title_en,
      title_ar: readText(source.title_ar) || readText(source.title && source.title.ar) || existing.title_ar,
      desc_en: readText(source.desc_en) || readText(source.desc && source.desc.en) || existing.desc_en,
      desc_ar: readText(source.desc_ar) || readText(source.desc && source.desc.ar) || existing.desc_ar,
      highlights_en: readList(source.highlights_en || (source.highlights && source.highlights.en) || existing.highlights_en),
      highlights_ar: readList(source.highlights_ar || (source.highlights && source.highlights.ar) || existing.highlights_ar),
      gallery: readList(source.gallery && source.gallery.length ? source.gallery : existing.gallery),
      img: sanitizeImageUrl(source.img || source.thumbnail || existing.img) || existing.img,
      thumbnail: sanitizeImageUrl(source.thumbnail || existing.img) || existing.img,
      map_url: readText(source.map_url) || readText(source.mapUrl) || ""
    };
  }

  function getResponsiveMedia(id) {
    const media = DESTINATION_MEDIA[id] || DESTINATION_MEDIA.tbilisi;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    return {
      hero: sanitizeImageUrl(isMobile ? media.hero.mobile : media.hero.desktop) || sanitizeImageUrl((DESTINATION_DATA[id] || DESTINATION_DATA.tbilisi).img),
      gallery: (isMobile ? media.gallery.mobile : media.gallery.desktop).map(sanitizeImageUrl).filter(Boolean)
    };
  }

  function loadExternalScript(src) {
    return new Promise(function (resolve, reject) {
      const existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (existing.dataset.loaded === "true") {
          resolve();
          return;
        }
        existing.addEventListener("load", function () { resolve(); }, { once: true });
        existing.addEventListener("error", function () { reject(new Error("Failed to load script: " + src)); }, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.defer = true;
      script.onload = function () {
        script.dataset.loaded = "true";
        resolve();
      };
      script.onerror = function () { reject(new Error("Failed to load script: " + src)); };
      document.head.appendChild(script);
    });
  }

  function shouldDeferFirebase() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection) return false;
    if (connection.saveData) return true;
    return connection.effectiveType === "slow-2g" || connection.effectiveType === "2g";
  }

  async function ensureFirebaseReady() {
    if (db) return db;
    if (shouldDeferFirebase()) return null;

    if (!firebaseBootstrapPromise) {
      firebaseBootstrapPromise = (async function () {
        await loadExternalScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
        await loadExternalScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js");
        if (typeof firebase === "undefined" || !firebase.firestore) return null;
        if (!firebase.apps || !firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
        return db;
      })().catch(function () {
        db = null;
        return null;
      });
    }

    return firebaseBootstrapPromise;
  }

  const CurrencyManager = {
    current: "GEL",

    init: function () {
      const stored = localStorage.getItem("preferredCurrency");
      const exists = AppConfig.currencies.some(function (currency) { return currency.code === stored; });
      this.current = exists ? stored : "GEL";
      this.renderOptions();
      this.updateUI();
    },

    set: function (code) {
      if (!AppConfig.currencies.some(function (currency) { return currency.code === code; })) return;
      this.current = code;
      localStorage.setItem("preferredCurrency", code);
      this.updateUI();
      UIManager.closeCurrencyDropdowns();
    },

    convertFromGel: function (amount) {
      const rate = AppConfig.defaultRates[this.current] || 1;
      if (this.current === "KWD" || this.current === "OMR") return (Math.round(amount * rate * 10) / 10).toFixed(1);
      return String(Math.round(amount * rate));
    },

    renderOptions: function () {
      ["desktop", "mobile"].forEach(function (mode) {
        const container = document.getElementById("curr-options-" + mode);
        if (!container) return;
        container.innerHTML = "";
        AppConfig.currencies.forEach(function (currency) {
          const option = document.createElement("button");
          option.type = "button";
          option.className = "custom-option" + (currency.code === CurrencyManager.current ? " selected" : "");
          option.textContent = currency.code;
          option.addEventListener("click", function () {
            CurrencyManager.set(currency.code);
          });
          container.appendChild(option);
        });
      });
    },

    updateUI: function () {
      const currentMeta = AppConfig.currencies.find(function (currency) { return currency.code === CurrencyManager.current; }) || AppConfig.currencies[0];
      ["desktop", "mobile"].forEach(function (mode) {
        const codeEl = document.getElementById("curr-code-" + mode);
        const flagEl = document.getElementById("curr-flag-" + mode);
        if (codeEl) codeEl.textContent = CurrencyManager.current;
        if (flagEl) {
          flagEl.src = "https://flagcdn.com/w40/" + currentMeta.flag + ".png";
          flagEl.alt = CurrencyManager.current;
        }
      });

      this.renderOptions();

      const sidebarPrice = document.getElementById("sidebar-price");
      if (sidebarPrice) {
        sidebarPrice.textContent = this.convertFromGel(AppConfig.vehicleRates.Sedan) + " " + this.current;
      }
    }
  };

  const UIManager = {
    init: function () {
      this.setupMobileMenu();
      this.setupScrollEffects();
      this.setupCurrencyDropdowns();
      this.updateYear();
    },

    setupMobileMenu: function () {
      const menu = document.getElementById("mobile-menu");
      const openButton = document.getElementById("mobile-menu-btn");
      const closeButton = document.getElementById("close-menu-btn");
      if (!menu) return;

      const toggleMenu = function (forceOpen) {
        const willOpen = typeof forceOpen === "boolean" ? forceOpen : !menu.classList.contains("open");
        menu.classList.toggle("open", willOpen);
        menu.setAttribute("aria-hidden", willOpen ? "false" : "true");
        if (openButton) openButton.setAttribute("aria-expanded", willOpen ? "true" : "false");
        document.body.classList.toggle("overflow-hidden", willOpen);
      };

      if (openButton) openButton.addEventListener("click", function () { toggleMenu(true); });
      if (closeButton) closeButton.addEventListener("click", function () { toggleMenu(false); });

      menu.querySelectorAll(".mobile-link, .mobile-btn-book").forEach(function (link) {
        link.addEventListener("click", function () { toggleMenu(false); });
      });
    },

    setupScrollEffects: function () {
      const nav = document.getElementById("navbar");
      if (!nav) return;
      const update = function () {
        const scrolled = window.scrollY > 20;
        nav.classList.toggle("shadow-md", scrolled);
        nav.classList.toggle("scrolled", scrolled);
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
    },

    setupCurrencyDropdowns: function () {
      CurrencyManager.init();
      document.addEventListener("click", function (event) {
        if (!event.target.closest(".custom-select-wrapper")) {
          UIManager.closeCurrencyDropdowns();
        }
      });
    },

    toggleCurrencyDropdown: function (mode) {
      const wrapper = document.getElementById("currency-" + mode);
      if (!wrapper) return;
      const willOpen = !wrapper.classList.contains("open");
      this.closeCurrencyDropdowns();
      wrapper.classList.toggle("open", willOpen);
    },

    closeCurrencyDropdowns: function () {
      document.querySelectorAll(".custom-select-wrapper.open").forEach(function (wrapper) {
        wrapper.classList.remove("open");
      });
    },

    updateYear: function () {
      const year = document.getElementById("year");
      if (year) year.textContent = String(new Date().getFullYear());
    }
  };

  const LangManager = {
    get current() {
      const path = window.location.pathname.toLowerCase();
      if (path.endsWith("destination-ar.html")) return "ar";
      if (path.endsWith("destination.html")) {
        const params = new URLSearchParams(window.location.search);
        return normalizeLangCode(params.get("lang") || localStorage.getItem("userLang") || document.documentElement.lang || "en");
      }
      return normalizeLangCode(document.documentElement.lang || "en");
    },

    apply: function () {
      const lang = this.current;
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    },

    sync: function () {
      localStorage.setItem("userLang", this.current);
    },

    toggle: function () {
      const current = this.current;
      const params = new URLSearchParams(window.location.search);
      const id = normalizeDestinationId(params.get("id"));
      if (current === "ar") {
        window.location.href = "destination.html?id=" + encodeURIComponent(id);
        return;
      }
      window.location.href = "destination-ar.html?id=" + encodeURIComponent(id);
    }
  };

  const DestinationApp = {
    getDisplayTitle: function (title) {
      if (typeof title !== "string" || !title.trim()) return "Destination";
      const shortTitle = title.split(":")[0].trim();
      return shortTitle || title.trim();
    },

    getBadge: function (id, lang) {
      const badges = {
        en: {
          tbilisi: "Capital City",
          kazbegi: "Mountain Escape",
          martvili: "Canyon Adventure",
          signagi: "Wine Country",
          batumi: "Sea Escape",
          fallback: "Signature Destination"
        },
        ar: {
          tbilisi: "العاصمة",
          kazbegi: "ملاذ جبلي",
          martvili: "مغامرة الوادي",
          signagi: "منطقة النبيذ",
          batumi: "وجهة ساحلية",
          fallback: "وجهة مميزة"
        }
      };

      return badges[lang][id] || badges[lang].fallback;
    },

    getStats: function (id, lang) {
      const stats = {
        en: {
          tbilisi: [["1-3 Days", "Recommended"], ["City + Hills", "Route Feel"], ["All Year", "Best Season"]],
          kazbegi: [["Full Day", "Recommended"], ["Mountain Road", "Route Feel"], ["May-Oct", "Best Season"]],
          martvili: [["Full Day", "Recommended"], ["Nature Route", "Route Feel"], ["Apr-Oct", "Best Season"]],
          signagi: [["Full Day", "Recommended"], ["Wine Region", "Route Feel"], ["Spring-Fall", "Best Season"]],
          batumi: [["2-3 Days", "Recommended"], ["Coastal City", "Route Feel"], ["May-Sep", "Best Season"]],
          fallback: [["1 Day", "Recommended"], ["Private Tour", "Route Feel"], ["All Year", "Best Season"]]
        },
        ar: {
          tbilisi: [["1-3 أيام", "المدة المناسبة"], ["مدينة + مرتفعات", "طابع الرحلة"], ["طوال العام", "أفضل موسم"]],
          kazbegi: [["رحلة يوم كامل", "المدة المناسبة"], ["طريق جبلي", "طابع الرحلة"], ["مايو-أكتوبر", "أفضل موسم"]],
          martvili: [["رحلة يوم كامل", "المدة المناسبة"], ["طبيعة وخضرة", "طابع الرحلة"], ["أبريل-أكتوبر", "أفضل موسم"]],
          signagi: [["رحلة يوم كامل", "المدة المناسبة"], ["منطقة النبيذ", "طابع الرحلة"], ["الربيع-الخريف", "أفضل موسم"]],
          batumi: [["2-3 أيام", "المدة المناسبة"], ["مدينة ساحلية", "طابع الرحلة"], ["مايو-سبتمبر", "أفضل موسم"]],
          fallback: [["يوم واحد", "المدة المناسبة"], ["جولة خاصة", "طابع الرحلة"], ["طوال العام", "أفضل موسم"]]
        }
      };

      return stats[lang][id] || stats[lang].fallback;
    },

    getItinerary: function (id, lang, title) {
      const fallback = {
        en: [
          ["Comfortable Start", "Begin with pickup and a direct route to the main highlights without overloading the day."],
          ["Core Sights", "Cover the most worthwhile stops in " + title + " with enough time to enjoy each one properly."],
          ["Flexible Finish", "Leave room for photo stops, food, and a relaxed return transfer."]
        ],
        ar: [
          ["بداية مريحة", "ابدأ بالاستقبال والانطلاق مباشرة إلى أهم المحطات بدون ضغط."],
          ["أبرز الأماكن", "غطِّ أهم ما يستحق الزيارة في " + title + " مع وقت كافٍ لكل محطة."],
          ["نهاية مرنة", "اترك مساحة للصور والطعام والتوقفات الإضافية قبل العودة."]
        ]
      };

      const plans = {
        en: {
          tbilisi: [
            ["Arrival & Old Town", "Start in the historic core, walk the old streets, and settle into the city rhythm before sunset."],
            ["Views & Landmarks", "Pair fortress viewpoints, iconic bridges, and the main cultural boulevard in one smooth driver-led route."],
            ["Flexible Add-ons", "Keep space for baths, cafes, shopping, or a half-day scenic detour depending on your pace."]
          ],
          kazbegi: [
            ["Early Departure", "Leave early for a comfortable mountain drive with scenic stops along the way."],
            ["Highland Highlights", "Focus on the main church viewpoint, dramatic valleys, and clean mountain-air stops."],
            ["Return at Golden Hour", "Head back after the key viewpoints while the road is still relaxed and the light is best."]
          ],
          martvili: [
            ["Morning Transfer", "Reach the canyon area early for the calmest pace and best photo conditions."],
            ["Canyon Experience", "Combine the boat ride, short walking paths, and nearby natural stops in one easy route."],
            ["Slow Return", "Add a relaxed lunch and scenic roadside breaks on the way back."]
          ],
          signagi: [
            ["Scenic Drive Out", "Use the outbound route for countryside viewpoints and an easy arrival into Kakheti."],
            ["Town & Monastery", "Blend the old town walls, monastery stop, and valley views without rushing."],
            ["Wine & Sunset", "Finish with a tasting stop or terrace break before returning to the city."]
          ],
          batumi: [
            ["Arrival & Boulevard", "Open with the promenade, old streets, and easy waterfront stops."],
            ["Gardens & Icons", "Pair the major city landmarks with a flexible visit to the botanical side of town."],
            ["Evening by the Sea", "Keep the last stretch open for dinner, lights, and a smooth hotel return."]
          ]
        },
        ar: {
          tbilisi: [
            ["الوصول والمدينة القديمة", "ابدأ من قلب تبليسي التاريخي واستمتع بالأزقة القديمة قبل وقت الغروب."],
            ["الإطلالات والمعالم", "اجمع بين القلعة والجسور والمعالم الرئيسية في مسار مريح مع السائق."],
            ["خيارات مرنة", "اترك مساحة للحمامات والكافيهات والتسوق أو إضافة توقفات حسب وقتك."]
          ],
          kazbegi: [
            ["انطلاق مبكر", "ابدأ الرحلة مبكراً للاستمتاع بالطريق الجبلي مع توقفات مريحة ومناظر رائعة."],
            ["أهم المعالم", "ركز على الكنيسة الشهيرة والإطلالات الجبلية والوديان في مسار واضح."],
            ["عودة مريحة", "الرجوع بعد أبرز التوقفات يمنحك طريقاً أهدأ وإضاءة أجمل للصور."]
          ],
          martvili: [
            ["الوصول صباحاً", "الوصول المبكر يمنحك أجواء أهدأ وفرصة أفضل للتصوير."],
            ["تجربة الوادي", "اجمع بين القارب والمشي الخفيف وأهم النقاط الطبيعية في زيارة واحدة."],
            ["عودة هادئة", "أضف استراحة غداء وتوقفات طبيعية بسيطة في طريق العودة."]
          ],
          signagi: [
            ["طريق ريفي جميل", "استمتع بالمشاهد الريفية في الطريق إلى كاخيتي قبل الوصول إلى سغناغي."],
            ["المدينة والدير", "قسّم الوقت بين البلدة القديمة والدير والإطلالات على الوادي."],
            ["نهاية هادئة", "اختم بتجربة تذوق أو جلسة مطلة قبل العودة إلى المدينة."]
          ],
          batumi: [
            ["الوصول والكورنيش", "ابدأ بالكورنيش والأماكن السهلة داخل المدينة الساحلية."],
            ["الحدائق والمعالم", "اجمع أهم رموز المدينة مع زيارة مرنة للحدائق أو المناطق الهادئة."],
            ["المساء على البحر", "اترك آخر الوقت للمشي أو العشاء مع عودة مريحة إلى الفندق."]
          ]
        }
      };

      return (plans[lang] && plans[lang][id]) || fallback[lang];
    },

    getSeasonCards: function (id, lang) {
      const cards = {
        en: {
          tbilisi: [["Spring & Autumn", "Best for walking, mixed city days, and balanced weather."], ["Winter Option", "Great for festive city atmosphere, baths, and lower crowd levels."]],
          kazbegi: [["Late Spring to Autumn", "Best road comfort, green scenery, and clear mountain viewpoints."], ["Winter Conditions", "Beautiful but more weather-dependent, so timing matters more."]],
          martvili: [["Warm Season", "Ideal for canyon access, boat rides, and lush greenery."], ["Shoulder Months", "Quieter visits with cooler weather and gentler pacing."]],
          signagi: [["Spring", "Excellent for soft weather, countryside views, and relaxed town walks."], ["Harvest Season", "Autumn is strongest for Kakheti scenery and wine-country atmosphere."]],
          batumi: [["Summer", "Best for seaside energy, long evenings, and full coastal activity."], ["Shoulder Season", "More relaxed city pace with pleasant weather and easier movement."]],
          fallback: [["Primary Window", "Spring and autumn usually offer the most comfortable travel balance."], ["Alternative Season", "Winter or summer can still work well depending on your route priorities."]]
        },
        ar: {
          tbilisi: [["الربيع والخريف", "الأفضل للمشي داخل المدينة والاستمتاع بالأجواء المعتدلة."], ["الخيار الشتوي", "مناسب للأجواء الهادئة والحمامات والكثافة الأقل."]],
          kazbegi: [["من أواخر الربيع إلى الخريف", "أفضل وقت للطريق المريح والمناظر الجبلية الواضحة."], ["الشتاء", "جميل جداً لكنه يعتمد أكثر على حالة الطقس والطريق."]],
          martvili: [["الموسم الدافئ", "الأفضل للقوارب والوادي والطبيعة الخضراء."], ["الأشهر الانتقالية", "زيارة أهدأ مع طقس ألطف وحركة أقل."]],
          signagi: [["الربيع", "ممتاز للأجواء اللطيفة والمشي والإطلالات الريفية."], ["موسم الحصاد", "الخريف هو الأفضل لأجواء كاخيتي وتجارب النبيذ."]],
          batumi: [["الصيف", "الأفضل للأجواء البحرية والنشاطات الساحلية والمساء الطويل."], ["الفترات الانتقالية", "أهدأ وأكثر راحة للتنقل داخل المدينة."]],
          fallback: [["الفترة الأساسية", "الربيع والخريف يمنحان أفضل توازن لمعظم الرحلات."], ["فترة بديلة", "الصيف أو الشتاء قد يكونان مناسبين حسب طبيعة الوجهة."]]
        }
      };

      return cards[lang][id] || cards[lang].fallback;
    },

    getFaq: function (lang, title) {
      return {
        en: [
          ["Is this route good as a day trip?", "Yes. Most guests book it as a private day route, though some places benefit from a slower overnight pace."],
          ["Should I book a driver or self-drive?", "For " + title + ", a private driver is usually the easier choice if you want flexible stops, less stress, and a smoother day."]
        ],
        ar: [
          ["هل تصلح هذه الوجهة لرحلة يوم واحد؟", "نعم، أغلب الضيوف يحجزونها كرحلة خاصة ليوم واحد، وبعض الوجهات تستفيد أكثر من مبيت مريح."],
          ["هل الأفضل سائق خاص أم قيادة ذاتية؟", "بالنسبة إلى " + title + " غالباً يكون السائق الخاص هو الخيار الأسهل إذا كنت تريد توقفات مرنة وتجربة أكثر راحة."]
        ]
      }[lang];
    },

    renderOverview: function (desc, lang) {
      const container = document.getElementById("overview-copy");
      if (!container) return;
      container.innerHTML = "";

      const paragraphs = String(desc || "")
        .split(/\n\s*\n/)
        .map(function (item) { return item.trim(); })
        .filter(Boolean);

      const items = paragraphs.length ? paragraphs : [lang === "ar" ? "استكشف هذه الوجهة مع سائق خاص وتوقفات مرنة وخطة سير أكثر راحة." : "Explore this destination with a private driver, flexible stops, and a smoother route plan from Georgia Hills."];

      items.forEach(function (paragraph) {
        const el = document.createElement("p");
        el.textContent = paragraph;
        container.appendChild(el);
      });
    },

    renderStats: function (id, lang) {
      this.getStats(id, lang).forEach(function (item, index) {
        const valueEl = document.getElementById("stat" + (index + 1) + "-value");
        const labelEl = document.getElementById("stat" + (index + 1) + "-label");
        if (valueEl) valueEl.textContent = item[0];
        if (labelEl) labelEl.textContent = item[1];
      });
    },

    renderItinerary: function (id, lang, title) {
      const list = document.getElementById("itinerary-list");
      if (!list) return;
      list.innerHTML = "";
      this.getItinerary(id, lang, title).forEach(function (item, index, items) {
        const row = document.createElement("div");
        row.className = "timeline-item";
        row.innerHTML = '<div class="timeline-dot"></div>' + (index < items.length - 1 ? '<div class="timeline-line"></div>' : "") + '<div class="timeline-content"><strong></strong><p></p></div>';
        row.querySelector("strong").textContent = item[0];
        row.querySelector("p").textContent = item[1];
        list.appendChild(row);
      });
    },

    renderSeasonCards: function (id, lang) {
      const container = document.getElementById("season-copy");
      if (!container) return;
      container.innerHTML = "";
      this.getSeasonCards(id, lang).forEach(function (card, index) {
        const item = document.createElement("div");
        item.style.background = "var(--color-gray-50)";
        item.style.padding = "1.25rem";
        item.style.borderRadius = "0.75rem";
        item.innerHTML = '<strong><i class="fa-solid ' + (index === 0 ? "fa-sun" : "fa-calendar-days") + ' text-accent"></i> </strong><p style="font-size:0.9rem; margin-top:0.5rem; color:var(--color-gray-600);"></p>';
        item.querySelector("strong").append(document.createTextNode(card[0]));
        item.querySelector("p").textContent = card[1];
        container.appendChild(item);
      });
    },

    renderFaq: function (lang, title) {
      const list = document.getElementById("faq-list");
      if (!list) return;
      list.innerHTML = "";
      this.getFaq(lang, title).forEach(function (item) {
        const details = document.createElement("details");
        details.className = "faq-item";
        details.innerHTML = '<summary style="font-weight:700; cursor:pointer; list-style:none; display:flex; justify-content:space-between; align-items:center;"></summary><p style="margin-top:0.75rem; color:var(--color-gray-600);"></p>';
        const summary = details.querySelector("summary");
        summary.append(document.createTextNode(item[0]));
        const icon = document.createElement("i");
        icon.className = "fa-solid fa-chevron-down text-primary";
        summary.appendChild(icon);
        details.querySelector("p").textContent = item[1];
        list.appendChild(details);
      });
    },

    renderGallery: function (id, data, lang) {
      const gallery = document.getElementById("gallery");
      if (!gallery) return;
      gallery.innerHTML = "";

      const media = getResponsiveMedia(id);
      const images = media.gallery.length ? media.gallery : data.gallery;
      const highlights = data["highlights_" + lang] || data.highlights_en || data.highlights_ar || [];
      const fallbackDesc = lang === "ar" ? "محطة بارزة ضمن مسار هذه الوجهة." : "One of the standout stops on this destination route.";

      images.forEach(function (url, index) {
        const safeUrl = sanitizeImageUrl(url);
        if (!safeUrl) return;

        const card = document.createElement("article");
        card.className = "highlight-card";
        const img = document.createElement("img");
        img.className = "highlight-img";
        img.loading = "lazy";
        img.decoding = "async";
        img.src = safeUrl;
        img.alt = highlights[index] || "";

        const overlay = document.createElement("div");
        overlay.className = "highlight-overlay";
        const title = document.createElement("h4");
        title.className = "highlight-title";
        title.textContent = highlights[index] || DestinationApp.getDisplayTitle(data["title_" + lang] || data.title_en || data.title_ar);
        const desc = document.createElement("p");
        desc.className = "highlight-desc";
        desc.textContent = fallbackDesc;
        overlay.appendChild(title);
        overlay.appendChild(desc);
        card.appendChild(img);
        card.appendChild(overlay);
        gallery.appendChild(card);
      });
    },

    renderMoreDestinations: function (currentId, lang) {
      let grid = document.getElementById("more-destinations-grid");
      const container = document.getElementById("explore-more-destinations");
      if (!grid && container) {
        container.innerHTML = '<h3 class="section-title" id="explore-heading" style="margin-bottom:1.5rem;">Explore More</h3><div id="more-destinations-grid" class="more-destinations-grid"></div>';
        grid = document.getElementById("more-destinations-grid");
      }
      if (!grid) return;

      grid.innerHTML = "";
      Object.keys(DESTINATION_DATA)
        .filter(function (id) { return id !== currentId; })
        .slice(0, 3)
        .forEach(function (id) {
          const item = normalizeDestinationShape(id, DESTINATION_DATA[id]);
          const title = item["title_" + lang] || item.title_en || item.title_ar || id;
          const desc = item["desc_" + lang] || item.desc_en || item.desc_ar || "";
          const media = getResponsiveMedia(id);
          const card = document.createElement("a");
          card.href = (lang === "ar" ? "destination-ar.html" : "destination.html") + "?id=" + encodeURIComponent(id) + (lang === "ar" ? "" : "");
          card.className = "more-dest-card";
          card.innerHTML = '<img class="more-dest-img" loading="lazy" decoding="async"><div class="more-dest-overlay"><h4 class="more-dest-title"></h4><p class="more-dest-desc"></p></div><div class="more-dest-arrow"><i class="fa-solid ' + (lang === "ar" ? "fa-arrow-left" : "fa-arrow-right") + '"></i></div>';
          card.querySelector("img").src = media.hero;
          card.querySelector("img").alt = title;
          card.querySelector(".more-dest-title").textContent = DestinationApp.getDisplayTitle(title);
          card.querySelector(".more-dest-desc").textContent = desc.split("\n")[0].trim().slice(0, 90);
          grid.appendChild(card);
        });
    },

    renderMeta: function (id, data, lang) {
      const title = data["title_" + lang] || data.title_en || data.title_ar;
      const desc = data["desc_" + lang] || data.desc_en || data.desc_ar || "";
      const media = getResponsiveMedia(id);
      const absoluteImageUrl = /^(https?:)?\/\//i.test(media.hero) ? media.hero : window.location.origin + "/" + media.hero.replace(/^\//, "");
      document.title = title + " - Georgia Hills";

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = desc ? desc.slice(0, 160) : metaDesc.content;

      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        const url = new URL(window.location.href);
        url.searchParams.set("id", id);
        if (lang !== "en") url.searchParams.set("lang", lang);
        else url.searchParams.delete("lang");
        canonical.href = url.toString();
      }

      ["og:title", "og:description", "og:image"].forEach(function (prop) {
        let meta = document.querySelector('meta[property="' + prop + '"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("property", prop);
          document.head.appendChild(meta);
        }
        meta.content = prop === "og:title" ? title : prop === "og:image" ? absoluteImageUrl : (desc.slice(0, 200) || "");
      });

      const schema = document.getElementById("json-ld-data");
      if (schema) {
        schema.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TouristAttraction",
          name: title,
          description: desc,
          image: absoluteImageUrl,
          url: window.location.href,
          address: { "@type": "PostalAddress", addressCountry: "GE" }
        });
      }
    },

    renderChrome: function (id, data, lang) {
      const title = data["title_" + lang] || data.title_en || data.title_ar;
      const desc = data["desc_" + lang] || data.desc_en || data.desc_ar || "";
      const displayTitle = this.getDisplayTitle(title);
      const media = getResponsiveMedia(id);

      const heroBg = document.getElementById("hero-bg");
      if (heroBg) heroBg.style.backgroundImage = 'url("' + media.hero + '")';

      const crumbTitle = document.getElementById("crumb-title");
      if (crumbTitle) {
        crumbTitle.textContent = displayTitle;
        crumbTitle.classList.remove("skeleton");
      }

      const crumbCurrent = document.getElementById("crumb-current");
      if (crumbCurrent) {
        crumbCurrent.textContent = displayTitle;
        crumbCurrent.style.display = "inline";
      }

      const badge = document.getElementById("dest-badge");
      if (badge) badge.textContent = this.getBadge(id, lang);

      const pageTitle = document.getElementById("page-title");
      if (pageTitle) pageTitle.textContent = displayTitle;

      const pageDesc = document.getElementById("page-desc");
      if (pageDesc) pageDesc.textContent = desc.split("\n")[0].trim();

      const overviewHeading = document.getElementById("overview-heading");
      if (overviewHeading) overviewHeading.textContent = lang === "ar" ? "نظرة عامة" : "Overview";

      const highlights = document.getElementById("highlights");
      if (highlights) {
        highlights.innerHTML = "";
        (data["highlights_" + lang] || []).forEach(function (item) {
          const li = document.createElement("li");
          const icon = document.createElement("i");
          icon.className = "fa-solid fa-star";
          li.appendChild(icon);
          li.appendChild(document.createTextNode(" " + item));
          highlights.appendChild(li);
        });
      }
    },

    renderCtas: function (lang) {
      const copy = {
        en: {
          itineraryHeading: "Suggested Plan",
          seasonHeading: "Best Time to Visit",
          faqHeading: "Common Questions",
          exploreHeading: "Explore More",
          primaryCta: "Book a Driver",
          secondaryCta: "See Price List",
          priceNote: "Private driver day rate"
        },
        ar: {
          itineraryHeading: "الخطة المقترحة",
          seasonHeading: "أفضل وقت للزيارة",
          faqHeading: "أسئلة شائعة",
          exploreHeading: "اكتشف المزيد",
          primaryCta: "احجز سائقاً خاصاً",
          secondaryCta: "الخدمات والأسعار",
          priceNote: "السعر اليومي مع سائق خاص"
        }
      }[lang];

      const bookingHref = lang === "ar" ? "booking-ar.html" : "booking.html";
      const servicesHref = lang === "ar" ? "services-ar.html" : "services.html";

      const itineraryHeading = document.getElementById("itinerary-heading");
      if (itineraryHeading) itineraryHeading.textContent = copy.itineraryHeading;
      const seasonHeading = document.getElementById("season-heading");
      if (seasonHeading) seasonHeading.textContent = copy.seasonHeading;
      const faqHeading = document.getElementById("faq-heading");
      if (faqHeading) faqHeading.textContent = copy.faqHeading;
      const exploreHeading = document.getElementById("explore-heading");
      if (exploreHeading) exploreHeading.textContent = copy.exploreHeading;

      const primaryCta = document.getElementById("primary-cta");
      if (primaryCta) {
        primaryCta.href = bookingHref;
        primaryCta.textContent = copy.primaryCta;
      }

      const secondaryCta = document.getElementById("secondary-cta");
      if (secondaryCta) {
        secondaryCta.href = servicesHref;
        secondaryCta.textContent = copy.secondaryCta;
      }

      const sidebarBookLink = document.getElementById("sidebar-book-link");
      if (sidebarBookLink) {
        sidebarBookLink.href = bookingHref;
        sidebarBookLink.textContent = copy.primaryCta;
      }

      const sidebarPriceNote = document.getElementById("sidebar-price-note");
      if (sidebarPriceNote) sidebarPriceNote.textContent = copy.priceNote;
    },

    render: function (id, data, lang) {
      this.renderMeta(id, data, lang);
      this.renderChrome(id, data, lang);
      this.renderOverview(data["desc_" + lang], lang);
      this.renderStats(id, lang);
      this.renderItinerary(id, lang, this.getDisplayTitle(data["title_" + lang] || data.title_en || data.title_ar));
      this.renderSeasonCards(id, lang);
      this.renderFaq(lang, this.getDisplayTitle(data["title_" + lang] || data.title_en || data.title_ar));
      this.renderGallery(id, data, lang);
      this.renderMoreDestinations(id, lang);
      this.renderCtas(lang);
      CurrencyManager.updateUI();
    },

    init: function () {
      LangManager.apply();
      UIManager.init();

      const params = new URLSearchParams(window.location.search);
      const id = normalizeDestinationId(params.get("id"));
      const lang = LangManager.current;
      const localData = normalizeDestinationShape(id, DESTINATION_DATA[id]);
      this.render(id, localData, lang);

      if (window.matchMedia("(max-width: 900px)").matches) return;

      runWhenIdle(async function () {
        const liveDb = await ensureFirebaseReady();
        if (!liveDb) return;
        try {
          const docSnap = await liveDb.collection("destinations").doc(id).get();
          if (!docSnap.exists) return;
          const remoteData = normalizeDestinationShape(id, docSnap.data());
          DestinationApp.render(id, remoteData, lang);
        } catch (error) {}
      }, 2000);
    }
  };

  window.UIManager = UIManager;
  window.LangManager = LangManager;
  window.App = {
    share: function () {
      if (navigator.share) {
        navigator.share({ title: document.title, url: window.location.href }).catch(function () {});
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).catch(function () {});
      }
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    LangManager.sync();
    DestinationApp.init();
  });
})();
