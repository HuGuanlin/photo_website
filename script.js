/* ==========================================================================
   1. EDIT HERE: Language Data Dictionary
   ========================================================================== */
const i18nData = {
    en: {
        AboutText: "About",
        nameLabel: "Name:",
        nameValue: "Hu",
        natLabel: "Nationality:",
        natValue: "Chinese",
        locLabel: "Location:",
        locValue: "Nürnberg, Germany",
        emailLabel: "Email:",
        rednoteLabel: "Rednote:",
        catPortrait: "Portrait",
        catLandscape: "Landscape",
        catStreet: "Street",
        catMoment: "Moment"
    },
    de: {
        AboutText: "Über",
        nameLabel: "Name:",
        nameValue: "Hu",
        natLabel: "Nationalität:",
        natValue: "Chinesisch",
        locLabel: "Ort:",
        locValue: "Nürnberg, Deutschland",
        emailLabel: "E-Mail:",
        rednoteLabel: "Rednote:",
        catPortrait: "Porträt",
        catLandscape: "Landschaft",
        catStreet: "Straße",
        catMoment: "Moment"
    },
    zh: {
        AboutText: "简介",
        nameLabel: "姓名:",
        nameValue: "",
        natLabel: "国籍:",
        natValue: "中国",
        locLabel: "地点:",
        locValue: "纽伦堡, 德国",
        emailLabel: "邮箱:",
        rednoteLabel: "小红书:",
        catPortrait: "人像",
        catLandscape: "风景",
        catStreet: "街拍",
        catMoment: "瞬间"
    }
};

/* ==========================================================================
   Language Switcher Logic
   ========================================================================== */
const langRadios = document.querySelectorAll('.lang-switcher input[type="radio"]');
const translatableElements = document.querySelectorAll('[data-i18n]');

// Initialize Language from LocalStorage or default to 'en'
let currentLang = localStorage.getItem('portfolioLang') || 'en';
document.querySelector(`#lang-${currentLang}`).checked = true;
applyTranslations(currentLang);

// Listen for Language Changes
langRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentLang = e.target.value;
        localStorage.setItem('portfolioLang', currentLang);
        applyTranslations(currentLang);
    });
});

function applyTranslations(lang) {
    translatableElements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18nData[lang] && i18nData[lang][key]) {
            el.textContent = i18nData[lang][key];
        }
    });
}

/* ==========================================================================
   "About" Sidebar Logic
   ========================================================================== */
const AboutBtn = document.getElementById('About-btn');
const closeSidebarBtn = document.getElementById('close-sidebar');
const AboutSidebar = document.getElementById('About-sidebar');
const AboutOverlay = document.getElementById('About-overlay');

function openSidebar() {
    AboutSidebar.classList.add('active');
    AboutOverlay.classList.add('active');
}

function closeSidebar() {
    AboutSidebar.classList.remove('active');
    AboutOverlay.classList.remove('active');
}

AboutBtn.addEventListener('click', openSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);
AboutOverlay.addEventListener('click', closeSidebar);