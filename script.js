// Comic Book Reader Script
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the comic page
    if (document.querySelector('.book-container')) {
        initBookReader();
    } else {
        // Original walrus animation for index page
        initWalrusAnimation();
    }
});

function initBookReader() {
    const spreads = document.querySelectorAll('.page-spread');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    
    let currentSpread = 0;
    const totalSpreads = spreads.length;
    let isAnimating = false;
    
    // Initialize book state
    showSpread(0);
    updatePageInfo();
    updateNavigationButtons();
    
    // Navigation buttons
    prevBtn.addEventListener('click', function() {
        if (!isAnimating && currentSpread > 0) {
            flipToSpread(currentSpread - 1);
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (!isAnimating && currentSpread < totalSpreads - 1) {
            flipToSpread(currentSpread + 1);
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (isAnimating) return;
        
        if (e.key === 'ArrowLeft' && currentSpread > 0) {
            flipToSpread(currentSpread - 1);
        } else if (e.key === 'ArrowRight' && currentSpread < totalSpreads - 1) {
            flipToSpread(currentSpread + 1);
        }
    });
    
    function flipToSpread(targetSpread) {
        if (isAnimating || targetSpread === currentSpread) return;
        
        isAnimating = true;
        
        if (targetSpread > currentSpread) {
            // Forward flip - animate the right page
            flipNext();
        } else {
            // Backward flip - animate the right page
            flipPrev();
        }
    }
    
    function flipNext() {
        if (currentSpread < totalSpreads - 1) {
            const currentRightPage = spreads[currentSpread].querySelector('.right-page');
            if (currentRightPage) {
                currentRightPage.classList.add('flipping');
                
                setTimeout(() => {
                    currentSpread++;
                    showSpread(currentSpread);
                    updatePageInfo();
                    updateNavigationButtons();
                    isAnimating = false;
                }, 800);
            }
        } else {
            isAnimating = false;
        }
    }
    
    function flipPrev() {
        if (currentSpread > 0) {
            currentSpread--;
            showSpread(currentSpread);
            
            setTimeout(() => {
                const rightPage = spreads[currentSpread].querySelector('.right-page');
                if (rightPage) {
                    rightPage.classList.add('flipping');
                    setTimeout(() => {
                        rightPage.classList.remove('flipping');
                    }, 50);
                }
                updatePageInfo();
                updateNavigationButtons();
                isAnimating = false;
            }, 50);
        } else {
            isAnimating = false;
        }
    }
    
    function showSpread(spreadIndex) {
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
        spreads[spreadIndex].classList.add('active');
    }
    
    function updatePageInfo() {
        const startPage = currentSpread * 2 + 1;
        const endPage = Math.min((currentSpread + 1) * 2, 6);
        pageInfo.textContent = `Pages ${startPage}-${endPage} of 6`;
    }
    
    function updateNavigationButtons() {
        prevBtn.disabled = currentSpread === 0;
        nextBtn.disabled = currentSpread === totalSpreads - 1;
    }
    
    // Add click handlers to spreads for easy navigation
    spreads.forEach((spread, index) => {
        spread.addEventListener('click', function() {
            if (!isAnimating) {
                if (index > currentSpread) {
                    flipToSpread(index);
                } else if (index < currentSpread) {
                    flipToSpread(index);
                }
            }
        });
    });
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
