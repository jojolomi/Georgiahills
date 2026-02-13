/**
 * Georgia Hills - Unified Application Logic
 */

// ==========================================
// 1. SERVICE WORKER REGISTRATION (PWA)
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {})
      .catch(err => {});
  });
}

// ==========================================
// 2. CONFIGURATION & DATA
// ==========================================

// --- FIREBASE CONFIGURATION ---
// IMPORTANT: Replace these placeholders with your actual Firebase Config from the Console
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

let db, auth;
if (typeof firebase !== 'undefined') {
    try {
        if (firebaseConfig.apiKey === "YOUR_API_KEY") throw new Error("Firebase Config Missing");
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        if(firebase.auth) auth = firebase.auth();
    } catch (e) {
        console.log("ℹ️ Running in Static Mode (Firebase keys not set).");
        db = null;
        auth = null;
    }
}

const AppConfig = {
    vehicleRates: { 'Sedan': 150, 'Minivan': 250 },
    currencies: [
        { code: 'GEL', flag: 'ge' }, { code: 'USD', flag: 'us' }, { code: 'EUR', flag: 'eu' },
        { code: 'AED', flag: 'ae' }, { code: 'SAR', flag: 'sa' }, { code: 'KWD', flag: 'kw' },
        { code: 'QAR', flag: 'qa' }, { code: 'OMR', flag: 'om' }
    ],
    defaultRates: { GEL: 1, USD: 0.37, EUR: 0.34, AED: 1.35, SAR: 1.38, KWD: 0.11, QAR: 1.34, OMR: 0.14 }
};

const Translations = {
    en: {
        nav_home: "Home", nav_tours: "Destinations", nav_packages: "Packages", nav_guide: "Guide", nav_fleet: "Fleet", nav_reviews: "Reviews", nav_book: "Book Now",
        label_gallery: "Photo Gallery", label_highlights: "Top Sights", label_next: "Explore Next", btn_view: "View Details", label_map: "View on Google Maps",
        cta_title: "Plan Your Trip", cta_subtitle: "Personal Driver & Car",
        trust_1: "Free Cancellation", trust_2: "Pay on Arrival", trust_3: "English/Arabic Driver",
        footer_desc: "Premium transport solutions in Georgia. Safety, comfort, and local expertise.",
        footer_links: "Quick Links", footer_contact: "Contact Us", footer_privacy: "Privacy Policy"
    },
    ar: {
        nav_home: "الرئيسية", nav_tours: "وجهات", nav_packages: "باقات", nav_guide: "دليل السفر", nav_fleet: "السيارات", nav_reviews: "الآراء", nav_book: "احجز الآن",
        label_gallery: "معرض الصور", label_highlights: "أبرز المعالم", label_next: "وجهتك القادمة", btn_view: "شاهد التفاصيل", label_map: "الموقع على الخريطة",
        cta_title: "خطط لرحلتك", cta_subtitle: "سيارة مع سائق خاص",
        trust_1: "إلغاء مجاني", trust_2: "الدفع عند الوصول", trust_3: "سائقين يتحدثون العربية",
        footer_desc: "حلول نقل فاخرة في جورجيا. أمان وراحة وخبرة محلية.",
        footer_links: "روابط سريعة", footer_contact: "اتصل بنا", footer_privacy: "سياسة الخصوصية"
    }
};

