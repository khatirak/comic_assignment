// Interactive Comic Book Script
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the comic page
    if (document.querySelector('.book-container')) {
        initInteractiveComic();
    } else {
        // Original walrus animation for index page
        initWalrusAnimation();
    }
});

function initInteractiveComic() {
    const spreads = document.querySelectorAll('.page-spread');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Story structure
    const storyFlow = {
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
    };
    
    let currentPage = '1';
    let isAnimating = false;
    
    // Initialize comic state
    showPage('1');
    updateNavigationButtons();
    
    // Navigation buttons
    prevBtn.addEventListener('click', function() {
        if (!isAnimating && storyFlow[currentPage].prev) {
            playPageSound();
            navigateToPage(storyFlow[currentPage].prev);
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (!isAnimating && storyFlow[currentPage].next) {
            playPageSound();
            navigateToPage(storyFlow[currentPage].next);
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (isAnimating) return;
        
        if (e.key === 'ArrowLeft' && storyFlow[currentPage].prev) {
            playPageSound();
            navigateToPage(storyFlow[currentPage].prev);
        } else if (e.key === 'ArrowRight' && storyFlow[currentPage].next) {
            playPageSound();
            navigateToPage(storyFlow[currentPage].next);
        }
    });
    
    // Choice button handlers
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('choice-btn')) {
            const choice = e.target.getAttribute('data-path');
            if (choice && !isAnimating) {
                playPageSound(); // Play page flick sound when choice is made
                navigateToPage(choice);
            }
        }
        
        // Restart button handler
        if (e.target.classList.contains('restart-btn')) {
            stopAllAudio(); // Stop all audio when restarting
            navigateToPage('1');
        }
        
        // Image click handler for modal
        if (e.target.classList.contains('comic-image')) {
            openImageModal(e.target.src, e.target.alt);
        }
    });
    
    function navigateToPage(pageId) {
        if (isAnimating || pageId === currentPage) return;
        
        // Stop all audio except page sound when navigating
        stopAllAudioExceptPage();
        isAnimating = true;
        
        // Animate page transition
        const currentSpread = document.querySelector(`[data-page="${currentPage}"]`);
        const targetSpread = document.querySelector(`[data-page="${pageId}"]`);
        
        if (currentSpread && targetSpread) {
            // Add flipping animation to current page
            const rightPage = currentSpread.querySelector('.right-page');
            if (rightPage) {
                rightPage.classList.add('flipping');
            }
            
            setTimeout(() => {
                currentPage = pageId;
                showPage(currentPage);
                updateNavigationButtons();
                
                // Remove flipping class
                if (rightPage) {
                    rightPage.classList.remove('flipping');
                }
                
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
            // Remove any flipping classes
            const rightPage = spread.querySelector('.right-page');
            if (rightPage) {
                rightPage.classList.remove('flipping');
            }
        });
        
        // Show the target spread
        const targetSpread = document.querySelector(`[data-page="${pageId}"]`);
        if (targetSpread) {
            targetSpread.classList.add('active');
        }
        
        // Play ending sound for final pages
        if (storyFlow[pageId] && storyFlow[pageId].ending) {
            playSpecificEndingSound(pageId);
        } else {
            // Play page sound for non-ending pages (30% chance)
            if (Math.random() < 0.3) {
                playPageSound();
            }
        }
    }
    
    function updateNavigationButtons() {
        const hasPrev = storyFlow[currentPage].prev !== null;
        const hasNext = storyFlow[currentPage].next !== null;
        const isEnding = storyFlow[currentPage].ending === true;
        
        prevBtn.disabled = !hasPrev;
        nextBtn.disabled = !hasNext;
        
        // Hide navigation for ending pages
        const navigation = document.querySelector('.navigation');
        if (isEnding) {
            navigation.style.display = 'none';
        } else {
            navigation.style.display = 'flex';
        }
    }
}

