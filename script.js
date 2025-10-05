// Interactive Comic Book Script
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.book-container')) {
        initInteractiveComic();
    } else {
        initWalrusAnimation();
    }
});

// Comic Configuration
const COMIC_CONFIG = {
    storyFlow: {
        '1': { next: '2', prev: null },
        '2': { next: '3', prev: '1' },
        '3': { next: null, prev: '2', choices: ['a1', 'b1'] },
        'a1': { next: 'a2', prev: '3' },
        'a2': { next: null, prev: 'a1', choices: ['a3a', 'a3b'] },
        'a3a': { next: null, prev: 'a2', ending: true },
        'a3b': { next: null, prev: 'a2', ending: true },
        'b1': { next: 'b2', prev: '3' },
        'b2': { next: null, prev: 'b1', choices: ['b3a', 'b3b'] },
        'b3a': { next: null, prev: 'b2', ending: true },
        'b3b': { next: null, prev: 'b2', ending: true }
    },
    endingSounds: {
        'a3a': 'ending1Sound',
        'a3b': 'ending2Sound',
        'b3a': 'ending3Sound',
        'b3b': 'ending4Sound'
    },
    audioElements: [
        'pageSound', 'ending1Sound', 'ending2Sound', 'ending3Sound', 
        'ending4Sound', 'wally1Sound', 'wally2Sound', 'wally3Sound'
    ]
};

function initInteractiveComic() {
    const spreads = document.querySelectorAll('.page-spread');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentPage = '1';
    let isAnimating = false;
    
    // Initialize comic
    showPage('1');
    updateNavigationButtons();
    
    // Event listeners
    prevBtn.addEventListener('click', () => navigate('prev'));
    nextBtn.addEventListener('click', () => navigate('next'));
    
    document.addEventListener('keydown', handleKeyboard);
    document.addEventListener('click', handleClick);
    
    function navigate(direction) {
        if (isAnimating) return;
        
        const targetPage = direction === 'prev' 
            ? COMIC_CONFIG.storyFlow[currentPage].prev
            : COMIC_CONFIG.storyFlow[currentPage].next;
            
        if (targetPage) {
            playPageSound();
            navigateToPage(targetPage);
        }
    }
    
    function handleKeyboard(e) {
        if (isAnimating) return;
        
        if (e.key === 'ArrowLeft') {
            navigate('prev');
        } else if (e.key === 'ArrowRight') {
            navigate('next');
        }
    }
    
    function handleClick(e) {
        if (e.target.classList.contains('choice-btn')) {
            const choice = e.target.getAttribute('data-path');
            if (choice && !isAnimating) {
                playPageSound();
                navigateToPage(choice);
            }
        }
        
        if (e.target.classList.contains('restart-btn')) {
            stopAllAudio();
            navigateToPage('1');
        }
        
        if (e.target.classList.contains('comic-image')) {
            openImageModal(e.target.src, e.target.alt);
        }
    }
    
    function navigateToPage(pageId) {
        if (isAnimating || pageId === currentPage) return;
        
        stopAllAudioExceptPage();
        isAnimating = true;
        
        const currentSpread = document.querySelector(`[data-page="${currentPage}"]`);
        const targetSpread = document.querySelector(`[data-page="${pageId}"]`);
        
        if (currentSpread && targetSpread) {
            const rightPage = currentSpread.querySelector('.right-page');
            if (rightPage) rightPage.classList.add('flipping');
            
            setTimeout(() => {
                currentPage = pageId;
                showPage(currentPage);
                updateNavigationButtons();
                
                if (rightPage) rightPage.classList.remove('flipping');
                isAnimating = false;
            }, 800);
        } else {
            isAnimating = false;
        }
    }
    
    function showPage(pageId) {
        // Hide all spreads
        spreads.forEach(spread => {
            spread.classList.remove('active');
            const rightPage = spread.querySelector('.right-page');
            if (rightPage) rightPage.classList.remove('flipping');
        });
        
        // Show target spread
        const targetSpread = document.querySelector(`[data-page="${pageId}"]`);
        if (targetSpread) targetSpread.classList.add('active');
        
        // Play appropriate sound
        if (COMIC_CONFIG.storyFlow[pageId]?.ending) {
            playSpecificEndingSound(pageId);
        } else if (Math.random() < 0.3) {
            playPageSound();
        }
    }
    
    function updateNavigationButtons() {
        const hasPrev = COMIC_CONFIG.storyFlow[currentPage].prev !== null;
        const hasNext = COMIC_CONFIG.storyFlow[currentPage].next !== null;
        const isEnding = COMIC_CONFIG.storyFlow[currentPage].ending === true;
        
        prevBtn.disabled = !hasPrev;
        nextBtn.disabled = !hasNext;
        
        const navigation = document.querySelector('.navigation');
        navigation.style.display = isEnding ? 'none' : 'flex';
    }
}

function initWalrusAnimation() {
    const walruses = document.querySelectorAll('.walrus');
    
    walruses.forEach(walrus => {
        walrus.classList.add('hide');
        walrus.addEventListener('click', () => window.location.href = 'comic.html');
        walrus.style.cursor = 'pointer';
    });
    
    function animateWalrus(walrus, delay) {
        setTimeout(() => {
            walrus.classList.add('appear');
            walrus.classList.remove('hide');
            playRandomWallySound();
            
            setTimeout(() => {
                walrus.classList.add('hide');
                walrus.classList.remove('appear');
            }, 2000);
        }, delay);
    }
    
    function startAnimation() {
        walruses.forEach((walrus, index) => {
            const delay = index * 3000;
            animateWalrus(walrus, delay);
        });
    }
    
    // Start initial animation
    startAnimation();
    
    // Restart animation cycle
    const totalDuration = walruses.length * 3000 + 2000;
    setTimeout(() => {
        walruses.forEach(walrus => {
            walrus.classList.remove('appear');
            walrus.classList.add('hide');
        });
        
        setTimeout(startAnimation, 1000);
    }, totalDuration);
}

// Image Modal Functions
function openImageModal(imageSrc, imageAlt) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modalImage.alt = imageAlt;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (modal && closeBtn) {
        closeBtn.addEventListener('click', closeImageModal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeImageModal();
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeImageModal();
            }
        });
    }
});

// Sound Functions
function playRandomWallySound() {
    const random = Math.random();
    
    if (random < 0.1) return; // No sound
    else if (random < 0.4) playSound('wally1Sound');
    else if (random < 0.7) playSound('wally2Sound');
    else playSound('wally3Sound');
}

function playPageSound() {
    playSound('pageSound');
}

function playSpecificEndingSound(pageId) {
    const soundId = COMIC_CONFIG.endingSounds[pageId];
    if (soundId) playSound(soundId);
}

function playSound(soundId) {
    const audio = document.getElementById(soundId);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(error => {
            console.log('Audio autoplay prevented:', error);
        });
    }
}

function stopAllAudio() {
    COMIC_CONFIG.audioElements.forEach(soundId => {
        const audio = document.getElementById(soundId);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
}

function stopAllAudioExceptPage() {
    const audioToStop = COMIC_CONFIG.audioElements.filter(id => id !== 'pageSound');
    audioToStop.forEach(soundId => {
        const audio = document.getElementById(soundId);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
}