// ==========================================
// START CONFIGURATION (EDIT VIA ADMIN.HTML)
// ==========================================
const DestData = {
    'tbilisi': {
        img: 'Tbilisi.webp',
        gallery: [
            'https://images.unsplash.com/photo-1539656206689-d4198db85834?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1582236357876-0f836526154b?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1569947936662-81438903c734?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80'
        ],
        highlights_en: ["Old Town & Sulphur Baths", "Narikala Fortress", "Peace Bridge", "Rustaveli Avenue"],
        highlights_ar: ["المدينة القديمة وحمامات الكبريت", "قلعة ناريكالا", "جسر السلام", "شارع روستافيلي"],
        title_en: "Tbilisi: The Heart of Georgia",
        title_ar: "السياحة في تبليسي: أهم المعالم والأماكن",
        desc_en: "Tbilisi, the capital of Georgia, is a city where old meets new in a spectacular fashion. Founded in the 5th century, its diverse history is reflected in its architecture, which is a mix of medieval, neoclassical, Beaux Arts, Art Nouveau, Stalinist and Modern structures.\n\nWander through the narrow streets of the Old Town, relax in the famous sulfur baths (Abanotubani), and enjoy the stunning panoramic views from Narikala Fortress. Whether you're looking for history, modern nightlife, or culinary adventures, Tbilisi has it all.",
        desc_ar: "تبليسي، عاصمة جورجيا، هي مدينة يلتقي فيها التاريخ بالحداثة في مشهد مذهل. تأسست في القرن الخامس، وتتميز بتاريخها المتنوع الذي ينعكس في عمارتها الفريدة.\n\nتجوّل في الأزقة الضيقة للمدينة القديمة، واسترخِ في حمامات الكبريت الشهيرة (أبانوتوباني)، واستمتع بإطلالات بانورامية خلابة من قلعة ناريكالا. سواء كنت تبحث عن التاريخ، الحياة العصرية، أو تجربة المطبخ الجورجي الأصيل، فإن تبليسي هي وجهتك المثالية."
    },
    'kazbegi': {
        img: 'Kazbegi.webp',
        gallery: [
            'https://images.unsplash.com/photo-1549466540-349079f2913e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1560965377-63a236087b32?auto=format&fit=crop&w=800&q=80'
        ],
        highlights_en: ["Gergeti Trinity Church", "Mount Kazbek View", "Gveleti Waterfall", "Dariali Gorge"],
        highlights_ar: ["كنيسة الثالوث جيرجيتي", "إطلالة جبل كازبيك", "شلال جفيليتي", "مضيق داريالي"],
        title_en: "Kazbegi: Peaks Above the Clouds",
        title_ar: "رحلة كازبيجي: جبال القوقاز والطبيعة",
        desc_en: "Step into a postcard at Kazbegi (Stepantsminda). This region is home to the breathtaking Mount Kazbek and the iconic Gergeti Trinity Church, sitting high at 2,170 meters under the glacier.\n\nThe drive along the Georgian Military Highway is an adventure in itself, passing the Ananuri Fortress and the Russia-Georgia Friendship Monument. It is a perfect destination for nature lovers, hikers, and anyone seeking fresh mountain air.",
        desc_ar: "استمتع بمشهد خيالي في كازبيجي (ستيبانتسميندا). هذه المنطقة هي موطن جبل كازبيك الشاهق وكنيسة الثالوث جيرجيتي الشهيرة التي تتربع على ارتفاع 2170 متراً تحت النهر الجليدي.\n\nالطريق عبر الطريق العسكري الجورجي هو مغامرة بحد ذاته، مروراً بقلعة أنانوري ونصب الصداقة. إنها الوجهة المثالية لعشاق الطبيعة والمشي لمسافات طويلة وكل من يبحث عن هواء الجبل النقي."
    },
    'martvili': {
        img: 'Martvili.webp',
        gallery: [
            'https://images.unsplash.com/photo-1570701123490-67c858561d2d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80'
        ],
        highlights_en: ["Boat Ride in Canyon", "Walking Trails", "Dadiani Palace", "Waterfalls"],
        highlights_ar: ["جولة بالقارب في الوادي", "مسارات المشي", "قصر دادياني", "الشلالات"],
        title_en: "Martvili Canyon: Emerald Waters",
        title_ar: "وادي مارتفيلي: جولة القوارب والشلالات",
        desc_en: "Discover the hidden gem of Western Georgia. Martvili Canyon offers a surreal experience with its emerald green waters, waterfalls, and white limestone cliffs.\n\nThe highlight of any trip here is a boat ride through the stunning gorges. Historically, this was a bathing place for the Dadiani noble family. Today, it stands as one of the most photogenic spots in the country.",
        desc_ar: "اكتشف الجوهرة المخفية في غرب جورجيا. يقدم وادي مارتفيلي تجربة خيالية بمياهه الخضراء الزمردية، والشلالات، والمنحدرات الصخرية البيضاء.\n\nأبرز ما في الرحلة هنا هو ركوب القارب عبر المضائق المذهلة. تاريخياً، كان هذا المكان مسبحاً لعائلة دادياني النبيلة. اليوم، يعد واحداً من أجمل المواقع للتصوير في البلاد."
    },
    'signagi': {
        img: 'Signagi.webp',
        gallery: [
            'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1534065662709-b6814b73b578?auto=format&fit=crop&w=800&q=80'
        ],
        highlights_en: ["City Walls Walk", "Bodbe Monastery", "Wine Tasting", "Alazani Valley View"],
        highlights_ar: ["المشي على أسوار المدينة", "دير بودبي", "تذوق النبيذ", "إطلالة وادي ألازاني"],
        title_en: "Signagi: The City of Love",
        title_ar: "سغناغي: مدينة الحب ومزارع العنب",
        desc_en: "Perched on a hilltop overlooking the vast Alazani Valley and the Caucasus Mountains, Signagi is one of Georgia's most charming towns. Known as the 'City of Love', it is famous for its 24/7 wedding house and romantic atmosphere.\n\nWander through cobblestone streets, admire the 18th-century architecture, and explore the ancient city walls. As the heart of the Kakheti wine region, it is also the best place to taste traditional Georgian wine.",
        desc_ar: "تتربع سغناغي على قمة تل يطل على وادي ألازاني الشاسع وجبال القوقاز، وهي واحدة من أكثر المدن سحراً في جورجيا. تُعرف بـ 'مدينة الحب'، وتشتهر بأجوائها الرومانسية ومكتب الزواج الذي يعمل على مدار الساعة.\n\nتجول في الشوارع المرصوفة بالحصى، وتأمل العمارة من القرن الثامن عشر، واستكشف أسوار المدينة القديمة. وباعتبارها قلب منطقة كاخيتي للنبيذ، فهي أفضل مكان لتذوق النبيذ الجورجي التقليدي."
    },
    'batumi': {
        img: 'Batumi.webp',
        gallery: [
            'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1539656206689-d4198db85834?auto=format&fit=crop&w=800&q=80'
        ],
        highlights_en: ["Ali & Nino Statue", "Batumi Boulevard", "Botanical Garden", "Alphabetic Tower"],
        highlights_ar: ["تمثال علي ونينو", "بوليفارد باتومي", "الحديقة النباتية", "برج الحروف"],
        title_en: "Batumi: Pearl of the Black Sea",
        title_ar: "باتومي: لؤلؤة البحر الأسود",
        desc_en: "Batumi is a vibrant seaside city on the Black Sea coast and capital of Adjara. It's known for its modern architecture, botanical garden, and pebbly beaches.",
        desc_ar: "باتومي هي مدينة ساحلية نابضة بالحياة على ساحل البحر الأسود وعاصمة أدجارا. تشتهر بعمارتها الحديثة وحديقتها النباتية وشواطئها الحصوية."
    }
};
// ==========================================
// END CONFIGURATION
// ==========================================

