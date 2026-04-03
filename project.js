/* ==========================================================================
   Translatable text for project page
   ========================================================================== */
const i18nData = {
    en: { backHome: "← Back" },
    de: { backHome: "← Zurück" },
    zh: { backHome: "← 返回" }
};

/* ==========================================================================
   subProject button labels
   ========================================================================== */

const subProjectLabels = {
    portrait: [
        { key: 'A', label: 'Spring' },
        { key: 'B', label: 'Under the Lights' },
        { key: 'C', label: 'Autumn' },
        { key: 'D', label: 'Bluehour' },
        { key: 'E', label: 'Cowgirl' },
    ],
    landscape: [
    ],
    street: [
    ],
    moment: [
    ]
};

function renderSubProjectList() {
    const list = document.getElementById('subproject-list');
    list.innerHTML = '';

    const items = subProjectLabels[currentCategory] || [];

    items.forEach((item, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');

        button.className = 'sub-btn';
        if (index === 0) button.classList.add('active');

        button.setAttribute('data-sub', item.key);
        button.textContent = item.label;

        button.addEventListener('click', () => {
            document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            initGallery(item.key);
        });

        li.appendChild(button);
        list.appendChild(li);
    });
}


/* ==========================================================================
   Image Data Architecture
   ========================================================================== */
const generatePlaceholders = (folder, count) => {
    return Array.from({ length: count }, (_, i) => `images/projects/${folder}/${i + 1}.jpg`);
};

const projectData = {
    portrait: {
        A: generatePlaceholders('portrait/Spring', 9), 
        B: generatePlaceholders('portrait/Under-the-Light', 10),
        C: generatePlaceholders('portrait/Autumn', 6),
        D: generatePlaceholders('portrait/Bluehour', 5),
        E: generatePlaceholders('portrait/Cowgirl', 5), 
        F: [], G: []
    },
    landscape: {
        A: generatePlaceholders('landscape', 17),
    },
    street: {
        A: generatePlaceholders('street', 18),
    },
    moment: {
        A: generatePlaceholders('moment', 23),
    }
};

/* ==========================================================================
   Initialization & Language
   ========================================================================== */
const urlParams = new URLSearchParams(window.location.search);
const currentCategory = urlParams.get('category') || 'portrait'; // default fallback
let currentSubProject = 'A';

// Apply translation to "Back" button
const currentLang = localStorage.getItem('portfolioLang') || 'en';
const backBtn = document.querySelector('.back-btn');
if(backBtn && i18nData[currentLang].backHome) {
    backBtn.textContent = i18nData[currentLang].backHome;
}

/* ==========================================================================
   backgroundimg-map
   ========================================================================== */

const bgData = {
    portrait: {
        A: 'images/projects/backgrounds/portrait/Spring.jpg',
        B: 'images/projects/backgrounds/portrait/Under-the-Light.jpg',
        C: 'images/projects/backgrounds/portrait/Autumn.jpg',
        D: 'images/projects/backgrounds/portrait/Bluehour.jpg',
        E: 'images/projects/backgrounds/portrait/Cowgirl.jpg',
    },
    landscape: {
        A: 'images/projects/backgrounds/landscape/road.jpg'
    },
    street: {
        A: 'images/projects/backgrounds/street/lane.jpg'
    },
    moment: {
        A: 'images/projects/backgrounds/moment/blue.jpg'
    }
};
/* ==========================================================================
   bgim-change
   ========================================================================== */
function updateBackground(subProject) {
    const projectLayout = document.querySelector('.project-layout');
    const bg = bgData[currentCategory]?.[subProject];

    if (bg) {
        projectLayout.style.setProperty('--page-bg', `url("${bg}")`);
    } else {
        projectLayout.style.setProperty('--page-bg', 'none');
    }
}
/* ==========================================================================
   Progressive Loading Logic
   ========================================================================== */
const galleryGrid = document.getElementById('gallery-grid');
const loadingTrigger = document.getElementById('loading-trigger');
const BATCH_SIZE = 9;
let currentlyLoadedCount = 0;
let currentImageList = [];

function initGallery(subProject) {
    currentSubProject = subProject;
    currentlyLoadedCount = 0;
    galleryGrid.innerHTML = ''; // Clear gallery
    
    // Safely get the image list based on URL parameter and selected tab
    if (projectData[currentCategory] && projectData[currentCategory][subProject]) {
        currentImageList = projectData[currentCategory][subProject];
    } else {
        currentImageList = [];
    }
    // change background img
    updateBackground(subProject);

    // Scroll to top
    document.querySelector('.gallery-area').scrollTo({ top: 0, behavior: 'smooth' });
    
    loadNextBatch();
}

function loadNextBatch() {
    const end = Math.min(currentlyLoadedCount + BATCH_SIZE, currentImageList.length);
    
    for (let i = currentlyLoadedCount; i < end; i++) {
        const img = document.createElement('img');
        img.src = currentImageList[i];
        img.className = 'gallery-item';
        img.alt = `Project Image ${i + 1}`;
        img.loading = "lazy"; // Native lazy loading as a fallback
        
        // Setup lightbox click
        img.addEventListener('click', () => openLightbox(img.src));
        
        galleryGrid.appendChild(img);
    }
    currentlyLoadedCount = end;
}

// Intersection Observer for progressive loading
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && currentlyLoadedCount < currentImageList.length) {
        loadNextBatch();
    }
}, { rootMargin: '100px' });

observer.observe(loadingTrigger);


/* ==========================================================================
   Sidebar Sub-project Interaction
   ========================================================================== */
renderSubProjectList();

// Load initial sub-project
initGallery('A');


/* ==========================================================================
   Lightbox Logic
   ========================================================================== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightboxBtn = document.getElementById('close-lightbox');

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.remove('hidden');
}

function closeLightbox() {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
}

closeLightboxBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox(); // Close if clicking background
});