/* 31blume App Logic */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Animate toggle icon if needed
        });
    }

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Lightbox Logic (Simple implementation)
    const galleryItems = document.querySelectorAll('.gallery-item img');
    if (galleryItems.length > 0) {
        createLightbox();
    }
});

function createLightbox() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <img src="" alt="Full View" style="max-height: 90vh; max-width: 100%; box-shadow: 0 5px 30px rgba(0,0,0,0.5);">
        </div>
    `;
    document.body.appendChild(overlay);

    const imgElement = overlay.querySelector('img');
    const closeBtn = overlay.querySelector('.modal-close');

    // Open
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
            imgElement.src = img.src; // Or a high-res data attribute
            overlay.classList.add('open');
        });
    });

    // Close
    const closeLightbox = () => overlay.classList.remove('open');
    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeLightbox();
    });
}