const DestKeys = Object.keys(DestData);


// ==========================================
// 3. SHARED MANAGERS
// ==========================================

// --- Currency Manager ---
const CurrencyManager = {
    current: 'GEL',
    rates: { ...AppConfig.defaultRates },

    init() {
        try {
            const saved = localStorage.getItem('userCurrency');
            if (saved && AppConfig.currencies.find(c => c.code === saved)) {
                this.current = saved;
            }
        } catch (e) {}
        this.updateUI();
        this.fetchRates();
    },

    set(code) {
        this.current = code;
        try { localStorage.setItem('userCurrency', code); } catch (e) {}
        this.updateUI();
        this.updatePrices();
    },

    async fetchRates() {
        try {
            const CACHE_KEY = 'currency_rates_data';
            const CACHE_TTL = 3600000 * 24; 
            const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
            const now = Date.now();

            if (cached && (now - cached.timestamp < CACHE_TTL)) {
                this.rates = cached.rates;
                this.updatePrices();
                return;
            }

            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/GEL`);
            if (response.ok) {
                const data = await response.json();
                this.rates = data.rates;
                localStorage.setItem(CACHE_KEY, JSON.stringify({ rates: data.rates, timestamp: now }));
                this.updatePrices();
            }
        } catch (e) { console.warn("Using offline rates"); }
    },

    convert(amountGEL) {
        if (this.current === 'GEL') return amountGEL;
        const rate = this.rates[this.current] || 1;
        const converted = amountGEL * rate;
        return Math.ceil(converted / 5) * 5;
    },

    updateUI() {
        const flagUrl = `https://flagcdn.com/w40/${AppConfig.currencies.find(c => c.code === this.current).flag}.png`;
        ['desktop', 'mobile'].forEach(type => {
            const codeEl = document.getElementById(`curr-code-${type}`);
            const flagEl = document.getElementById(`curr-flag-${type}`);
            if (codeEl) codeEl.innerText = this.current;
            if (flagEl) flagEl.src = flagUrl;
        });
    },

    updatePrices() {
        document.querySelectorAll('.price-display').forEach(el => {
            const base = parseFloat(el.dataset.basePrice);
            if (base) {
                el.innerText = `${this.convert(base)} ${this.current}`;
            }
        });
        if(typeof BookingManager !== 'undefined' && BookingManager.updateEstimate) {
            BookingManager.updateEstimate();
        }
    }
};

// --- UI Manager ---
const UIManager = {
    init() {
        this.setupMobileMenu();
        this.setupScrollListener();
        CurrencyManager.init();
        this.initDropdowns();
        this.updateCopyright();
        this.updateActiveNavLink();
    },

    initDropdowns() {
         ['desktop', 'mobile'].forEach(type => {
            const container = document.getElementById(`curr-options-${type}`);
            if(!container) return;
            container.innerHTML = '';
            AppConfig.currencies.forEach(curr => {
                const opt = document.createElement('div');
                opt.className = 'custom-option';
                opt.innerHTML = `<img src="https://flagcdn.com/w40/${curr.flag}.png" class="currency-flag-sm" alt="${curr.code}"> ${curr.code}`;
                opt.onclick = () => {
                    CurrencyManager.set(curr.code);
                    document.querySelectorAll('.custom-select-wrapper').forEach(el => el.classList.remove('open'));
                };
                container.appendChild(opt);
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-select-wrapper')) {
                document.querySelectorAll('.custom-select-wrapper').forEach(el => el.classList.remove('open'));
            }
        });
    },

    toggleCurrencyDropdown(type) {
        const el = document.getElementById(`currency-${type}`);
        if(el) el.classList.toggle('open');
    },

    setupMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const closeBtn = document.getElementById('close-menu-btn');
        const menu = document.getElementById('mobile-menu');
        const links = document.querySelectorAll('.mobile-link, .mobile-btn-book');

        const toggle = () => {
            if(!menu) return;
            const isOpen = menu.classList.toggle('open');
            if(menuBtn) menuBtn.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('overflow-hidden', isOpen);
        };

        if(menuBtn) menuBtn.addEventListener('click', toggle);
        if(closeBtn) closeBtn.addEventListener('click', toggle);
        links.forEach(l => l.addEventListener('click', toggle));
    },

    setupScrollListener() {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            const nav = document.getElementById('navbar');
            const sticky = document.querySelector('.sticky-bar');
            const backBtn = document.getElementById('backToTop');
            
            if (nav) {
                nav.classList.toggle('shadow-md', currentScroll > 20);
                nav.classList.toggle('scrolled', currentScroll > 20);
            }
            if (backBtn) backBtn.classList.toggle('show', currentScroll > 500);

            if (sticky) {
                 if (currentScroll > lastScroll && currentScroll > 100) {
                     sticky.classList.add('hide-bar');
                     if(nav && window.innerWidth < 1024) nav.classList.add('nav-hidden');
                 } else {
                     sticky.classList.remove('hide-bar');
                     if(nav) nav.classList.remove('nav-hidden');
                 }
            }
            lastScroll = currentScroll;
            
            const hero = document.getElementById('hero-img');
            if(hero && document.querySelector('.dest-hero')) {
                hero.style.transform = `translateY(${window.scrollY * 0.4}px)`;
            }
            
            this.updateActiveNavLink();
        }, { passive: true });
    },

    updateActiveNavLink() {
        if (!document.querySelector('section[id]')) return;

        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const id = section.getAttribute('id');
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                if (link) link.classList.add('active');
            }
        });
    },

    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.remove('hidden');
    },

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('hidden');
    },
    
    showToast(msg) {
         const toast = document.getElementById('network-toast');
        if (toast) {
            toast.innerHTML = `<i class="fa-solid fa-check"></i> <span>${msg}</span>`;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    },

    updateCopyright() {
        const yearEl = document.getElementById('year');
        if (yearEl) yearEl.innerText = new Date().getFullYear();
    }
};


