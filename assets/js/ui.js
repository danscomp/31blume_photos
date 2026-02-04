/**
 * 31blume UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initLightbox();
});

// Mobile Menu
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            toggle.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }
}

// Lightbox
function initLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'modal-overlay';
    lightbox.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <img src="" alt="Enlarged view" id="lightbox-img">
        </div>
    `;
    document.body.appendChild(lightbox);

    const imgElement = lightbox.querySelector('#lightbox-img');
    const triggers = document.querySelectorAll('.lightbox-trigger');
    const closeBtn = lightbox.querySelector('.modal-close');

    function openLightbox(src) {
        imgElement.src = src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => { imgElement.src = ''; }, 300);
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            // Use dataset.full if available, else src
            const src = trigger.dataset.full || trigger.src || trigger.href;
            if (src) openLightbox(src);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}
