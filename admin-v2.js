
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, setDoc, getDocs, deleteDoc, updateDoc, addDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// --- Configuration ---
const firebaseConfig = window.__GH_FIREBASE_CONFIG || window.firebaseConfig;
if (!firebaseConfig) {
    console.error("Firebase Config Missing!");
    alert("System Error: Firebase Configuration not found.");
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// --- State Management ---
const State = {
    user: null,
    currentTab: 'dashboard',
    destinations: [],
    pages: {
        home: {},
        about: {},
        contact: {},
        shared: {},
        services: {} // Future use
    },
    settings: {
        navbar: [],
        contact: {},
        social: {}
    },
    loaded: false
};

const DefaultContent = {
    home: {
        hero: {
            title_en: 'Discover Georgia <br><span class="text-accent-light italic font-serif">Without Limits</span>',
            title_ar: 'اكتشف جورجيا <br><span class="text-accent-light italic font-serif">مع سائق خاص</span>',
            subtitle_en: 'Premium chauffeured services and self-drive rentals. From Tbilisi to Kazbegi, experience the journey in absolute comfort.',
            subtitle_ar: 'سائقون محترفون وأسطول فاخر. من الاستقبال في المطار إلى الرحلات الجبلية.',
            bg_image: 'image-1600.webp',
            steps_title_en: 'Your Journey in 3 Steps',
            steps_title_ar: 'رحلتك في 3 خطوات',
            step1_title_en: 'Choose Your Trip',
            step1_title_ar: 'اختر رحلتك',
            step1_desc_en: 'Select a destination or customizing your own daily itinerary.',
            step1_desc_ar: 'اختر وجهة أو صمم مسار رحلتك اليومي الخاص.',
            step2_title_en: 'Get WhatsApp Quote',
            step2_title_ar: 'احصل على عرض واتساب',
            step2_desc_en: 'Receive an instant, all-inclusive price directly on your phone.',
            step2_desc_ar: 'احصل على سعر فوري شامل كلياً مباشرة على هاتفك.',
            step3_title_en: 'Meet Your Driver',
            step3_title_ar: 'قابل سائقك',
            step3_desc_en: 'Your professional driver will pick you up from your hotel or airport.',
            step3_desc_ar: 'سائقك المحترف سيستقبلك من فندقك أو المطار.'
        },
        about: {
            title_en: 'More Than Just A Ride, <br>It\'s Your Journey.',
            title_ar: 'أكثر من مجرد رحلة، <br>إنها مغامرتك.',
             text_en: 'Navigating Georgia\'s mountain passes requires skill and local knowledge. We provide professional, English-speaking drivers who act as your personal guide.',
             text_ar: 'تتطلب القيادة في جبال جورجيا مهارة عالية. نوفر سائقين محترفين يتحدثون الإنجليزية ويعملون كمرشدين لك.',
            image: 'Tbilisi_old_Town.webp'
        }
    },
    about: {
        hero: {
            title_en: 'Your Family\'s<br><span class="text-gradient-gold">Trusted Guide.</span>',
            title_ar: 'دليلك العائلي<br><span class="text-gradient-gold">الموثوق في جورجيا.</span>',
            subtitle_en: 'We founded Georgia Hills with one goal: to bring the warmth of Georgian hospitality to private family travel. <span class="highlight-text">Safe, professional, and personal.</span>',
            subtitle_ar: 'أسسنا جورجيا هيلز بهدف واحد: تقديم ضيافة جورجية أصيلة مع معايير نقل عائلية خاصة. <span class="highlight-text">آمن، محترف، وشخصي.</span>'
        },
        story: {
            title_en: 'More than drivers.<br>We are your Georgian hosts.',
            title_ar: 'أكثر من سائقين.<br>نحن مضيفوك في جورجيا.',
            // Splitting paragraphs can be complex, simplifying to main text blocks
            intro_en: 'At Georgia Hills, we believe that the best way to see a country is through the eyes of a local friend. Founded by a team of passionate travel experts, we set out to change the standard of private transport in Georgia.',
            intro_ar: 'في جورجيا هيلز، نؤمن بأن أفضل طريقة لرؤية البلد هي من خلال عيون صديق محلي. تأسسنا بواسطة فريق من خبراء السفر الشغوفين، ونسعى لتغيير معايير النقل الخاص في جورجيا.'
        }
    },
    services: {
        hero: {
            title_en: 'Transparent Pricing.<br><span class="text-gradient-gold">Unmatched Comfort.</span>',
            title_ar: 'الأسعار شفافة.<br><span class="text-gradient-gold">راحة لا تضاهى.</span>',
            subtitle_en: 'Professional privat transport with <span class="highlight-text">no hidden fees.</span><br>Flexible packages & modern fleet designed for your family.',
            subtitle_ar: 'نقل خاص محترف بلا <span class="highlight-text">رسوم مخفية.</span><br>باقات مرنة وأسطول حديث مصمم لعائلتك.'
        },
        intro: {
            title_en: 'Everything You Need For A Perfect Trip',
            title_ar: 'كل ما تحتاجه لرحلة مثالية',
            desc_en: 'Whether you need a simple airport transfer or a full 10-day tour, we have a plan for you.',
            desc_ar: 'سواء كنت بحاجة إلى نقل بسيط من المطار أو جولة كاملة لمدة 10 أيام، لدينا خطة لك.'
        }
    },
    contact: {
        hero: {
            title_en: 'Let\'s Plan Your<br><span class="text-gradient-gold">Perfect Trip.</span>',
            title_ar: 'لنخطط لرحلتك<br><span class="text-gradient-gold">المثالية.</span>',
            subtitle_en: 'Need a custom itinerary or have a question? <span class="highlight-text">We are here to help, 24/7.</span>',
            subtitle_ar: 'هل تحتاج إلى مسار مخصص أو لديك سؤال؟ <span class="highlight-text">نحن هنا للمساعدة، 24/7.</span>'
        },
        intro: {
            title_en: 'We\'d love to hear from you',
            title_ar: 'نود أن نسمع منك',
            desc_en: 'Have a question about our fleet, pricing, or custom itineraries? Reach out to us directly.',
            desc_ar: 'هل لديك سؤال حول أسطولنا أو أسعارنا أو مساراتنا المخصصة؟ تواصل معنا مباشرة.'
        }
    },
    shared: {
        footer: {
            desc_en: 'Premium transport solutions in Georgia. Safety, comfort, and local expertise.',
            desc_ar: 'حلول نقل فاخرة في جورجيا. أمان وراحة وخبرة محلية.'
        },
        trust: {
            item1_en: 'Trusted Service', item1_ar: 'خدمة موثوقة',
            item2_en: '24/7 WhatsApp Support', item2_ar: 'دعم واتساب 24/7',
            item3_en: 'Transparent Pricing', item3_ar: 'أسعار واضحة'
        },
        booking_flow: {
            title_en: 'Professional Booking Flow', title_ar: 'الحجز بطريقة احترافية',
            step1_title_en: 'Share trip details', step1_title_ar: 'أرسل تفاصيل الرحلة',
            step1_desc_en: 'Route, dates, and passenger count.', step1_desc_ar: 'المسار والتواريخ وعدد المسافرين.',
            step2_title_en: 'Get clear quote', step2_title_ar: 'استلم عرض واضح',
            step2_desc_en: 'Transparent price and service scope.', step2_desc_ar: 'سعر وخطة خدمة بدون رسوم مخفية.',
            step3_title_en: 'Confirm quickly', step3_title_ar: 'تأكيد سريع',
            step3_desc_en: 'WhatsApp confirmation with ready schedule.', step3_desc_ar: 'تأكيد واتساب وتجهيز الجدول قبل الوصول.'
        }
    },
    settings_global: {
        phone: '+995 579 08 85 37',
        whatsapp: '995579088537',
        email: 'info@georgiahills.com',
        address: 'Tbilisi, Georgia',
        social: {
            facebook: 'https://facebook.com/georgiahills',
            instagram: 'https://instagram.com/georgiahills'
        }
    },
    settings_navbar: [
        { label_en: 'Home', label_ar: 'الرئيسية', link: 'index.html' },
        { label_en: 'Services', label_ar: 'الخدمات', link: 'services.html' },
        { label_en: 'Guide', label_ar: 'الدليل', link: 'guide.html' },
        { label_en: 'About', label_ar: 'من نحن', link: 'about.html' },
        { label_en: 'Blog', label_ar: 'المدونة', link: 'blog.html' },
        { label_en: 'Contact', label_ar: 'اتصل بنا', link: 'contact.html' }
    ]
};

// --- Schema Definitions for Page Editor ---
const PageSchemas = {
    home: [
        { section: "Hero Section", description: "The main banner at the top of the home page." },
        { type: "image", key: "hero.bg_image", label: "Background Image" },
        { type: "text", key: "hero.title_en", label: "Title (English)" },
        { type: "text", key: "hero.title_ar", label: "Title (Arabic)", dir: "rtl" },
        { type: "text", key: "hero.subtitle_en", label: "Subtitle (English)" },
        { type: "text", key: "hero.subtitle_ar", label: "Subtitle (Arabic)", dir: "rtl" },
        
        { section: "About Section", description: "Introduction text below the hero." },
        { type: "image", key: "about.image", label: "About Image" },
        { type: "text", key: "about.title_en", label: "Title (English)" },
        { type: "text", key: "about.title_ar", label: "Title (Arabic)", dir: "rtl" },
        { type: "textarea", key: "about.text_en", label: "Description (English)" },
        { type: "textarea", key: "about.text_ar", label: "Description (Arabic)", dir: "rtl" },

        { section: "How It Works", description: "The 3-step process section." },
        { type: "text", key: "hero.steps_title_en", label: "Section Title (English)" },
        { type: "text", key: "hero.steps_title_ar", label: "Section Title (Arabic)", dir: "rtl" },
        { type: "text", key: "hero.step1_title_en", label: "Step 1 Title (English)" },
        { type: "text", key: "hero.step1_title_ar", label: "Step 1 Title (Arabic)", dir: "rtl" },
        { type: "text", key: "hero.step1_desc_en", label: "Step 1 Desc (English)" },
        { type: "text", key: "hero.step1_desc_ar", label: "Step 1 Desc (Arabic)", dir: "rtl" },
        { type: "text", key: "hero.step2_title_en", label: "Step 2 Title (English)" },
        { type: "text", key: "hero.step2_title_ar", label: "Step 2 Title (Arabic)", dir: "rtl" },
        { type: "text", key: "hero.step2_desc_en", label: "Step 2 Desc (English)" },
        { type: "text", key: "hero.step2_desc_ar", label: "Step 2 Desc (Arabic)", dir: "rtl" },
        { type: "text", key: "hero.step3_title_en", label: "Step 3 Title (English)" },
        { type: "text", key: "hero.step3_title_ar", label: "Step 3 Title (Arabic)", dir: "rtl" },
        { type: "text", key: "hero.step3_desc_en", label: "Step 3 Desc (English)" },
        { type: "text", key: "hero.step3_desc_ar", label: "Step 3 Desc (Arabic)", dir: "rtl" },

        { section: "SEO Settings", description: "Search Engine Optimization meta tags." },
        { type: "text", key: "seo.meta_title", label: "Meta Title (Browser Tab)" },
        { type: "textarea", key: "seo.meta_description", label: "Meta Description (Google Snippet)" }
    ],
    about: [ 
        { section: "Hero Section", description: "Top banner of the About Us page." },
        { type: "text", key: "hero.title_en", label: "Hero Title (English)" },
        { type: "text", key: "hero.title_ar", label: "Hero Title (Arabic)", dir: "rtl" },
        { type: "textarea", key: "hero.subtitle_en", label: "Hero Subtitle (English)" },
        { type: "textarea", key: "hero.subtitle_ar", label: "Hero Subtitle (Arabic)", dir: "rtl" },

        { section: "Our Story", description: "Main narrative text." },
        { type: "text", key: "story.title_en", label: "Story Title (English)" },
        { type: "text", key: "story.title_ar", label: "Story Title (Arabic)", dir: "rtl" },
        { type: "textarea", key: "story.intro_en", label: "Intro Paragraph (English)" },
        { type: "textarea", key: "story.intro_ar", label: "Intro Paragraph (Arabic)", dir: "rtl" },

        { section: "SEO Settings", description: "Search Engine Optimization meta tags." },
        { type: "text", key: "seo.meta_title", label: "Meta Title" },
        { type: "textarea", key: "seo.meta_description", label: "Meta Description" }
    ],
    services: [
        { section: "Hero Section", description: "Top banner of Services page." },
        { type: "text", key: "hero.title_en", label: "Hero Title (English)" },
        { type: "text", key: "hero.title_ar", label: "Hero Title (Arabic)", dir: "rtl" },
        { type: "textarea", key: "hero.subtitle_en", label: "Hero Subtitle (English)" },
        { type: "textarea", key: "hero.subtitle_ar", label: "Hero Subtitle (Arabic)", dir: "rtl" },
        
        { section: "Intro", description: "Text below the hero." },
        { type: "text", key: "intro.title_en", label: "Main Title (English)" },
        { type: "text", key: "intro.title_ar", label: "Main Title (Arabic)", dir: "rtl" },
        { type: "textarea", key: "intro.desc_en", label: "Description (English)" },
        { type: "textarea", key: "intro.desc_ar", label: "Description (Arabic)", dir: "rtl" },

        { section: "SEO Settings", description: "Search Engine Optimization meta tags." },
        { type: "text", key: "seo.meta_title", label: "Meta Title" },
        { type: "textarea", key: "seo.meta_description", label: "Meta Description" }
    ],
    contact: [
        { section: "Hero Section", description: "Top banner of Contact page." },
        { type: "text", key: "hero.title_en", label: "Hero Title (English)" },
        { type: "text", key: "hero.title_ar", label: "Hero Title (Arabic)", dir: "rtl" },
        { type: "textarea", key: "hero.subtitle_en", label: "Hero Subtitle (English)" },
        { type: "textarea", key: "hero.subtitle_ar", label: "Hero Subtitle (Arabic)", dir: "rtl" },
        
        { section: "Intro", description: "Text below the hero." },
        { type: "text", key: "intro.title_en", label: "Main Title (English)" },
        { type: "text", key: "intro.title_ar", label: "Main Title (Arabic)", dir: "rtl" },
        { type: "textarea", key: "intro.desc_en", label: "Description (English)" },
        { type: "textarea", key: "intro.desc_ar", label: "Description (Arabic)", dir: "rtl" },

        { section: "SEO Settings", description: "Search Engine Optimization meta tags." },
        { type: "text", key: "seo.meta_title", label: "Meta Title" },
        { type: "textarea", key: "seo.meta_description", label: "Meta Description" }
    ],
    shared: [
        { section: "Footer", description: "Content appearing in the site footer." },
        { type: "textarea", key: "footer.desc_en", label: "Footer Description (English)" },
        { type: "textarea", key: "footer.desc_ar", label: "Footer Description (Arabic)", dir: "rtl" },

        { section: "Trust Strip", description: "Icons and text above the footer on secondary pages." },
        { type: "text", key: "trust.item1_en", label: "Item 1 (English)" },
        { type: "text", key: "trust.item1_ar", label: "Item 1 (Arabic)", dir: "rtl" },
        { type: "text", key: "trust.item2_en", label: "Item 2 (English)" },
        { type: "text", key: "trust.item2_ar", label: "Item 2 (Arabic)", dir: "rtl" },
        { type: "text", key: "trust.item3_en", label: "Item 3 (English)" },
        { type: "text", key: "trust.item3_ar", label: "Item 3 (Arabic)", dir: "rtl" },

        { section: "Booking Flow", description: "The 'Professional Booking Flow' section on secondary pages." },
        { type: "text", key: "booking_flow.title_en", label: "Section Title (English)" },
        { type: "text", key: "booking_flow.title_ar", label: "Section Title (Arabic)", dir: "rtl" },
        { type: "text", key: "booking_flow.step1_title_en", label: "Step 1 Title (English)" },
        { type: "text", key: "booking_flow.step1_title_ar", label: "Step 1 Title (Arabic)", dir: "rtl" },
        { type: "text", key: "booking_flow.step1_desc_en", label: "Step 1 Desc (English)" },
        { type: "text", key: "booking_flow.step1_desc_ar", label: "Step 1 Desc (Arabic)", dir: "rtl" },
        { type: "text", key: "booking_flow.step2_title_en", label: "Step 2 Title (English)" },
        { type: "text", key: "booking_flow.step2_title_ar", label: "Step 2 Title (Arabic)", dir: "rtl" },
        { type: "text", key: "booking_flow.step2_desc_en", label: "Step 2 Desc (English)" },
        { type: "text", key: "booking_flow.step2_desc_ar", label: "Step 2 Desc (Arabic)", dir: "rtl" },
        { type: "text", key: "booking_flow.step3_title_en", label: "Step 3 Title (English)" },
        { type: "text", key: "booking_flow.step3_title_ar", label: "Step 3 Title (Arabic)", dir: "rtl" },
        { type: "text", key: "booking_flow.step3_desc_en", label: "Step 3 Desc (English)" },
        { type: "text", key: "booking_flow.step3_desc_ar", label: "Step 3 Desc (Arabic)", dir: "rtl" }
    ]
};

// --- Data Layer ---
const Data = {
    async loadAll() {
        try {
            await Promise.all([
                this.fetchDestinations(),
                this.fetchSettings(),
                this.fetchPage('home'),
                this.fetchPage('about'),
                this.fetchPage('services'), // Added
                this.fetchPage('contact'),   // Added
                this.fetchPage('shared')    // Added
            ]);
            State.loaded = true;
        } catch (error) {
            console.error("Load Error:", error);
            UI.toast("Failed to load data. Check console.", "error");
        }
    },

    async fetchDestinations() {
        const snap = await getDocs(collection(db, "destinations"));
        console.log(`[Admin] Fetched ${snap.size} destinations`);
        State.destinations = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async fetchSettings() {
        // Fetch Navbar
        try {
            const navSnap = await getDoc(doc(db, "settings", "navbar"));
            if (navSnap.exists()) {
                State.settings.navbar = navSnap.data().items || [];
            }
        } catch (e) { console.warn("Navbar settings not found", e); }

        // Fetch Contact/Global
        try {
            const contactSnap = await getDoc(doc(db, "settings", "contact"));
            if (contactSnap.exists()) {
                const data = contactSnap.data();
                State.settings.contact = data || {};
                State.settings.social = data.social || {};
            }
        } catch (e) { console.warn("Contact settings not found", e); }
    },

    async fetchPage(pageId) {
        try {
            const docSnap = await getDoc(doc(db, "settings", `page_${pageId}`));
            if (docSnap.exists()) {
                State.pages[pageId] = docSnap.data();
            } else {
                // Use DefaultContent if available
                State.pages[pageId] = DefaultContent[pageId] ? JSON.parse(JSON.stringify(DefaultContent[pageId])) : {};
            }
        } catch (e) {
            console.warn(`Page ${pageId} settings not found`, e);
            State.pages[pageId] = DefaultContent[pageId] ? JSON.parse(JSON.stringify(DefaultContent[pageId])) : {};
        }
    },

    async saveDestination(destId, data) {
        if (!destId) {
            const newRef = doc(collection(db, "destinations"));
            destId = newRef.id;
            // data.id = destId; // Don't save ID inside doc if not needed, but typical usage
        }
        await setDoc(doc(db, "destinations", destId), { ...data, id: destId }, { merge: true });
        await this.fetchDestinations();
        this.logAction('update_destination', `Updated destination: ${data.title?.en || destId}`);
        return destId;
    },

    async deleteDestination(destId) {
        // if(!confirm("Are you sure you want to delete this destination?")) return; // Moved confirmation to UI
        await deleteDoc(doc(db, "destinations", destId));
        this.logAction('delete_destination', `Deleted destination: ${destId}`);
        await this.fetchDestinations();
    },

    async saveSettings(type, data) {
        await setDoc(doc(db, "settings", type), data, { merge: true });
        if(type === 'navbar') State.settings.navbar = data.items;
        if(type === 'contact') {
            State.settings.contact = data;
            State.settings.social = data.social;
        }
        this.logAction('update_settings', `Updated ${type} settings`);
    },

    async savePage(pageId, data) {
        await setDoc(doc(db, "settings", `page_${pageId}`), data, { merge: true });
        State.pages[pageId] = data;
        this.logAction('update_page', `Updated page: ${pageId}`);
    },

    async uploadImage(file, path) {
        const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    },

    async logAction(action, details) {
        try {
            const user = auth.currentUser ? auth.currentUser.email : 'Unknown';
            await addDoc(collection(db, "admin_logs"), {
                action,
                details,
                user,
                timestamp: Date.now()
            });
        } catch(e) { console.warn("Log failed", e); }
    },

    async fetchLogs() {
        try {
            const q = query(collection(db, "admin_logs"), orderBy("timestamp", "desc"), limit(5));
            const snap = await getDocs(q);
            return snap.docs.map(d => d.data());
        } catch(e) { return []; }
    }
};

// --- UI Layer ---
const UI = {
    showLoading() {
        const app = document.getElementById('app');
        if(app) app.innerHTML = `
            <div class="flex items-center justify-center min-h-screen bg-gray-100">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>`;
    },

    renderLogin() {
        document.getElementById('app').innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
                <div class="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div class="px-6 py-8">
                        <h2 class="text-center text-3xl font-extrabold text-white mb-2">Georgia Hills</h2>
                        <p class="text-center text-gray-400 mb-8">Admin Access Panel</p>
                        <form id="login-form" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                <input id="email" type="email" required class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <input id="password" type="password" required class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors">
                            </div>
                            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-[1.02]">
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </div>`;
            
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Signing in...";
            btn.disabled = true;
            try {
                await signInWithEmailAndPassword(auth, 
                    document.getElementById('email').value,
                    document.getElementById('password').value
                );
            } catch (err) {
                UI.toast(err.message, 'error');
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    },

    renderLayout() {
        document.getElementById('app').innerHTML = `
            <div class="flex h-screen overflow-hidden bg-gray-100">
                <!-- Sidebar -->
                <aside class="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 transition-all duration-300 hidden md:flex">
                    <div class="h-16 flex items-center px-6 border-b border-gray-100">
                        <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">GH Admin</span>
                    </div>
                    
                    <nav class="flex-1 overflow-y-auto p-4 space-y-1">
                        ${this.renderSidebarItem('dashboard', 'fa-chart-pie', 'Overview')}
                        <div class="pt-4 pb-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Content Management</div>
                        ${this.renderSidebarItem('page-home', 'fa-house', 'Home Page')}
                        ${this.renderSidebarItem('destinations', 'fa-map-location-dot', 'Destinations')}
                        ${this.renderSidebarItem('page-about', 'fa-circle-info', 'About Page')}
                        ${this.renderSidebarItem('page-services', 'fa-briefcase', 'Services Page')}
                        ${this.renderSidebarItem('page-contact', 'fa-envelope', 'Contact Page')}
                        ${this.renderSidebarItem('page-shared', 'fa-layer-group', 'Shared Content')}
                        <div class="pt-4 pb-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Configuration</div>
                        ${this.renderSidebarItem('settings-global', 'fa-globe', 'Global Settings')}
                        ${this.renderSidebarItem('settings-navbar', 'fa-bars', 'Navigation Menu')}
                    </nav>

                    <div class="p-4 border-t border-gray-100 bg-gray-50">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">A</div>
                            <div class="text-sm">
                                <p class="font-medium text-gray-900">Admin User</p>
                                <p class="text-xs text-gray-500">Super Admin</p>
                            </div>
                        </div>
                        <button onclick="window.Admin.logout()" class="w-full text-center py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">Sign Out</button>
                    </div>
                </aside>

                <!-- Main Content -->
                <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <!-- Mobile Header -->
                    <header class="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-8 z-10">
                        <button class="md:hidden text-gray-600 hover:text-gray-900" onclick="document.querySelector('aside').classList.toggle('hidden')">
                            <i class="fa-solid fa-bars text-xl"></i>
                        </button>
                        <h1 class="text-lg font-semibold text-gray-800 capitalize" id="header-title">
                            ${State.currentTab.replace('-', ' ')}
                        </h1>
                        <a href="/" target="_blank" class="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-2">
                            <span>Open Website</span> 
                            <i class="fa-solid fa-external-link-alt text-xs"></i>
                        </a>
                    </header>

                    <!-- Content Area -->
                    <main class="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50" id="main-content">
                        <!-- Dynamic Content -->
                    </main>
                </div>
            </div>
            <div id="toast-container" class="toast-container"></div>
            <div id="modal-backdrop" class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity opacity-0" onclick="window.Admin.closeModal()"></div>
            <div id="modal-panel" class="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white z-50 shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col">
                <!-- Modal Content -->
            </div>
        `;
        this.loadTab(State.currentTab);
    },

    renderSidebarItem(tab, icon, label) {
        const isActive = State.currentTab === tab;
        return `
            <button onclick="window.Admin.switchTab('${tab}')" data-tab="${tab}"
                class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}">
                <i data-icon="${icon}" class="fa-solid ${icon} w-5 text-center ${isActive ? 'text-blue-600' : 'text-gray-400'}"></i>
                ${label}
            </button>
        `;
    },

    async loadTab(tab) {
        State.currentTab = tab;
        // Re-render sidebar to update active state
        // In a real framework we'd use reactive state, here we cheat slightly or just re-render sidebar
        const sidebarBtns = document.querySelectorAll('aside nav button[data-tab]');
        sidebarBtns.forEach(btn => {
           const iconEl = btn.querySelector('i[data-icon]');
           const isActive = btn.dataset.tab === tab;
           if (isActive) {
               btn.className = "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors bg-blue-50 text-blue-700";
               if (iconEl) iconEl.className = `fa-solid ${iconEl.dataset.icon} w-5 text-center text-blue-600`;
           } else {
               btn.className = "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900";
               if (iconEl) iconEl.className = `fa-solid ${iconEl.dataset.icon} w-5 text-center text-gray-400`;
           }
        });

        const content = document.getElementById('main-content');
        const headerTitle = document.getElementById('header-title');
        if(headerTitle) headerTitle.innerText = tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        switch(tab) {
            case 'dashboard': this.renderDashboard(content); break;
            case 'destinations': this.renderDestinations(content); break;
            case 'page-home': this.renderPageEditor(content, 'home'); break;
            case 'page-about': this.renderPageEditor(content, 'about'); break;
            case 'page-services': this.renderPageEditor(content, 'services'); break;
            case 'page-contact': this.renderPageEditor(content, 'contact'); break;
            case 'page-shared': this.renderPageEditor(content, 'shared'); break;
            case 'settings-global': this.renderGlobalSettings(content); break;
            case 'settings-navbar': this.renderNavbarSettings(content); break;
            default: content.innerHTML = `<div class="text-center text-gray-500 mt-20">Page not found</div>`;
        }
    },

    async renderDashboard(container) {
        const destCount = State.destinations.length;
        const activeDestCount = State.destinations.filter(d => d.active !== false).length;
        const navCount = State.settings.navbar ? State.settings.navbar.length : 0;
        const contactConfigured = State.settings.contact && State.settings.contact.phone ? 'Configured' : 'Pending';
        
        const logs = await Data.fetchLogs();

        container.innerHTML = `
            <div class="space-y-6">
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Total Destinations -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Total Destinations</p>
                            <h3 class="text-2xl font-bold text-gray-900 mt-1">${destCount}</h3>
                            <p class="text-xs text-green-600 mt-1"><i class="fa-solid fa-check"></i> ${activeDestCount} Active</p>
                        </div>
                        <div class="p-3 bg-blue-50 rounded-lg text-blue-600"><i class="fa-solid fa-map-location-dot text-xl"></i></div>
                    </div>

                    <!-- Navbar Items -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Menu Items</p>
                            <h3 class="text-2xl font-bold text-gray-900 mt-1">${navCount}</h3>
                            <p class="text-xs text-gray-400 mt-1">Navigation Links</p>
                        </div>
                        <div class="p-3 bg-indigo-50 rounded-lg text-indigo-600"><i class="fa-solid fa-bars text-xl"></i></div>
                    </div>

                    <!-- Contact Info Status -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Contact Info</p>
                            <h3 class="text-lg font-bold text-gray-900 mt-1">${contactConfigured}</h3>
                            <p class="text-xs text-gray-400 mt-1">Global Settings</p>
                        </div>
                        <div class="p-3 bg-green-50 rounded-lg text-green-600"><i class="fa-solid fa-address-card text-xl"></i></div>
                    </div>

                    <!-- Analytics Link -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors" onclick="window.open('https://analytics.google.com', '_blank')">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Visitor Stats</p>
                            <h3 class="text-lg font-bold text-blue-600 mt-1">Open Analytics &rarr;</h3>
                            <p class="text-xs text-gray-400 mt-1">View Traffic Data</p>
                        </div>
                        <div class="p-3 bg-orange-50 rounded-lg text-orange-600"><i class="fa-solid fa-chart-line text-xl"></i></div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Quick Actions -->
                    <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-bolt text-yellow-500"></i> Quick Actions
                        </h3>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <button onclick="window.Admin.openDestinationModal()" class="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all text-left group">
                                <i class="fa-solid fa-plus text-2xl mb-2 text-blue-500 group-hover:scale-110 transition-transform block"></i>
                                <span class="font-medium text-sm">Add Destination</span>
                            </button>
                            <button onclick="window.Admin.switchTab('page-home')" class="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all text-left group">
                                <i class="fa-solid fa-house text-2xl mb-2 text-purple-500 group-hover:scale-110 transition-transform block"></i>
                                <span class="font-medium text-sm">Edit Home Page</span>
                            </button>
                            <button onclick="window.Admin.switchTab('settings-global')" class="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all text-left group">
                                <i class="fa-solid fa-phone text-2xl mb-2 text-green-500 group-hover:scale-110 transition-transform block"></i>
                                <span class="font-medium text-sm">Update Contact</span>
                            </button>
                            <button onclick="window.Admin.switchTab('settings-navbar')" class="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all text-left group">
                                <i class="fa-solid fa-bars text-2xl mb-2 text-indigo-500 group-hover:scale-110 transition-transform block"></i>
                                <span class="font-medium text-sm">Manage Menu</span>
                            </button>
                             <button onclick="window.open('/', '_blank')" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 transition-all text-left group">
                                <i class="fa-solid fa-external-link-alt text-2xl mb-2 text-gray-500 group-hover:scale-110 transition-transform block"></i>
                                <span class="font-medium text-sm">View Live Site</span>
                            </button>
                        </div>
                    </div>

                    <!-- System Status / Info -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 class="font-bold text-gray-800 mb-4">System Health</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                                <div class="flex items-center gap-3">
                                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span class="text-sm font-medium text-green-800">Database Connected</span>
                                </div>
                                <i class="fa-solid fa-database text-green-600"></i>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <div class="flex items-center gap-3">
                                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span class="text-sm font-medium text-blue-800">Auth Active</span>
                                </div>
                                <i class="fa-solid fa-shield-halved text-blue-600"></i>
                            </div>
                            
                            <div class="mt-6 pt-4 border-t border-gray-100">
                                <p class="text-xs text-gray-500 mb-2">Storage Usage (Est.)</p>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-blue-600 h-2 rounded-full" style="width: 15%"></div>
                                </div>
                                <p class="text-xs text-right text-gray-400 mt-1">Healthy</p>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity Log -->
                    <div class="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 class="font-bold text-gray-800 mb-4">Recent Activity</h3>
                        <div class="overflow-hidden">
                            <table class="min-w-full text-sm text-left text-gray-500">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr><th class="px-4 py-3">Action</th><th class="px-4 py-3">Details</th><th class="px-4 py-3">User</th><th class="px-4 py-3">Time</th></tr>
                                </thead>
                                <tbody>
                                    ${logs.length > 0 ? logs.map(log => `
                                        <tr class="border-b hover:bg-gray-50">
                                            <td class="px-4 py-3 font-medium text-gray-900 capitalize">${log.action.replace('_', ' ')}</td>
                                            <td class="px-4 py-3">${log.details}</td>
                                            <td class="px-4 py-3">${log.user}</td>
                                            <td class="px-4 py-3">${new Date(log.timestamp).toLocaleString()}</td>
                                        </tr>
                                    `).join('') : '<tr><td colspan="4" class="px-4 py-3 text-center text-gray-400">No recent activity recorded.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderDestinations(container) {
        container.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Destinations</h2>
                    <p class="text-sm text-gray-500">Manage tour packages and locations</p>
                </div>
                <button onclick="window.Admin.openDestinationModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm font-medium flex items-center gap-2">
                    <i class="fa-solid fa-plus"></i> Add New
                </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${State.destinations.map(dest => `
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
                        <div class="relative h-48 bg-gray-100 shrink-0">
                            <img src="${dest.thumbnail || 'https://placehold.co/600x400?text=No+Image'}" class="w-full h-full object-cover">
                            <div class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onclick="window.Admin.deleteDestination('${dest.id}')" class="bg-white p-2 text-red-600 rounded shadow hover:bg-red-50" title="Delete"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                        <div class="p-5 flex flex-col flex-1">
                            <h3 class="font-bold text-lg text-gray-900 mb-1 line-clamp-1">${dest.title?.en || 'Untitled'}</h3>
                            <p class="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">${dest.desc?.en || 'No description'}</p>
                            <div class="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                                <span class="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600 truncate max-w-[100px]">${dest.id}</span>
                                <button onclick="window.Admin.openDestinationModal('${dest.id}')" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit Details &rarr;</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        // Handle empty state
        if(State.destinations.length === 0) {
            container.innerHTML += `<div class="bg-white p-10 text-center rounded shadow"><p class="text-gray-500">No destinations found.</p></div>`;
        }
    },

    renderPageEditor: (container, pageId) => Admin.renderPageEditor(container, pageId), // Redirect to the robust implementation

    
    // Helpers for extracting/setting nested keys like "hero.title"
    getNestedValue(obj, path) {
        return path.split('.').reduce((o, i) => o ? o[i] : null, obj);
    },
    
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    },

    renderGlobalSettings(container) {
        const c = State.settings.contact || {};
        const s = State.settings.social || {};
        
        container.innerHTML = `
            <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-xl font-bold mb-6 pb-2 border-b">Global Settings</h2>
                <div class="flex justify-between items-center mb-6 pb-2 border-b">
                    <h2 class="text-xl font-bold">Global Settings</h2>
                    <button type="button" onclick="window.Admin.loadGlobalDefaults()" class="bg-white border border-yellow-300 text-yellow-700 px-3 py-1.5 rounded-lg hover:bg-yellow-50 font-medium shadow-sm transition-colors flex items-center text-sm">
                        <i class="fa-solid fa-magic mr-2"></i> Defaults
                    </button>
                </div>
                <form id="settings-form" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number (Main)</label>
                            <input type="text" name="phone" value="${c.phone || ''}" class="w-full border rounded-lg p-2.5">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                            <input type="text" name="whatsapp" value="${c.whatsapp || ''}" class="w-full border rounded-lg p-2.5">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" name="email" value="${c.email || ''}" class="w-full border rounded-lg p-2.5">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                            <input type="text" name="address" value="${c.address || ''}" class="w-full border rounded-lg p-2.5">
                        </div>
                    </div>
                    
                    <div class="pt-4 border-t">
                        <h3 class="font-bold text-gray-900 mb-3">Social Media Links</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label class="text-xs uppercase text-gray-500 font-bold">Facebook URL</label><input name="social.facebook" value="${s.facebook || ''}" class="w-full border rounded p-2 text-sm"></div>
                            <div><label class="text-xs uppercase text-gray-500 font-bold">Instagram URL</label><input name="social.instagram" value="${s.instagram || ''}" class="w-full border rounded p-2 text-sm"></div>
                        </div>
                    </div>

                    <div class="pt-6 text-right">
                        <button type="submit" class="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-transform active:scale-95">Save Settings</button>
                    </div>
                </form>
            </div>
        `;
        
        document.getElementById('settings-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const data = { social: {} };
            for(let [k, v] of fd.entries()) {
                if(k.startsWith('social.')) data.social[k.split('.')[1]] = v;
                else data[k] = v;
            }
            try {
                await Data.saveSettings('contact', data);
                UI.toast("Settings saved!", "success");
            } catch(e) { UI.toast(e.message, 'error'); }
        });
    },

    renderNavbarSettings(container) {
        container.innerHTML = `
            <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold">Navbar Items</h2>
                    <button onclick="window.Admin.addNavbarItem()" class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-gray-700 border border-gray-300 font-medium">
                        + Add Item
                    </button>
                    <div class="flex gap-2">
                        <button type="button" onclick="window.Admin.loadNavbarDefaults()" class="text-sm bg-white border border-yellow-300 text-yellow-700 hover:bg-yellow-50 px-3 py-1.5 rounded font-medium border-gray-300 shadow-sm flex items-center">
                            <i class="fa-solid fa-magic mr-2"></i> Defaults
                        </button>
                        <button onclick="window.Admin.addNavbarItem()" class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-gray-700 border border-gray-300 font-medium">
                            + Add Item
                        </button>
                    </div>
                </div>
                
                <div id="navbar-list" class="space-y-3">
                    ${State.settings.navbar.map((item, idx) => `
                        <div class="flex items-center gap-3 bg-gray-50 p-3 rounded border border-gray-200" data-idx="${idx}">
                            <div class="cursor-move text-gray-400 px-2"><i class="fa-solid fa-grip-vertical"></i></div>
                            <div class="flex-1 grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Label (EN)" value="${item.label_en || ''}" class="nav-input w-full border rounded px-2 py-1 text-sm bg-white" data-field="label_en">
                                <input type="text" placeholder="Label (AR)" value="${item.label_ar || ''}" class="nav-input w-full border rounded px-2 py-1 text-sm text-right bg-white" data-field="label_ar">
                                <input type="text" placeholder="Link URL (e.g., #tours or page.html)" value="${item.link || ''}" class="nav-input w-full border rounded px-2 py-1 text-sm col-span-2 bg-white" data-field="link">
                            </div>
                            <button onclick="window.Admin.removeNavbarItem(${idx})" class="text-red-500 hover:bg-red-50 p-2 rounded"><i class="fa-solid fa-times"></i></button>
                        </div>
                    `).join('')}
                    ${State.settings.navbar.length === 0 ? '<p class="text-gray-500 text-center py-4 italic">No items defined.</p>' : ''}
                </div>

                <div class="mt-6 pt-4 border-t flex justify-end">
                    <button onclick="window.Admin.saveNavbar()" class="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow-sm">Save Menu</button>
                </div>
            </div>
        `;
    },

    openDestinationModal(id = null) {
        const dest = id ? State.destinations.find(d => d.id === id) : {};
        const modalPanel = document.getElementById('modal-panel');
        const backdrop = document.getElementById('modal-backdrop');
        
        // Populate modal
        modalPanel.innerHTML = `
            <div class="h-full flex flex-col">
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 class="text-lg font-bold text-gray-800">${id ? 'Edit Destination' : 'New Destination'}</h3>
                    <button onclick="window.Admin.closeModal()" class="text-gray-500 hover:text-gray-700"><i class="fa-solid fa-times text-xl"></i></button>
                </div>
                
                <div class="flex-1 overflow-y-auto p-6 space-y-6">
                    <form id="dest-form">
                        <div class="space-y-4">
                            <!-- Internal ID -->
                            <div class="bg-gray-50 p-3 rounded border border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                                <i class="fa-solid fa-database"></i>
                                <input type="text" name="id" value="${dest.id || ''}" placeholder="Auto-generated ID" ${id ? 'readonly' : ''} class="bg-transparent border-none w-full focus:ring-0 p-0 text-sm">
                            </div>

                            <!-- Basic Info -->
                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="block text-xs uppercase font-bold text-gray-500 mb-1">Name (EN)</label><input type="text" name="title_en" value="${dest.title?.en || ''}" class="w-full border p-2 rounded focus:border-blue-500"></div>
                                <div><label class="block text-xs uppercase font-bold text-gray-500 mb-1 text-right">الاسم (AR)</label><input type="text" name="title_ar" value="${dest.title?.ar || ''}" dir="rtl" class="w-full border p-2 rounded focus:border-blue-500"></div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
                                <input type="text" name="map_url" value="${dest.map_url || ''}" class="w-full border p-2 rounded text-sm font-mono text-gray-600" placeholder="https://www.google.com/maps/embed?pb=...">
                            </div>

                            <!-- Image Uploader -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
                                <div class="flex gap-2">
                                    <input type="text" name="thumbnail" value="${dest.thumbnail || ''}" id="dest-thumb" class="flex-1 border p-2 rounded text-sm text-gray-500 bg-gray-50">
                                    <label class="bg-white border hover:bg-gray-50 px-3 py-2 rounded cursor-pointer text-sm font-medium shadow-sm">
                                        Upload <input type="file" class="hidden" onchange="window.Admin.handleImageUpload(this, 'dest-thumb')">
                                    </label>
                                </div>
                                <img id="dest-preview" src="${dest.thumbnail || ''}" class="mt-2 h-32 w-full object-cover rounded border border-gray-200 ${!dest.thumbnail ? 'hidden' : ''}">
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="block text-xs uppercase font-bold text-gray-500 mb-1">Price (Text)</label><input type="text" name="price" value="${dest.price || ''}" class="w-full border p-2 rounded"></div>
                                <div><label class="block text-xs uppercase font-bold text-gray-500 mb-1">Duration</label><input type="text" name="duration" value="${dest.duration || ''}" class="w-full border p-2 rounded"></div>
                            </div>

                            <div class="space-y-4 pt-4 border-t">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                                    <textarea name="desc_en" rows="3" class="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500">${dest.desc?.en || ''}</textarea>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1 text-right">الوصف (AR)</label>
                                    <textarea name="desc_ar" rows="3" dir="rtl" class="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500">${dest.desc?.ar || ''}</textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button onclick="window.Admin.closeModal()" class="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded font-medium">Cancel</button>
                    <button onclick="window.Admin.submitDestForm('${dest.id || ''}')" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">Save Destination</button>
                </div>
            </div>
        `;
        
        backdrop.classList.remove('hidden');
        // Trigger reflow
        void backdrop.offsetWidth;
        backdrop.classList.remove('opacity-0');
        modalPanel.classList.remove('translate-x-full');
    },

    closeModal() {
        const modalPanel = document.getElementById('modal-panel');
        const backdrop = document.getElementById('modal-backdrop');
        modalPanel.classList.add('translate-x-full');
        backdrop.classList.add('opacity-0');
        setTimeout(() => {
            backdrop.classList.add('hidden');
            modalPanel.innerHTML = ''; 
        }, 300);
    },

    toast(msg, type = 'info') {
        const container = document.getElementById('toast-container');
        const el = document.createElement('div');
        el.className = `toast border-l-4 ${type === 'error' ? 'border-red-500 text-red-700' : 'border-green-500 text-gray-800'}`;
        el.innerHTML = `
            <i class="fa-solid ${type === 'error' ? 'fa-triangle-exclamation text-red-500' : 'fa-check-circle text-green-500'}"></i>
            <span class="font-medium text-sm">${msg}</span>
        `;
        container.appendChild(el);
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
            setTimeout(() => el.remove(), 300);
        }, 3000);
    }
};

const App = {
    init: () => {
        UI.showLoading();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                State.user = user;
                try {
                    await Data.loadAll();
                    UI.renderLayout();
                } catch (e) {
                    console.error("Critical:", e);
                    // If permissions error, force logout
                    if(e.code === 'permission-denied') {
                         UI.toast("Access Denied. You are not an admin.", "error");
                         await signOut(auth);
                    } else {
                         UI.toast("Failed to initialize app. Check console.", "error");
                    }
                }
            } else {
                State.user = null;
                UI.renderLogin();
            }
        });
    },

    logout: async () => {
        try {
            await signOut(auth);
            // State resets on reload or re-render
            window.location.reload();
        } catch(e) { console.error(e); }
    }
};

// --- Window Exports - Core Logic ---
const Admin = {
    init: App.init, // Expose init if needed specifically
    
    // --- Actions ---
    logout: App.logout,
    switchTab: (tab) => UI.loadTab(tab),
    openDestinationModal: UI.openDestinationModal,
    closeModal: UI.closeModal,
    getNestedValue: UI.getNestedValue,
    setNestedValue: UI.setNestedValue,
    
    loadPageDefaults: (pageId) => {
        if (!confirm('This will fill any EMPTY fields with the original website content. Existing content will NOT be overwritten.')) return;
        
        const defaults = DefaultContent[pageId];
        if (!defaults) {
            UI.toast('No defaults found for this page.', 'error');
            return;
        }

        const form = document.getElementById(`page-form-${pageId}`);
        if (!form) return;

        let fills = 0;
        Array.from(form.elements).forEach(el => {
            const key = el.name;
            if (!key) return;

            // Look up value in defaults object using the dot notation key
            const val = UI.getNestedValue(defaults, key);
            
            // Only fill if field is empty to prevent data loss
            if (val && !el.value) {
                el.value = val;
                fills++;
                // Special handling for image previews
                if(key.includes('.image') || key.includes('.bg_image')) {
                    const previewId = `preview-input-${key.replace(/\./g, '-')}`;
                    const img = document.getElementById(previewId);
                    if(img) img.src = val;
                }
            }
        });
        
        if (fills > 0) UI.toast(`Filled ${fills} fields with default content. Don't forget to save!`, 'success');
        else UI.toast('All fields already have content.', 'info');
    },

    loadGlobalDefaults: () => {
        if (!confirm('This will fill empty fields with default contact info.')) return;
        const defaults = DefaultContent.settings_global;
        const form = document.getElementById('settings-form');
        if (!form) return;

        const setIfEmpty = (name, val) => {
            const el = form.querySelector(`[name="${name}"]`);
            if (el && !el.value) el.value = val;
        };

        setIfEmpty('phone', defaults.phone);
        setIfEmpty('whatsapp', defaults.whatsapp);
        setIfEmpty('email', defaults.email);
        setIfEmpty('address', defaults.address);
        setIfEmpty('social.facebook', defaults.social.facebook);
        setIfEmpty('social.instagram', defaults.social.instagram);
        
        UI.toast('Global defaults loaded.', 'success');
    },

    loadNavbarDefaults: () => {
        if (!confirm('This will REPLACE current menu items with defaults. Continue?')) return;
        State.settings.navbar = JSON.parse(JSON.stringify(DefaultContent.settings_navbar));
        UI.loadTab('settings-navbar');
        UI.toast('Navbar defaults loaded.', 'success');
    },

    deleteDestination: async (id) => {
        if(!confirm("Are you sure? This cannot be undone.")) return;
        try {
            await Data.deleteDestination(id);
            UI.toast("Destination deleted", "success");
            UI.loadTab('destinations');
        } catch(e) {
            UI.toast("Error deleting: " + e.message, "error");
        }
    },
    
    handleImageUpload: async (input, targetId) => {
        if (!input.files || !input.files[0]) return;
        const file = input.files[0];
        const btn = input.parentElement;
        const originalHtml = btn.innerHTML;
        
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
        btn.classList.add('cursor-wait', 'opacity-50');
        
        try {
            const url = await Data.uploadImage(file, 'uploads');
            document.getElementById(targetId).value = url;
            
            // Try to find a preview element
            // const preview = document.getElementById(targetId).parentElement.nextElementSibling; // Old logic
            // Check specific ID first
            const previewId = "preview-" + targetId.replace('input-', ''); // Heuristic
            const specificPreview = document.getElementById(previewId) || document.getElementById('dest-preview');
            
            if(specificPreview && specificPreview.tagName === 'IMG') {
                specificPreview.src = url;
                specificPreview.classList.remove('hidden');
            }
            
            UI.toast("Image uploaded!", "success");
        } catch (e) {
            UI.toast("Upload failed: " + e.message, "error");
        } finally {
            btn.innerHTML = originalHtml;
            btn.classList.remove('cursor-wait', 'opacity-50');
        }
    },

    submitDestForm: async (existingId) => {
        const form = document.getElementById('dest-form');
        const fd = new FormData(form);
        const data = {
            title: { en: fd.get('title_en'), ar: fd.get('title_ar') },
            desc: { en: fd.get('desc_en'), ar: fd.get('desc_ar') },
            price: fd.get('price'),
            duration: fd.get('duration'),
            thumbnail: fd.get('thumbnail'),
            map_url: fd.get('map_url')
        };
        const id = fd.get('id') || existingId;
        
        try {
            await Data.saveDestination(id, data);
            UI.closeModal();
            UI.toast("Destination saved successfully!", "success");
            
            // Slight delay to allow write to propagate locally or just optimistic update happens via re-fetch
            setTimeout(() => UI.loadTab('destinations'), 100); 
        } catch(e) {
            UI.toast("Error saving: " + e.message, "error");
        }
    },

    addNavbarItem: () => {
        State.settings.navbar.push({ label_en: 'New Link', label_ar: 'جديد', link: '#' });
        UI.loadTab('settings-navbar');
    },
    
    removeNavbarItem: (idx) => {
        // Confirm? Nah, simple action
        State.settings.navbar.splice(idx, 1);
        UI.loadTab('settings-navbar');
    },
    
    saveNavbar: async () => {
        const rows = document.querySelectorAll('#navbar-list > div');
        const newItems = [];
        rows.forEach(row => {
            const inputs = row.querySelectorAll('input');
            const item = {};
            inputs.forEach(inp => item[inp.dataset.field] = inp.value);
            if(item.label_en) newItems.push(item);
        });
        
        try {
            await Data.saveSettings('navbar', { items: newItems });
            State.settings.navbar = newItems;
            UI.toast("Menu configuration saved!", "success");
        } catch(e) {
            UI.toast("Failed to update menu: " + e.message, "error");
        }
    }
};

// Export to window
window.Admin = Admin;

// --- Extension: Translation & Sections Support ---

// Helper for rendering schema-based forms with sections & translation
Admin.renderFormContainer = function(container, schema, data, title, onSave, isModal = false, pageId = null) {
    // Group schema
    const sections = [];
    let currentSection = { title: "General Info", fields: [] };
    
    schema.forEach(item => {
        if (item.section) {
            if (currentSection.fields.length > 0) sections.push(currentSection);
            currentSection = { title: item.section, description: item.description, fields: [] };
        } else if (item.type) { 
            currentSection.fields.push(item);
        }
    });
    if (currentSection.fields.length > 0) sections.push(currentSection);

    const formId = pageId ? `page-form-${pageId}` : `form-${Math.random().toString(36).substr(2, 9)}`;

    // Determine preview URL
    let previewUrl = '/';
    if (pageId === 'about') previewUrl = '/about.html';
    if (pageId === 'services') previewUrl = '/services.html';
    if (pageId === 'contact') previewUrl = '/contact.html';

    const defaultsBtn = pageId ? `
        <button type="button" onclick="window.Admin.loadPageDefaults('${pageId}')" class="bg-white border border-yellow-300 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-50 font-medium shadow-sm transition-colors flex items-center" title="Fill empty fields with defaults">
            <i class="fa-solid fa-magic mr-2"></i> Defaults
        </button>
    ` : '';

    const headerHtml = isModal ? 
        `<div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 sticky top-0 z-20">
            <h3 class="text-lg font-bold text-gray-800">${title}</h3>
            <div class="flex gap-2">
                 <button type="button" id="edit-btn-${formId}" class="bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300 text-sm font-medium transition-colors">
                    <i class="fa-solid fa-pen mr-1"></i> Edit
                </button>
                <button type="submit" form="${formId}" id="save-btn-${formId}" disabled class="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    Save
                </button>
                <button type="button" onclick="window.Admin.closeModal()" class="ml-2 text-gray-400 hover:text-gray-600">
                    <i class="fa-solid fa-times text-xl"></i>
                </button>
            </div>
        </div>` 
        : 
        `<div class="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-0 z-10">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 capitalize">${title}</h2>
                <p class="text-gray-500 text-sm mt-1">View and Manage Data</p>
            </div>
            <div class="flex gap-3">
                ${defaultsBtn}
                <a href="${previewUrl}" target="_blank" class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium shadow-sm transition-colors flex items-center text-decoration-none">
                    <i class="fa-solid fa-eye mr-2"></i> Preview
                </a>
                <button type="button" id="edit-btn-${formId}" class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium shadow-sm transition-colors flex items-center">
                    <i class="fa-solid fa-pen mr-2"></i> Enable Editing
                </button>
                <button type="submit" form="${formId}" id="save-btn-${formId}" disabled class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700 font-medium transition-transform active:scale-95 flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="fa-solid fa-save mr-2"></i> Save Changes
                </button>
            </div>
        </div>`;

    container.innerHTML = `
        <div class="${isModal ? 'h-full flex flex-col' : 'max-w-5xl mx-auto space-y-6'}">
            ${headerHtml}
            
            <div class="${isModal ? 'flex-1 overflow-y-auto p-6 space-y-6' : ''}">
                <form id="${formId}" class="space-y-6">
                    ${sections.map((sec, secIdx) => `
                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                             <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer select-none" onclick="window.Admin.toggleSection(this)">
                                <div>
                                    <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <span class="w-1.5 h-6 bg-blue-500 rounded-full inline-block"></span>
                                        ${sec.title}
                                    </h3>
                                    ${sec.description ? `<p class="text-sm text-gray-500 mt-0.5 ml-3.5">${sec.description}</p>` : ''}
                                </div>
                                <i class="fa-solid fa-chevron-down text-gray-400 transition-transform duration-200"></i>
                            </div>
                            
                            <div class="p-6 grid grid-cols-1 gap-6 transition-all duration-300 section-content">
                                ${sec.fields.map(field => {
                                    const val = Admin.getNestedValue(data, field.key) || '';
                                    const isAr = field.key.endsWith('_ar') || field.dir === 'rtl';
                                    const isEn = field.key.endsWith('_en') || !isAr;
                                    
                                    // Image
                                    if (field.type === 'image') {
                                        const inputId = `img-${field.key.replace(/\./g, '-')}-${Math.random().toString(36).substr(2, 5)}`;
                                        return `
                                            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <label class="block text-sm font-bold text-gray-700 mb-2">${field.label}</label>
                                                <div class="flex items-start gap-4">
                                                    <div class="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 border border-gray-300 relative group">
                                                        <img src="${val || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ij48L2NpcmNsZT48cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAxNiAxMCA1IDIxIj48L3BvbHlsaW5lPjwvc3ZnPg=='}" 
                                                             id="preview-${inputId}" 
                                                             class="w-full h-full object-cover bg-white">
                                                    </div>
                                                    <div class="flex-1">
                                                        <div class="flex gap-2">
                                                            <input type="text" name="${field.key}" value="${val}" id="${inputId}" disabled class="flex-1 border-gray-300 rounded-lg shadow-sm border py-2 px-3 text-sm bg-gray-50 text-gray-500 disabled:bg-gray-100 disabled:text-gray-400">
                                                            <label class="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm whitespace-nowrap file-upload-btn opacity-50 pointer-events-none">
                                                                <span>Upload</span>
                                                                <input type="file" disabled class="hidden" onchange="window.Admin.handleImageUpload(this, '${inputId}')">
                                                            </label>
                                                        </div>
                                                        <p class="text-xs text-gray-400 mt-1">Image URL or Upload</p>
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }

                                    // Checkbox/Toggle
                                    if(field.type === 'checkbox') {
                                         return `
                                            <div class="flex items-center gap-3 bg-gray-50 p-3 rounded border border-gray-200">
                                                <input type="checkbox" name="${field.key}" id="chk-${field.key}" ${val ? 'checked' : ''} disabled class="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 disabled:opacity-50">
                                                <label for="chk-${field.key}" class="font-medium text-gray-700">${field.label}</label>
                                            </div>
                                        `;
                                    }
                                    
                                    // Text Fields
                                    const isTextarea = field.type === 'textarea';
                                    let partnerKey = null;
                                    if(isEn && field.key.includes('_en')) partnerKey = field.key.replace('_en', '_ar');
                                    else if(isAr && field.key.includes('_ar')) partnerKey = field.key.replace('_ar', '_en');
                                    
                                    const fieldId = `field-${field.key.replace(/\./g, '-')}-${Math.random().toString(36).substr(2,5)}`;
                                    
                                    // Escape double quotes for input value attribute to prevent HTML breakage
                                    const safeVal = typeof val === 'string' ? val.replace(/"/g, '&quot;') : val;

                                    const transBtn = partnerKey ? `
                                        <button type="button" 
                                                onclick="window.Admin.translateField('${fieldId}', '${isEn ? 'en' : 'ar'}', '${partnerKey}')"
                                                class="trans-btn absolute top-2 ${isAr ? 'left-2' : 'right-2'} text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded hover:bg-blue-50 hidden"
                                                title="Translate">
                                            <i class="fa-solid fa-language text-lg"></i>
                                        </button>
                                    ` : '';

                                    const inputTag = isTextarea 
                                        ? `<textarea id="${fieldId}" name="${field.key}" rows="3" dir="${field.dir || 'ltr'}" disabled class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border transition-colors disabled:bg-gray-100 disabled:text-gray-500 ${ transBtn ? (isAr ? 'pl-10' : 'pr-10') : '' }">${val}</textarea>`
                                        : `<input type="text" id="${fieldId}" name="${field.key}" value="${safeVal}" dir="${field.dir || 'ltr'}" disabled class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border transition-colors disabled:bg-gray-100 disabled:text-gray-500 ${ transBtn ? (isAr ? 'pl-10' : 'pr-10') : '' }">`;

                                    return `
                                        <div class="relative">
                                            <label class="block text-sm font-medium text-gray-700 mb-1">${field.label}</label>
                                            <div class="relative group">
                                                ${inputTag}
                                                ${transBtn}
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `).join('')}
                </form>
            </div>
        </div>
    `;

    // Handle Edit Mode Toggle
    const editBtn = document.getElementById(`edit-btn-${formId}`);
    const saveBtn = document.getElementById(`save-btn-${formId}`);
    const form = document.getElementById(formId);
    
    editBtn.addEventListener('click', () => {
        const isEditing = editBtn.classList.contains('active-edit');
        if(!isEditing) {
            // Enable
            editBtn.classList.add('active-edit', 'bg-red-50', 'text-red-700', 'border-red-200');
            editBtn.classList.remove('bg-white', 'text-gray-700');
            editBtn.innerHTML = '<i class="fa-solid fa-lock mr-2"></i> Cancel Edit';
            
            saveBtn.disabled = false;
            
            // Enable inputs
            form.querySelectorAll('input, textarea, select').forEach(el => el.disabled = false);
            // Enable file uploads
            form.querySelectorAll('input[type="file"]').forEach(el => el.disabled = false);
            form.querySelectorAll('.file-upload-btn').forEach(el => {
                el.classList.remove('opacity-50', 'pointer-events-none');
            });
            // Show translate buttons
            form.querySelectorAll('.trans-btn').forEach(el => el.classList.remove('hidden'));
        } else {
            // Disable (Cancel)
            editBtn.classList.remove('active-edit', 'bg-red-50', 'text-red-700', 'border-red-200');
            editBtn.classList.add('bg-white', 'text-gray-700');
            editBtn.innerHTML = isModal ? '<i class="fa-solid fa-pen mr-1"></i> Edit' : '<i class="fa-solid fa-pen mr-2"></i> Enable Editing';
            
            saveBtn.disabled = true;
            
            // Disable inputs
            form.querySelectorAll('input, textarea, select').forEach(el => el.disabled = true);
            form.querySelectorAll('input[type="file"]').forEach(el => el.disabled = true);
            form.querySelectorAll('.file-upload-btn').forEach(el => {
                el.classList.add('opacity-50', 'pointer-events-none');
            });
            form.querySelectorAll('.trans-btn').forEach(el => el.classList.add('hidden'));
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newData = JSON.parse(JSON.stringify(data)); 
        
        for(let [key, value] of formData.entries()) {
            if(key.includes('.')) Admin.setNestedValue(newData, key, value);
            else newData[key] = value;
            
            // Handle checkboxes (if unchecked they don't appear in FormData, handle manually if needed, but for simple string/bool configs:)
            const checkbox = form.querySelector(`input[name="${key}"][type="checkbox"]`);
            if(checkbox) newData[key] = checkbox.checked;
        }
        
        // Also catch unchecked checkboxes
        form.querySelectorAll('input[type="checkbox"]').forEach(chk => {
            if(!formData.has(chk.name)) {
                if(chk.name.includes('.')) Admin.setNestedValue(newData, chk.name, false);
                else newData[chk.name] = false;
            }
        });
        
        await onSave(newData);
        
        // Disable edit mode after save? Or keep it open?
        // Let's keep it open but toast success
    });
};

Admin.renderPageEditor = function(container, pageId) {
    const schema = PageSchemas[pageId];
    const data = State.pages[pageId] || {};

    if (!schema) {
        container.innerHTML = `<div class="p-10 text-center text-gray-500">No editor schema defined for ${pageId}</div>`;
        return;
    }
    
    Admin.renderFormContainer(container, schema, data, `${pageId.replace('page_', '')} Content`, async (newData) => {
        try {
            await Data.savePage(pageId, newData);
            UI.toast('Page saved successfully', 'success');
        } catch (err) {
            UI.toast(err.message, 'error');
        }
    }, false, pageId);
};

// Destination Modal using the same engine
Admin.openDestinationModal = function(id = null) {
    const existingDest = id ? State.destinations.find(d => d.id === id) : null;
    const dest = existingDest ? {
        ...existingDest,
        title_en: existingDest.title_en || existingDest.title?.en || '',
        title_ar: existingDest.title_ar || existingDest.title?.ar || '',
        desc_en: existingDest.desc_en || existingDest.desc?.en || '',
        desc_ar: existingDest.desc_ar || existingDest.desc?.ar || ''
    } : { active: true };
    const modalPanel = document.getElementById('modal-panel');
    const backdrop = document.getElementById('modal-backdrop');
    
    const destSchema = [
        { section: "Basic Details", description: "Main information for the destination card." },
        { type: "checkbox", key: "active", label: "Active (Visible on Site)" },
        { type: "image", key: "thumbnail", label: "Thumbnail Image" },
        { type: "text", key: "title_en", label: "Title (English)" },
        { type: "text", key: "title_ar", label: "Title (Arabic)", dir: "rtl" },
        { type: "text", key: "price", label: "Price Text (e.g. 'From $500')" },
        { type: "text", key: "duration", label: "Duration (e.g. '5 Days')" },
        
        { section: "Details", description: "Full description and location." },
        { type: "textarea", key: "desc_en", label: "Description (English)" },
        { type: "textarea", key: "desc_ar", label: "Description (Arabic)", dir: "rtl" },
        { type: "text", key: "map_url", label: "Google Maps Embed URL" }
    ];

    Admin.renderFormContainer(modalPanel, destSchema, dest, id ? 'Edit Destination' : 'New Destination', async (newData) => {
        try {
            const normalized = {
                ...newData,
                title: {
                    en: (newData.title_en || '').trim(),
                    ar: (newData.title_ar || '').trim()
                },
                desc: {
                    en: (newData.desc_en || '').trim(),
                    ar: (newData.desc_ar || '').trim()
                }
            };
            delete normalized.title_en;
            delete normalized.title_ar;
            delete normalized.desc_en;
            delete normalized.desc_ar;

            await Data.saveDestination(id, normalized);
            UI.toast('Destination saved', 'success');
            await Data.fetchDestinations();
            UI.loadTab('destinations');
            window.Admin.closeModal();
        } catch (e) {
            UI.toast(e.message, 'error');
        }
    }, true);
    
    backdrop.classList.remove('hidden');
    void backdrop.offsetWidth;
    backdrop.classList.remove('opacity-0');
    modalPanel.classList.remove('translate-x-full');
};



Admin.toggleSection = function(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.fa-chevron-down');
    if(content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.remove('rotate-180');
    } else {
        content.classList.add('hidden');
        icon.classList.add('rotate-180');
    }
};

Admin.translateField = async function(sourceId, sourceLang, targetKey) {
    const sourceInput = document.getElementById(sourceId);
    if (!sourceInput || !sourceInput.value.trim()) {
        UI.toast('Please enter text to translate', 'warning');
        return;
    }

    const targetInput = sourceInput
        .closest('form')
        ?.querySelector(`[name="${targetKey}"]`);
    
    if (!targetInput) {
        UI.toast('Target field not found: ' + targetKey, 'error');
        return;
    }

    const btn = sourceInput
        .closest('.relative')
        ?.querySelector('button.trans-btn');
    if (!btn) return;
    const originalIcon = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
        const text = sourceInput.value;
        const targetLang = sourceLang === 'en' ? 'ar' : 'en';
        
        // Call Free Google Translate API
        // Using `translate.googleapis.com` undocumented API
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data && data[0]) {
            // data[0] is array of [translated_segment, source_segment, ...]
            const translatedText = data[0].map(s => s[0]).join('');
            targetInput.value = translatedText;
            UI.toast('Translated!', 'success');
        } else {
            throw new Error("Invalid response");
        }
    } catch (error) {
        console.error(error);
        UI.toast('Translation failed. Rate limit or network error.', 'error');
    } finally {
        btn.innerHTML = originalIcon;
        btn.disabled = false;
    }
};

// Start app
App.init();