// --- Booking Manager ---
const BookingManager = {
    fpInstance: null,

    init() {
        const form = document.getElementById('bookingForm');
        if(!form) return;

        if (typeof flatpickr !== 'undefined') {
            this.fpInstance = flatpickr("#dateRange", {
                mode: "range",
                minDate: "today",
                dateFormat: "Y-m-d",
                disableMobile: "true",
                onChange: (selectedDates) => {
                    if (selectedDates.length === 2) {
                        this.updateEstimate();
                    }
                }
            });
        }

        this.loadDraft();
        form.addEventListener('input', () => this.saveDraft());
    },

    saveDraft() {
        const nameEl = document.getElementById('name');
        if(!nameEl) return;
        
        const data = {
            name: nameEl.value,
            phone: document.getElementById('phone').value,
            passengers: document.getElementById('passengers').value,
            vehicle: document.getElementById('vehicle').value,
            notes: document.getElementById('notes').value
        };
        try { sessionStorage.setItem('booking_draft', JSON.stringify(data)); } catch(e){}
    },

    loadDraft() {
        try {
            const data = JSON.parse(sessionStorage.getItem('booking_draft'));
            if(data) {
                const nameEl = document.getElementById('name');
                if(!nameEl) return;
                
                nameEl.value = data.name || '';
                document.getElementById('phone').value = data.phone || '';
                document.getElementById('passengers').value = data.passengers || '';
                document.getElementById('vehicle').value = data.vehicle || 'Sedan';
                document.getElementById('notes').value = data.notes || '';
            }
        } catch(e){}
    },

    updateEstimate() {
        if (!this.fpInstance) return;

        const dates = this.fpInstance.selectedDates;
        const vehEl = document.getElementById('vehicle');
        if(!vehEl) return;
        
        const veh = vehEl.value;
        const display = document.getElementById('price-estimate');
        const priceEl = document.getElementById('total-price-display');
        const durationEl = document.getElementById('trip-duration');
        const helperEl = document.getElementById('dates-helper');
        
        const isArabic = document.documentElement.lang === 'ar';
        const dayLabel = isArabic ? "أيام" : "Days";
        const nightLabel = isArabic ? "ليالي" : "Nights";
        
        if (dates && dates.length === 2 && veh) {
            const d1 = dates[0];
            const d2 = dates[1];
            const days = Math.max(1, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)));
            
            const nights = Math.max(0, days - 1);
            const durationText = `${days} ${dayLabel} / ${nights} ${nightLabel}`;
            
            if(durationEl) durationEl.innerText = durationText;
            
            if(helperEl) {
                helperEl.innerText = `(${days} ${dayLabel})`;
                helperEl.classList.remove('hidden');
            }

            const baseTotal = days * AppConfig.vehicleRates[veh];
            const final = CurrencyManager.convert(baseTotal);
            priceEl.innerText = `${final} ${CurrencyManager.current}`;
            display.classList.remove('hidden');
        } else {
            display.classList.add('hidden');
            if(helperEl) helperEl.classList.add('hidden');
        }
    },

    handleSubmit(e) {
        e.preventDefault();
        if (!this.validate()) return;
        
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        document.getElementById('btnSpinner').classList.remove('hidden');
        document.getElementById('btnText').classList.add('opacity-0');

        const dates = this.fpInstance.selectedDates;
        const dString = dates.length === 2 
            ? `${this.fpInstance.formatDate(dates[0], "Y-m-d")} to ${this.fpInstance.formatDate(dates[1], "Y-m-d")}` 
            : "No dates selected";
        
        const priceText = document.getElementById('total-price-display').innerText;
        const durationText = document.getElementById('trip-duration').innerText;
        const serviceEl = document.querySelector('input[name="driver"]:checked').nextElementSibling;
        const serviceText = serviceEl ? serviceEl.innerText.trim() : "";

        const data = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            passengers: document.getElementById('passengers').value,
            vehicle: document.getElementById('vehicle').value,
            service: serviceText,
            dates: dString,
            duration: durationText,
            price: priceText,
            notes: document.getElementById('notes').value
        };

        const isArabic = document.documentElement.lang === 'ar';
        const header = isArabic ? "السلام عليكم، أريد الاستفسار عن" : "New Booking Request";

        const text = `${header}:\n👤 ${data.name}\n📱 ${data.phone}\n🚗 ${data.vehicle} (${data.passengers} pax)\n📅 ${data.dates} (${data.duration})\n💰 Estimate: ${data.price}\n📝 ${data.notes}`;
        const waUrl = `https://wa.me/995579088537?text=${encodeURIComponent(text)}`;
        document.getElementById('whatsappLink').href = waUrl;

        if(typeof emailjs !== 'undefined') {
            emailjs.send('service_booking', 'template_40h23xf', { ...data, message: text })
                   .finally(() => this.finishSubmit());
        } else {
            setTimeout(() => this.finishSubmit(), 1000);
        }
    },

    validate() {
        let valid = true;
        const reqIds = ['name', 'phone', 'passengers'];
        
        reqIds.forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                el.classList.remove('input-error');
                if (!el.value.trim()) {
                    el.classList.add('input-error');
                    valid = false;
                }
            }
        });
        
        const dateInput = document.getElementById('dateRange');
        if(dateInput && this.fpInstance) {
            dateInput.classList.remove('input-error');
            if (this.fpInstance.selectedDates.length !== 2) {
                 dateInput.classList.add('input-error');
                 const err = document.getElementById('dateError');
                 if(err) err.classList.remove('hidden');
                 valid = false;
            } else {
                const err = document.getElementById('dateError');
                if(err) err.classList.add('hidden');
            }
        }
        
        const phone = document.getElementById('phone');
        if (phone && !/^\+?[\d\s-]{5,}$/.test(phone.value)) {
            phone.classList.add('input-error');
            valid = false;
        }

        if(!valid && navigator.vibrate) navigator.vibrate([50, 50, 50]);
        return valid;
    },

    finishSubmit() {
        const btn = document.getElementById('submitBtn');
        btn.disabled = false;
        document.getElementById('btnSpinner').classList.add('hidden');
        document.getElementById('btnText').classList.remove('opacity-0');
        UIManager.openModal('successModal');
        try { sessionStorage.removeItem('booking_draft'); } catch(e){}
    }
};