function initWalrusAnimation() {
    const walruses = document.querySelectorAll('.walrus');
    
    // Initialize all walruses off-screen
    walruses.forEach(walrus => {
        walrus.classList.add('hide');
        
        // Add click event listener to each walrus
        walrus.addEventListener('click', function() {
            // Open comic.html in the same tab
            window.location.href = 'comic.html';
        });
        
        // Add cursor pointer to indicate clickability
        walrus.style.cursor = 'pointer';
    });
    
    // Function to show walrus
    function showWalrus(walrus) {
        walrus.classList.add('appear');
        walrus.classList.remove('hide');
    }
    
    // Function to hide walrus
    function hideWalrus(walrus) {
        walrus.classList.add('hide');
        walrus.classList.remove('appear');
    }
    
    // Function to animate a single walrus
    function animateWalrus(walrus, delay) {
        setTimeout(() => {
            showWalrus(walrus);
            
            // Play random wally sound (25% chance of no sound)
            playRandomWallySound();
            
            // Hide after 2 seconds of being visible
            setTimeout(() => {
                hideWalrus(walrus);
            }, 2000);
        }, delay);
    }
    
    // Animate all walruses with staggered timing
    walruses.forEach((walrus, index) => {
        // Each walrus appears 3 seconds after the previous one
        const delay = index * 3000;
        animateWalrus(walrus, delay);
    });
    
    // Optional: Reset animation after all walruses have finished
    const totalDuration = walruses.length * 3000 + 2000; // Total time for all animations
    setTimeout(() => {
        // Reset all walruses to initial state (off-screen)
        walruses.forEach(walrus => {
            walrus.classList.remove('appear');
            walrus.classList.add('hide');
        });
        
        // Restart the animation cycle
        setTimeout(() => {
            walruses.forEach((walrus, index) => {
                const delay = index * 3000;
                animateWalrus(walrus, delay);
            });
        }, 1000);
    }, totalDuration);
}

// Image Modal Functions
function openImageModal(imageSrc, imageAlt) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modalImage.alt = imageAlt;
    modal.classList.add('show');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Add event listeners for modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (modal && closeBtn) {
        // Close modal when clicking the X button
        closeBtn.addEventListener('click', closeImageModal);
        
        // Close modal when clicking outside the image
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImageModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeImageModal();
            }
        });
    }
});

// Sound Functions
function playRandomWallySound() {
    // 10% chance of no sound, 90% chance of playing one of the three sounds
    const random = Math.random();
    
    if (random < 0.1) {
        // No sound (10% chance)
        return;
    } else if (random < 0.4) {
        // Play wally1.mp3 (30% chance)
        playSound('wally1Sound');
    } else if (random < 0.7) {
        // Play wally2.mp3 (30% chance)
        playSound('wally2Sound');
    } else {
        // Play wally3.mp3 (30% chance)
        playSound('wally3Sound');
    }
}

function playPageSound() {
    playSound('pageSound');
}

function playSpecificEndingSound(pageId) {
    // Map each ending page to its specific sound
    const endingSounds = {
        'a3a': 'ending1Sound',  // 5a3a.png -> ending1.mp3
        'a3b': 'ending2Sound', // 5a3b.png -> ending2.mp3
        'b3a': 'ending3Sound', // 5b3a.png -> ending3.mp3
        'b3b': 'ending4Sound'  // 5b3b.png -> ending4.mp3
    };
    
    const soundId = endingSounds[pageId];
    if (soundId) {
        playSound(soundId);
    }
}


function playSound(soundId) {
    const audio = document.getElementById(soundId);
    if (audio) {
        // Reset audio to beginning and play
        audio.currentTime = 0;
        audio.play().catch(error => {
            // Handle autoplay policy restrictions
            console.log('Audio autoplay prevented:', error);
        });
    }
}

function stopAllAudio() {
    // List of all audio elements to stop
    const audioElements = [
        'pageSound',
        'ending1Sound', 
        'ending2Sound',
        'ending3Sound',
        'ending4Sound',
        'wally1Sound',
        'wally2Sound',
        'wally3Sound'
    ];
    
    audioElements.forEach(soundId => {
        const audio = document.getElementById(soundId);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
}

function stopAllAudioExceptPage() {
    // Stop all audio except page sound
    const audioElements = [
        'ending1Sound', 
        'ending2Sound',
        'ending3Sound',
        'ending4Sound',
        'wally1Sound',
        'wally2Sound',
        'wally3Sound'
    ];
    
    audioElements.forEach(soundId => {
        const audio = document.getElementById(soundId);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
}
