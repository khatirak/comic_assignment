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
    stopEndingSounds(); // Stop any playing ending sounds
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

function stopEndingSounds() {
    const endingSounds = ['ending1Sound', 'ending2Sound', 'ending3Sound', 'ending4Sound'];
    endingSounds.forEach(soundId => {
        const audio = document.getElementById(soundId);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
}

function playEndingSoundBasedOnChoices() {
    // Stop page sound before playing ending sound
    const pageSound = document.getElementById('pageSound');
    if (pageSound) {
        pageSound.pause();
        pageSound.currentTime = 0;
    }
    
    if (firstChoice === 'yes' && secondChoice === 'yes') {
        playSound('ending1Sound');
    } else if (firstChoice === 'yes' && secondChoice === 'no') {
        playSound('ending2Sound');
    } else if (firstChoice === 'no' && secondChoice === 'yes') {
        playSound('ending3Sound');
    } else if (firstChoice === 'no' && secondChoice === 'no') {
        playSound('ending4Sound');
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

// References to DOM Elements
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");

const paper1 = document.querySelector("#p1");
const paper2 = document.querySelector("#p2");
const paper3 = document.querySelector("#p3");
const paper4 = document.querySelector("#p4");
const paper5 = document.querySelector("#p5");
const paper6 = document.querySelector("#p6");
// Removed paper7 reference since it doesn't exist in HTML

// Choice-related elements
const choiceImage1 = document.querySelector("#choice-image-1");
const choiceImage2 = document.querySelector("#choice-image-2");
const choiceImage3 = document.querySelector("#choice-image-3");
const back6Image = document.querySelector("#back6-image");

// Event Listener
prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);

// Function to update navigation button states
function updateNavigationButtons() {
    // Disable left arrow when on first page (location 2 = back1/front2)
    prevBtn.disabled = currentLocation <= 2;
    
    // Disable right arrow on choice pages until choice is made
    if (currentLocation === 4) {
        // On Front 4 (first choice page), disable next until choice is made
        nextBtn.disabled = firstChoice === null;
    } else if (currentLocation === 6) {
        // On Front 6 (second choice page), disable next until choice is made
        nextBtn.disabled = secondChoice === null;
    } else if (currentLocation >= 8) {
        // On final page, disable next button
        nextBtn.disabled = true;
    } else {
        // On other pages, enable next button
        nextBtn.disabled = false;
    }
}

// Add event listeners for choice buttons
document.addEventListener('click', function(e) {
    console.log('Click detected on:', e.target);
    console.log('Current location:', currentLocation);
    console.log('Has choice-btn class:', e.target.classList.contains('choice-btn'));
    
    if (e.target.classList.contains('choice-btn')) {
        const choice = e.target.getAttribute('data-choice');
        console.log('Choice button clicked:', choice);
        
        // Handle choice for all pages (including Front 6)
        handleChoice(choice);
    }
    
    // Also check if we're at location 6 and clicked on paper5 or paper6 (z-index workaround)
    if (currentLocation === 6 && (e.target.id === 'p5' || e.target.id === 'p6' || e.target.closest('#p5') || e.target.closest('#p6'))) {
        console.log('Front 6 area clicked (z-index workaround)');
        // Determine choice based on click position
        const rect = e.target.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const choice = clickX < rect.width / 2 ? 'yes' : 'no';
        console.log('Detected choice:', choice);
        handleChoice(choice);
        return;
    }
});

// Debug: Check if Front 6 buttons exist
document.addEventListener('DOMContentLoaded', function() {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    if (yesBtn && noBtn) {
        console.log('Front 6 Yes/No buttons found and ready');
    } else {
        console.log('Front 6 buttons not found');
    }
    
    // Initialize the book to show Back 1 and Front 2
    openBook();
    paper1.classList.add("flipped");
    paper1.style.zIndex = 1;
    
    // Initialize navigation button states
    updateNavigationButtons();
});

// Business Logic
let currentLocation = 2; // Start at location 2 (Back 1 + Front 2)
let numOfPapers = 6;
let maxLocation = numOfPapers + 2; // Allow for final page (location 8)
let firstChoice = null; // Track first choice from Front 4 (yes/no)
let secondChoice = null; // Track second choice from Front 6 (yes/no)

function openBook() {
    book.style.transform = "translateX(50%)";
}

function closeBook(isAtBeginning) {
    if(isAtBeginning) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "translateX(100%)";
    }
}

// Arrow positioning is now handled by CSS

function handleChoice(choice) {
    // Play page sound when choice is made
    playPageSound();
    
    if (currentLocation === 4) {
        // First choice from Front 4
        firstChoice = choice;
        
        // Update images and captions based on first choice
        if (choice === 'yes') {
            choiceImage1.src = 'img/5a1.png';
            choiceImage2.src = 'img/5a2.png';
            choiceImage3.src = 'img/5a3.png';
            addCaptionToElement('choice-image-1', 'Wally finds a sunken ship at the mysterious location.');
            addCaptionToElement('choice-image-2', 'A scary shark starts chasing Wally through the water!');
            addCaptionToElement('choice-image-3', 'Wally finds a broken porthole to escape the shipwreck.');
        } else if (choice === 'no') {
            choiceImage1.src = 'img/5b1.png';
            choiceImage2.src = 'img/5b2.png';
            choiceImage3.src = 'img/5b3.png';
            addCaptionToElement('choice-image-1', 'Wally decides to ignore the note and go to the park instead.');
            addCaptionToElement('choice-image-2', 'He waves hello to his friend Sally at the playground.');
            addCaptionToElement('choice-image-3', 'Sally invites Wally to her home.');
        }
        
        // Update navigation buttons after choice is made
        updateNavigationButtons();
        
        // Automatically go to next page after choice
        goNextPage();
    } else if (currentLocation === 6) {
        // Second choice from Front 6
        secondChoice = choice;
        
        // Update Back 6 image based on both choices
        updateBack6Image();
        
        // Update navigation buttons after choice is made
        updateNavigationButtons();
        
        // Automatically go to next page after choice
        goNextPage();
    }
}

function addCaptionToElement(elementId, captionText) {
    const element = document.getElementById(elementId);
    if (element) {
        // Remove existing caption if any
        const existingCaption = element.parentElement.querySelector('.caption');
        if (existingCaption) {
            existingCaption.remove();
        }
        
        // Add new caption
        const caption = document.createElement('p');
        caption.className = 'caption';
        caption.textContent = captionText;
        element.parentElement.appendChild(caption);
    }
}

function updateBack6Image() {
    // Stop page sound before playing ending sound
    const pageSound = document.getElementById('pageSound');
    if (pageSound) {
        pageSound.pause();
        pageSound.currentTime = 0;
    }
    
    if (firstChoice === 'yes' && secondChoice === 'yes') {
        back6Image.src = 'img/5a3a.png';
        addCaptionToElement('back6-image', 'Wally runs away from the sunken ship and gets home safely.');
        playSound('ending1Sound'); // Play ending sound for yes+yes combination
    } else if (firstChoice === 'yes' && secondChoice === 'no') {
        back6Image.src = 'img/5a3b.png';
        addCaptionToElement('back6-image', 'Wally couldn\'t escape in time and gets eaten by the shark.');
        playSound('ending2Sound'); // Play ending sound for yes+no combination
    } else if (firstChoice === 'no' && secondChoice === 'yes') {
        back6Image.src = 'img/5b3a.png';
        addCaptionToElement('back6-image', 'Wally arrives to find a surprise birthday party waiting for him!');
        playSound('ending3Sound'); // Play ending sound for no+yes combination
    } else if (firstChoice === 'no' && secondChoice === 'no') {
        back6Image.src = 'img/5b3b.png';
        addCaptionToElement('back6-image', 'Wally declines Sally and decides to go home instead.');
        playSound('ending4Sound'); // Play ending sound for no+no combination
    }
}

function goNextPage() {
    if(currentLocation < maxLocation) {
        // Play page sound when navigating
        playPageSound();
        
        switch(currentLocation) {
            case 1:
                openBook();
                paper1.classList.add("flipped");
                paper1.style.zIndex = 1;
                break;
            case 2:
                paper2.classList.add("flipped");
                paper2.style.zIndex = 2;
                break;
            case 3:
                paper3.classList.add("flipped");
                paper3.style.zIndex = 3;
                break;
            case 4:
                paper4.classList.add("flipped");
                paper4.style.zIndex = 4;
                break;
            case 5:
                paper5.classList.add("flipped");
                paper5.style.zIndex = 5;
                break;
            case 6:
                paper6.classList.add('flipped');
                paper6.style.zIndex = 6;
                break;
            default:
                throw new Error("unkown state");
        }
        currentLocation++;
        console.log('Current location:', currentLocation);
        
        // Play ending sound when reaching the final page (location 7)
        if (currentLocation === 7) {
            playEndingSoundBasedOnChoices();
        }
        
        // Show final page after ending
        if (currentLocation === 8) {
            showFinalPage();
        }
        
        // Update navigation button states
        updateNavigationButtons();
    }
}

function goPrevPage() {
    if(currentLocation > 1) {
        // Play page sound when navigating
        playPageSound();
        
        switch(currentLocation) {
            case 2:
                closeBook(true);
                paper1.classList.remove("flipped");
                paper1.style.zIndex = 7;
                break;
            case 3:
                paper2.classList.remove("flipped");
                paper2.style.zIndex = 6;
                break;
            case 4:
                paper3.classList.remove("flipped");
                paper3.style.zIndex = 5;
                break;
            case 5:
                paper4.classList.remove("flipped");
                paper4.style.zIndex = 4;
                break;
            case 6:
                paper5.classList.remove("flipped");
                paper5.style.zIndex = 3;
                break;
            case 7:
                paper6.classList.remove("flipped");
                paper6.style.zIndex = 2;
                break;
            case 8:
                closeBook(false);
                break;
            default:
                throw new Error("unkown state");
        }

        currentLocation--;
        
        // Update navigation button states
        updateNavigationButtons();
    }
}

function showFinalPage() {
    const finalPage = document.getElementById('final-page');
    if (finalPage) {
        finalPage.style.display = 'flex';
        // Hide navigation buttons
        document.getElementById('prev-btn').style.display = 'none';
        document.getElementById('next-btn').style.display = 'none';
    }
}

function restartComic() {
    // Stop all audio
    stopAllAudio();
    
    // Reset all variables
    currentLocation = 2;
    firstChoice = null;
    secondChoice = null;
    
    // Reset all papers
    const papers = [paper1, paper2, paper3, paper4, paper5, paper6];
    papers.forEach(paper => {
        paper.classList.remove("flipped");
    });
    
    // Reset z-indexes
    paper1.style.zIndex = 7;
    paper2.style.zIndex = 6;
    paper3.style.zIndex = 5;
    paper4.style.zIndex = 4;
    paper5.style.zIndex = 3;
    paper6.style.zIndex = 2;
    
    // Reset book position
    closeBook(true);
    
    // Hide final page
    const finalPage = document.getElementById('final-page');
    if (finalPage) {
        finalPage.style.display = 'none';
    }
    
    // Show navigation buttons
    document.getElementById('prev-btn').style.display = 'flex';
    document.getElementById('next-btn').style.display = 'flex';
    
    // Update navigation buttons
    updateNavigationButtons();
    
    console.log('Comic restarted');
}