// --- Library Loader (Performance Optimization) ---
const LibraryLoader = {
    loaded: {},
    load(url, type = 'script') {
        if (this.loaded[url]) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const el = type === 'css' ? document.createElement('link') : document.createElement('script');
            if (type === 'css') { el.rel = 'stylesheet'; el.href = url; }
            else { el.src = url; el.defer = true; }
            
            el.onload = () => { this.loaded[url] = true; resolve(); };
            el.onerror = reject;
            document.head.appendChild(el);
        });
    }
};

// --- Language Manager (For Destination Page) ---
const LangManager = {
    // UPDATED: Check URL param first, default to localStorage
    get current() {
        const path = window.location.pathname;
        
        // 1. Static Pages: File name is the source of truth
        if (path.endsWith('arabic.html') || /-ar\.html$/.test(path)) return 'ar';
        if (path.includes('admin.html')) return 'en'; // Admin is always English
        if (path.includes('index.html') || path === '/' || path.endsWith('/')) return 'en';
        
        // 2. Dynamic Pages (destination.html): Check URL param, then storage
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('lang') || localStorage.getItem('userLang') || 'en';
    },
    
    sync() {
        const current = this.current;
        if (current) {
            localStorage.setItem('userLang', current);
        }
    },
    
    toggle() {
        const current = this.current;
        const isDestPage = window.location.pathname.indexOf('destination.html') !== -1;

        if (isDestPage) {
            // For dynamic destination page, reload with new param
            const newLang = current === 'en' ? 'ar' : 'en';
            localStorage.setItem('userLang', newLang);
            const url = new URL(window.location);
            url.searchParams.set('lang', newLang);
            window.location.href = url.toString();
        } else {
            // For static pages, redirect to the correct file
            const path = window.location.pathname;
            const filename = path.substring(path.lastIndexOf('/') + 1);

            if (current === 'ar') {
                localStorage.setItem('userLang', 'en');
                if (filename === 'arabic.html') window.location.href = 'index.html';
                else if (filename.endsWith('-ar.html')) window.location.href = filename.replace('-ar.html', '.html');
                else window.location.href = 'index.html';
            } else {
                localStorage.setItem('userLang', 'ar');
                if (filename === 'index.html' || filename === '') window.location.href = 'arabic.html';
                else if (filename.endsWith('.html') && !filename.endsWith('-ar.html')) window.location.href = filename.replace('.html', '-ar.html');
                else if (filename.endsWith('-ar.html')) window.location.href = filename; // Already on AR
            }
        }
    },
    
    apply() {
        const lang = this.current;
        const isAr = lang === 'ar';
        document.documentElement.lang = lang;
        document.documentElement.dir = isAr ? 'rtl' : 'ltr';
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if(Translations[lang][key]) el.innerText = Translations[lang][key];
        });
        
        document.querySelectorAll('.lang-text').forEach(el => {
            el.innerText = isAr ? 'English' : 'العربية';
        });
    }
};


