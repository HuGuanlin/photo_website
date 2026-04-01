/* ==========================================================================
   1. EDIT HERE: Language Data Dictionary
   ========================================================================== */
const i18nData = {
    en: {
        meText: "Me",
        nameLabel: "Name:",
        nameValue: "John Doe",
        natLabel: "Nationality:",
        natValue: "Global Citizen",
        locLabel: "Location:",
        locValue: "Berlin, Germany",
        emailLabel: "Email:",
        catPortrait: "Portrait",
        catLandscape: "Landscape",
        catStreet: "Street",
        catActivity: "Activity"
    },
    de: {
        meText: "Ich",
        nameLabel: "Name:",
        nameValue: "John Doe",
        natLabel: "Nationalität:",
        natValue: "Weltbürger",
        locLabel: "Ort:",
        locValue: "Berlin, Deutschland",
        emailLabel: "E-Mail:",
        catPortrait: "Porträt",
        catLandscape: "Landschaft",
        catStreet: "Straße",
        catActivity: "Aktivität"
    },
    zh: {
        meText: "我",
        nameLabel: "姓名:",
        nameValue: "约翰·多伊",
        natLabel: "国籍:",
        natValue: "世界公民",
        locLabel: "地点:",
        locValue: "柏林, 德国",
        emailLabel: "邮箱:",
        catPortrait: "人像",
        catLandscape: "风景",
        catStreet: "街拍",
        catActivity: "活动"
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
   "Me" Sidebar Logic
   ========================================================================== */
const meBtn = document.getElementById('me-btn');
const closeSidebarBtn = document.getElementById('close-sidebar');
const meSidebar = document.getElementById('me-sidebar');
const meOverlay = document.getElementById('me-overlay');

function openSidebar() {
    meSidebar.classList.add('active');
    meOverlay.classList.add('active');
}

function closeSidebar() {
    meSidebar.classList.remove('active');
    meOverlay.classList.remove('active');
}

meBtn.addEventListener('click', openSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);
meOverlay.addEventListener('click', closeSidebar);