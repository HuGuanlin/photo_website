const i18n = window.PortfolioI18n;

const generatePlaceholders = (folder, count) => {
  return Array.from({ length: count }, (_, index) => `images/projects/${folder}/${index + 1}.jpg`);
};

const subProjectLabels = {
    portrait: [
        { key: 'F', labelKey: 'EarlySpring' },
        { key: 'A', labelKey: 'Spring' },
        { key: 'B', labelKey: 'UndertheLights' },
        { key: 'C', labelKey: 'Autumn' },
        { key: 'D', labelKey: 'Bluehour' },
        { key: 'E', labelKey: 'Cowgirl' }
    ],
  landscape: [],
  street: [],
  moment: []
};

const categoryTitleKeys = {
  portrait: 'catPortrait',
  landscape: 'catLandscape',
  street: 'catStreet',
  moment: 'catMoment'
};

const projectData = {
    portrait: {
        A: generatePlaceholders('portrait/Spring', 9), 
        B: generatePlaceholders('portrait/Under-the-Light', 10),
        C: generatePlaceholders('portrait/Autumn', 6),
        D: generatePlaceholders('portrait/Bluehour', 5),
        E: generatePlaceholders('portrait/Cowgirl', 5), 
        F: generatePlaceholders('portrait/EarlySpring', 13), 
    G: [],
    H: [],
    },
    landscape: {
        F: generatePlaceholders('landscape', 17)
    },
    street: {
        F: generatePlaceholders('street', 18)
    },
    moment: {
        F: generatePlaceholders('moment', 23)
    }
};

const bgData = {
    portrait: {
        A: 'images/projects/backgrounds/portrait/Spring.jpg',
        B: 'images/projects/backgrounds/portrait/Under-the-Light.jpg',
        C: 'images/projects/backgrounds/portrait/Autumn.jpg',
        D: 'images/projects/backgrounds/portrait/Bluehour.jpg',
        E: 'images/projects/backgrounds/portrait/Cowgirl.jpg',
        F: 'images/projects/backgrounds/portrait/EarlySpring.jpg',
    },
    landscape: {
        F: 'images/projects/backgrounds/landscape/road.jpg'
    },
    street: {
        F: 'images/projects/backgrounds/street/lane.jpg'
    },
    moment: {
        F: 'images/projects/backgrounds/moment/blue.jpg'
    }
};

const urlParams = new URLSearchParams(window.location.search);
const currentCategory = urlParams.get('category') || 'portrait';
let currentSubProject = urlParams.get('sub') || 'F';

const availableSubProjects = subProjectLabels[currentCategory] || [];
if (availableSubProjects.length > 0 && !availableSubProjects.some((item) => item.key === currentSubProject)) {
  currentSubProject = availableSubProjects[0].key;
}

const galleryGrid = document.getElementById('gallery-grid');
const loadingTrigger = document.getElementById('loading-trigger');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightboxBtn = document.getElementById('close-lightbox');
const BATCH_SIZE = 15;
let currentlyLoadedCount = 0;
let currentImageList = [];
let currentLang = i18n.getLang();

function getCurrentDisplayName() {
  const currentItem = (subProjectLabels[currentCategory] || []).find((item) => item.key === currentSubProject);
  const key = currentItem?.labelKey || categoryTitleKeys[currentCategory] || 'projectPageTitle';
  return i18n.t(key, {}, currentLang);
}

function updateHead() {
  const displayName = getCurrentDisplayName();
  i18n.setPageMeta(
    {
      titleKey: 'projectPageTitleWithName',
      titleVars: { name: displayName },
      descriptionKey: 'projectPageDescription'
    },
    currentLang
  );
}

function renderSubProjectList() {
  const list = document.getElementById('subproject-list');
  list.innerHTML = '';

  const items = subProjectLabels[currentCategory] || [];

  items.forEach((item) => {
    const li = document.createElement('li');
    const button = document.createElement('button');

    button.className = 'sub-btn';
    button.type = 'button';
    if (item.key === currentSubProject) button.classList.add('active');

    button.dataset.sub = item.key;
    button.textContent = i18n.t(item.labelKey, {}, currentLang);

    button.addEventListener('click', () => {
      document.querySelectorAll('.sub-btn').forEach((element) => element.classList.remove('active'));
      button.classList.add('active');
      initGallery(item.key);
    });

    li.appendChild(button);
    list.appendChild(li);
  });
}

function updateBackground(subProject) {
    const projectLayout = document.querySelector('.project-layout');
    const bg = bgData[currentCategory]?.[subProject];

    if (bg) {
        projectLayout.style.setProperty('--page-bg', `url("${bg}")`);
    } else {
        projectLayout.style.setProperty('--page-bg', 'none');
    }
}

function loadNextBatch() {
  const end = Math.min(currentlyLoadedCount + BATCH_SIZE, currentImageList.length);
  const displayName = getCurrentDisplayName();

  for (let index = currentlyLoadedCount; index < end; index += 1) {
    const img = document.createElement('img');
    img.src = currentImageList[index];
    img.className = 'gallery-item';
    img.alt = i18n.t('projectImageAlt', { name: displayName, index: index + 1 }, currentLang);
    img.loading = 'lazy';
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
    galleryGrid.appendChild(img);
  }

  currentlyLoadedCount = end;
}

function initGallery(subProject) {
    currentSubProject = subProject;

    const params = new URLSearchParams(window.location.search);
    params.set('category', currentCategory);
    params.set('sub', subProject);
    history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);

    currentlyLoadedCount = 0;
  galleryGrid.innerHTML = '';
  currentImageList = projectData[currentCategory]?.[subProject] || [];

    updateBackground(subProject);
  updateHead();

    // Scroll to top
    document.querySelector('.gallery-area').scrollTo({ top: 0, behavior: 'smooth' });
    
    loadNextBatch();
}

function applyProjectLanguage(lang) {
  currentLang = i18n.setLang(lang);
  i18n.applyDataI18n(document, currentLang);
  renderSubProjectList();
  updateHead();

  const displayName = getCurrentDisplayName();
  galleryGrid.querySelectorAll('.gallery-item').forEach((image, index) => {
    image.alt = i18n.t('projectImageAlt', { name: displayName, index: index + 1 }, currentLang);
  });

  lightboxImg.alt = i18n.t('previewAlt', {}, currentLang);

  const activeLightboxImage = galleryGrid.querySelector('.gallery-item');
  if (!lightbox.classList.contains('hidden') && activeLightboxImage) {
    lightboxImg.alt = activeLightboxImage.alt;
  }
}

function openLightbox(src, altText) {
  lightboxImg.src = src;
  lightboxImg.alt = altText || i18n.t('previewAlt', {}, currentLang);
  lightbox.classList.remove('hidden');
}

function closeLightbox() {
  lightbox.classList.add('hidden');
  lightboxImg.src = '';
  lightboxImg.alt = i18n.t('previewAlt', {}, currentLang);
}

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && currentlyLoadedCount < currentImageList.length) {
        loadNextBatch();
    }
}, { rootMargin: '100px' });

observer.observe(loadingTrigger);
closeLightboxBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener('storage', (event) => {
  if (event.key === i18n.STORAGE_KEY && event.newValue) {
    applyProjectLanguage(event.newValue);
  }
});

applyProjectLanguage(currentLang);
initGallery(currentSubProject);
