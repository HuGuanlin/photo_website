const i18n = window.PortfolioI18n;

const langRadios = document.querySelectorAll('.lang-switcher input[type="radio"]');
const AboutBtn = document.getElementById('About-btn');
const closeSidebarBtn = document.getElementById('close-sidebar');
const AboutSidebar = document.getElementById('About-sidebar');
const AboutOverlay = document.getElementById('About-overlay');

function applyHomeLanguage(lang) {
  const activeLang = i18n.setLang(lang);

  i18n.applyDataI18n(document, activeLang);
  i18n.setPageMeta(
    {
      titleKey: 'homeTitle',
      descriptionKey: 'homeDescription'
    },
    activeLang
  );

  const activeRadio = document.querySelector(`#lang-${activeLang}`);
  if (activeRadio) activeRadio.checked = true;

  return activeLang;
}

function openSidebar() {
    AboutSidebar.classList.add('active');
    AboutOverlay.classList.add('active');
}

function closeSidebar() {
    AboutSidebar.classList.remove('active');
    AboutOverlay.classList.remove('active');
}

langRadios.forEach((radio) => {
  radio.addEventListener('change', (event) => {
    applyHomeLanguage(event.target.value);
  });
});

window.addEventListener('storage', (event) => {
  if (event.key === i18n.STORAGE_KEY && event.newValue) {
    applyHomeLanguage(event.newValue);
  }
});

AboutBtn.addEventListener('click', openSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);
AboutOverlay.addEventListener('click', closeSidebar);

applyHomeLanguage(i18n.getLang());
