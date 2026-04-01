/* ==========================================================================
   1. EDIT HERE: Translatable text for project page
   ========================================================================== */
const i18nData = {
    en: { backHome: "← Back" },
    de: { backHome: "← Zurück" },
    zh: { backHome: "← 返回" }
};

/* ==========================================================================
   2. EDIT HERE: Image Data Architecture
   Replace these placeholder strings with your actual image paths.
   To add more images, just add more strings separated by commas.
   ========================================================================== */
const generatePlaceholders = (folder, count) => {
    // Utility function to generate placeholder paths for demonstration
    // E.g., folder: 'portrait/a', count: 12 -> images/projects/portrait/a/1.jpg ...
    return Array.from({ length: count }, (_, i) => `images/projects/${folder}/${i + 1}.jpg`);
};

const projectData = {
    portrait: {
        A: generatePlaceholders('portrait/a', 15), // Edit these arrays directly! Example: ["images/myphoto1.jpg", "images/myphoto2.jpg"]
        B: generatePlaceholders('portrait/b', 8),
        C: generatePlaceholders('portrait/c', 22),
        D: [], E: [], F: [], G: []
    },
    landscape: {
        A: generatePlaceholders('landscape/a', 12),
        B: [], C: [], D: [], E: [], F: [], G: []
    },
    street: {
        A: generatePlaceholders('street/a', 18),
        B: [], C: [], D: [], E: [], F: [], G: []
    },
    activity: {
        A: generatePlaceholders('activity/a', 10),
        B: [], C: [], D: [], E: [], F: [], G: []
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
const subBtns = document.querySelectorAll('.sub-btn');

subBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remove active class from all
        subBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked
        e.target.classList.add('active');
        
        const selectedSub = e.target.getAttribute('data-sub');
        initGallery(selectedSub);
    });
});

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