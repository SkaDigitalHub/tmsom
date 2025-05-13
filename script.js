// Dark Mode Toggle
function toggleMode() {
    const body = document.body;
    const toggleButton = document.querySelector('.mode-toggle');

    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        toggleButton.textContent = '☀️';
        toggleButton.classList.add('light');
    } else {
        toggleButton.textContent = '🌙';
        toggleButton.classList.remove('light');
    }
}

// Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    const menuItems = document.querySelectorAll('.menu-item');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Set active menu item based on current page
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });

    // Toggle menu
    menuBtn.addEventListener('click', function() {
        sideMenu.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        sideMenu.classList.remove('open');
        overlay.classList.remove('active');
    });

    // Swipe to close functionality for touch devices
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (touchEndX < touchStartX - 50 && sideMenu.classList.contains('open')) {
            sideMenu.classList.remove('open');
            overlay.classList.remove('active');
        }
    }
});