// ==========================================
// 4. PAGE SPECIFIC CONTROLLERS
// ==========================================

// --- Main Page Controller (index.html & arabic.html) ---
const MainApp = {
    start() {
        UIManager.init();
        
        // OPTIMIZATION: Lazy Load Booking Libraries (Flatpickr & EmailJS)
        // Only load them when user scrolls near the booking section
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    // UX IMPROVEMENT: Show loading state on date input
                    const dateInput = document.getElementById('dateRange');
                    if(dateInput) {
                        dateInput.setAttribute('placeholder', 'Loading calendar...');
                        dateInput.disabled = true;
                    }

                    Promise.all([
                        LibraryLoader.load('https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css', 'css'),
                        LibraryLoader.load('https://cdn.jsdelivr.net/npm/flatpickr'),
                        LibraryLoader.load('https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js')
                    ]).then(() => {
                        BookingManager.init();
                        // Restore date input
                        if(dateInput) {
                            dateInput.setAttribute('placeholder', 'Select Pick-up & Drop-off Dates');
                            dateInput.disabled = false;
                        }
                        if(typeof emailjs !== 'undefined') emailjs.init("gFHD0l5sBGRvS44V8");
                    });
                    observer.disconnect();
                }
            }, { rootMargin: '300px' }); // Start loading 300px before section is visible
            observer.observe(bookingSection);
        }
        
        this.initSlider();
        this.initAnimations(); 
        
        const preloader = document.getElementById('preloader');
        if(preloader) {
            // OPTIMIZATION: Remove artificial 800ms delay for better LCP score
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 500); // Wait for CSS transition only
        }

        // PROFESSIONALISM FIX: Handle empty links
        document.querySelectorAll('a[href="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const isAr = document.documentElement.lang === 'ar';
                const msg = isAr ? 'هذه الميزة قادمة قريباً!' : 'This feature is coming soon!';
                UIManager.showToast(msg);
            });
        });
    },
    
    initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('waiting');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.reveal').forEach(el => {
            el.classList.add('waiting');
            observer.observe(el);
        });
    },

    share() {
        if (navigator.share) {
            navigator.share({ title: 'Georgia Hills', url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            UIManager.showToast(document.documentElement.lang === 'ar' ? 'تم نسخ الرابط!' : 'Link Copied!');
        }
    },
    
    acceptCookies() {
        try { localStorage.setItem('cookieConsent', 'true'); } catch(e){}
        if(typeof gtag === 'function') {
            gtag('consent', 'update', { 'ad_storage': 'granted', 'ad_user_data': 'granted', 'ad_personalization': 'granted', 'analytics_storage': 'granted' });
        }
        document.getElementById('cookie-banner').classList.remove('active');
    },
    
    declineCookies() {
        try { localStorage.setItem('cookieConsent', 'false'); } catch(e){}
        if(typeof gtag === 'function') {
            gtag('consent', 'update', { 'ad_storage': 'denied', 'ad_user_data': 'denied', 'ad_personalization': 'denied', 'analytics_storage': 'denied' });
        }
        document.getElementById('cookie-banner').classList.remove('active');
    },
    
    checkCookies() {
        const consent = localStorage.getItem('cookieConsent');
        const banner = document.getElementById('cookie-banner');
        if (!consent && banner) {
            banner.classList.add('active');
        } else if (consent === 'true' && typeof gtag === 'function') {
            gtag('consent', 'update', { 'ad_storage': 'granted', 'ad_user_data': 'granted', 'ad_personalization': 'granted', 'analytics_storage': 'granted' });
        }
    },

    initSlider() {
         const slider = document.getElementById('tours-slider');
         if(!slider) return;

         const prevBtns = [document.getElementById('prevBtnDesk'), document.getElementById('prevBtnMob')];
         const nextBtns = [document.getElementById('nextBtnDesk'), document.getElementById('nextBtnMob')];

         let autoScrollInterval;
         const intervalTime = 3500;
         let isPaused = false;
         
         const originalCards = Array.from(slider.children);
         if(originalCards.length === 0) return;

         originalCards.forEach(card => {
             const clone = card.cloneNode(true);
             clone.setAttribute('aria-hidden', 'true');
             const originalOnClick = card.getAttribute('onclick');
             if (originalOnClick) clone.setAttribute('onclick', originalOnClick);
             slider.appendChild(clone);
         });
         
         originalCards.slice().reverse().forEach(card => {
             const clone = card.cloneNode(true);
             clone.setAttribute('aria-hidden', 'true');
             const originalOnClick = card.getAttribute('onclick');
             if (originalOnClick) clone.setAttribute('onclick', originalOnClick);
             slider.insertBefore(clone, slider.firstChild);
         });

         const getMetrics = () => {
             const style = window.getComputedStyle(slider);
             const gap = parseFloat(style.gap) || 0;
             const itemWidth = originalCards[0].offsetWidth + gap;
             const totalWidth = itemWidth * originalCards.length;
             return { itemWidth, totalWidth };
         };

         const jumpToStart = () => {
             const { totalWidth } = getMetrics();
             slider.scrollLeft = totalWidth; 
         };
         
         setTimeout(() => {
             slider.style.scrollBehavior = 'auto';
             jumpToStart();
             slider.style.scrollBehavior = 'smooth';
         }, 100);

         const moveSlider = (direction) => {
            const { itemWidth } = getMetrics();
            let scrollAmount = direction * itemWidth;
            slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
         };

         const checkScroll = () => {
            const { totalWidth } = getMetrics();
            const tolerance = 10;
            
            if (slider.scrollLeft >= (totalWidth * 2) - tolerance) {
                slider.style.scrollBehavior = 'auto';
                slider.scrollLeft = totalWidth;
                slider.style.scrollBehavior = 'smooth';
            }
            else if (slider.scrollLeft <= tolerance) {
                slider.style.scrollBehavior = 'auto';
                slider.scrollLeft = totalWidth;
                slider.style.scrollBehavior = 'smooth';
            }
         };

         slider.addEventListener('scroll', checkScroll);

         const startAuto = () => {
             clearInterval(autoScrollInterval);
             autoScrollInterval = setInterval(() => {
                 if(!isPaused) moveSlider(1);
             }, intervalTime);
         };
         
         const resetAuto = () => {
             clearInterval(autoScrollInterval);
             startAuto();
         };
         
         nextBtns.forEach(btn => btn?.addEventListener('click', () => { moveSlider(1); resetAuto(); }));
         prevBtns.forEach(btn => btn?.addEventListener('click', () => { moveSlider(-1); resetAuto(); }));
         
         slider.addEventListener('mouseenter', () => isPaused = true);
         slider.addEventListener('touchstart', () => isPaused = true);
         slider.addEventListener('mouseleave', () => isPaused = false);
         slider.addEventListener('touchend', () => isPaused = false);
         
         window.addEventListener('resize', () => {
            slider.style.scrollBehavior = 'auto';
            jumpToStart();
            setTimeout(() => { slider.style.scrollBehavior = 'smooth'; }, 50);
         });
         
         startAuto();
    },
    
    prefillVehicle(type) {
        const sel = document.getElementById('vehicle');
        if(sel) {
            sel.value = type;
            BookingManager.updateEstimate();
            const bookingSec = document.getElementById('booking');
            if(bookingSec) bookingSec.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

// --- Destination Page Controller (destination.html) ---
const DestinationApp = {
    async init() {
        LangManager.apply();
        UIManager.init();

        const params = new URLSearchParams(window.location.search);
        const id = params.get('id') || 'tbilisi';
        
        let data = DestData[id]; // Fallback to local data

        // FETCH FROM FIREBASE
        if (db) {
            try {
                const docSnap = await db.collection('destinations').doc(id).get();
                if (docSnap.exists) {
                    data = docSnap.data();
                }
            } catch(e) { console.log("Using offline data"); }
        }

        const lang = LangManager.current;

        // 0. Fix Navigation Links for Arabic
        if (lang === 'ar') {
            document.querySelectorAll('a[href^="index.html"]').forEach(link => {
                link.href = link.href.replace('index.html', 'arabic.html');
            });
        }

        if(data) {
            const title = data[`title_${lang}`];
            document.title = title + " - Georgia Hills";
            
            // 1. Dynamic Meta Description & Open Graph
            const desc = data[`desc_${lang}`];
            const metaDesc = document.querySelector('meta[name="description"]');
            if(metaDesc) metaDesc.content = desc.substring(0, 160) + "...";

            const setMeta = (prop, val) => {
                let el = document.querySelector(`meta[property="${prop}"]`);
                if(!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
                el.content = val;
            };
            setMeta('og:title', title);
            setMeta('og:description', desc.substring(0, 200));
            setMeta('og:image', data.img.startsWith('http') ? data.img : `https://georgiahills.netlify.app/${data.img}`);

            // 2. Clean Canonical URL (Remove tracking params)
            const canonicalLink = document.querySelector('link[rel="canonical"]');
            if(canonicalLink) {
                const url = new URL(window.location.origin + window.location.pathname);
                url.searchParams.set('id', id);
                if(lang !== 'en') url.searchParams.set('lang', lang);
                canonicalLink.href = url.toString();
            }

            // 2. Dynamic Schema.org Injection (NEW OPTIMIZATION)
            const scriptJSON = document.getElementById('json-ld-data');
            if(scriptJSON) {
                const schema = {
                    "@context": "https://schema.org",
                    "@type": "TouristAttraction",
                    "name": title,
                    "description": data[`desc_${lang}`],
                    "image": data.img.startsWith('http') ? data.img : `https://georgiahills.netlify.app/${data.img}`,
                    "url": window.location.href,
                    "address": {
                        "@type": "PostalAddress",
                        "addressCountry": "GE"
                    }
                };
                scriptJSON.textContent = JSON.stringify(schema);
            }

            // Image Error Handling
            const heroImg = document.getElementById('hero-img');
            if(heroImg) {
                heroImg.alt = title; // Accessibility Fix
                // FIX: Set handlers before src to catch cached loads
                heroImg.onload = function() { this.classList.remove('skeleton'); };
                heroImg.onerror = function() { this.src = 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80'; }; // Fallback
                heroImg.src = data.img;
            }
            
            const crumbTitle = document.getElementById('crumb-title');
            if(crumbTitle) {
                crumbTitle.innerText = title;
                crumbTitle.classList.remove('skeleton');
            }
            
            const pageTitle = document.getElementById('page-title');
            if(pageTitle) {
                pageTitle.innerText = title;
                pageTitle.classList.remove('skeleton');
            }
            
            const pageDesc = document.getElementById('page-desc');
            if(pageDesc) {
                pageDesc.innerText = data[`desc_${lang}`];
                pageDesc.classList.remove('skeleton');
            }
            
            const highlightsEl = document.getElementById('highlights');
            if(highlightsEl) {
                const highlightsList = data[`highlights_${lang}`];
                const highlightsHTML = highlightsList.map(h => `<li><i class="fa-solid fa-star"></i> ${h}</li>`).join('');
                highlightsEl.innerHTML = highlightsHTML;
            }

            const mapLink = document.getElementById('map-link');
            if(mapLink) {
                mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.title_en)}`;
                mapLink.rel = "noopener noreferrer";
            }

            const galleryEl = document.getElementById('gallery');
            if(galleryEl) {
                galleryEl.innerHTML = data.gallery.map(url => 
                    `<img src="${url}" class="gallery-img skeleton" loading="lazy" onload="this.classList.remove('skeleton')" onerror="this.style.display='none'">`
                ).join('');
            }

            const idx = DestKeys.indexOf(id);
            const nextId = DestKeys[(idx + 1) % DestKeys.length];
            const nextData = DestData[nextId];
            
            const nextLink = document.getElementById('next-link');
            // Update next link to preserve language choice in URL
            if(nextLink) nextLink.href = `destination.html?id=${nextId}${lang === 'ar' ? '&lang=ar' : ''}`;
            
            const nextImg = document.getElementById('next-img');
            if(nextImg) {
                nextImg.onload = function() { this.classList.remove('skeleton'); };
                nextImg.src = nextData.img;
            }
            
            const nextTitle = document.getElementById('next-title');
            if(nextTitle) nextTitle.innerText = nextData[`title_${lang}`];
        }
    }
};

// ==========================================
// 5. GLOBAL EXPORTS
// ==========================================

// Expose objects to window for inline HTML event handlers (onclick="...")
window.UIManager = UIManager;
window.CurrencyManager = CurrencyManager;
window.BookingManager = BookingManager;
window.LangManager = LangManager;

// Expose MainApp as 'App' because the main page HTML calls 'App.prefillVehicle' etc.
window.App = MainApp; 

window.addEventListener('DOMContentLoaded', () => {
    // Sync language state with current page
    LangManager.sync();

    // Ensure Cookie Banner runs on all pages (except Admin)
    if (!window.location.pathname.includes('admin.html')) {
        MainApp.checkCookies();
    }
    
    // Detect which page we are on and run the appropriate logic
    
    // Condition 1: Main Page (has 'tours-slider' or 'hero')
    if (document.getElementById('tours-slider') || document.querySelector('.hero')) {
        MainApp.start();
    } 
    // Condition 2: Dynamic Destination Page (ONLY destination.html)
    else if (window.location.pathname.includes('destination.html')) {
        DestinationApp.init();
    }
    // Condition 3: Static Pages (tbilisi.html, honeymoon.html, etc.)
    else {
        UIManager.init();
        // Ensure animations run if present
        if (document.querySelector('.reveal')) {
            MainApp.initAnimations();
        }
    }
});
