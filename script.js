// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');

        // Toggle icon between hamburger and X
        if (mobileMenu.classList.contains('hidden')) {
            menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        } else {
            menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
        }
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 64; // 64px for fixed navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.remove('opacity-0', 'pointer-events-none');
            backToTopButton.classList.add('opacity-100', 'pointer-events-auto');
        } else {
            backToTopButton.classList.remove('opacity-100', 'pointer-events-auto');
            backToTopButton.classList.add('opacity-0', 'pointer-events-none');
        }
    });

    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Language Toggle Buttons
    const langToggle = document.getElementById('lang-toggle');
    const langToggleMobile = document.getElementById('lang-toggle-mobile');

    // Função para atualizar os botões de idioma
    function updateLanguageButtons(locale) {
        const flagIcon = document.getElementById('flag-icon');
        const langCode = document.getElementById('lang-code');
        const flagIconMobile = document.getElementById('flag-icon-mobile');
        const langCodeMobile = document.getElementById('lang-code-mobile');

        if (locale === 'pt-BR') {
            if (flagIcon) flagIcon.textContent = '🇧🇷';
            if (langCode) langCode.textContent = 'PT';
            if (flagIconMobile) flagIconMobile.textContent = '🇧🇷';
            if (langCodeMobile) langCodeMobile.textContent = 'PT';
        } else if (locale === 'en-US') {
            if (flagIcon) flagIcon.textContent = '🇺🇸';
            if (langCode) langCode.textContent = 'EN';
            if (flagIconMobile) flagIconMobile.textContent = '🇺🇸';
            if (langCodeMobile) langCodeMobile.textContent = 'EN';
        }
    }

    // Função para trocar o idioma
    function toggleLanguage() {
        if (window.i18n) {
            const currentLocale = window.i18n.getCurrentLocale();
            const newLocale = currentLocale === 'pt-BR' ? 'en-US' : 'pt-BR';
            window.i18n.changeLocale(newLocale);
        }
    }

    // Event listeners para os botões
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    if (langToggleMobile) {
        langToggleMobile.addEventListener('click', toggleLanguage);
    }

    // Escutar evento de mudança de idioma para atualizar os botões
    window.addEventListener('localeChanged', function(event) {
        updateLanguageButtons(event.detail.locale);
    });

    // Atualizar botões quando o i18n estiver pronto
    window.addEventListener('load', function() {
        if (window.i18n) {
            const currentLocale = window.i18n.getCurrentLocale();
            updateLanguageButtons(currentLocale);
        }
    });
});

// Lightbox Functions
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    lightboxImage.src = imageSrc;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
