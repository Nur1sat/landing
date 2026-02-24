/**
 * Revel Padel Courts Landing Page - Main Application
 * Modern glassmorphism design with GSAP animations
 * All HTML is inline - no dynamic component loading needed
 */

// ─── GSAP + ScrollTrigger Registration ───────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─── App State ───────────────────────────────────────────────────────────────
const state = {
    isLoaded: false,
    isMobileMenuOpen: false,
    isModalOpen: false
};

// ─── App Initialization ──────────────────────────────────────────────────────

/**
 * Initialize the entire application.
 * Hides the preloader, then boots every module.
 */
async function initApp() {
    await hidePreloader();

    // Initialize all modules (everything is inline, no component loading)
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initScrollToTop();
    initModal();
    initFAQ();
    initForms();
    initGSAPAnimations();

    state.isLoaded = true;
    console.log('Revel Landing Page initialized');
}

// ─── Preloader ───────────────────────────────────────────────────────────────

/**
 * Fade out and remove the preloader overlay after 800 ms.
 */
function hidePreloader() {
    return new Promise((resolve) => {
        const preloader = document.getElementById('preloader');
        if (!preloader) { resolve(); return; }

        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 500);
            resolve();
        }, 800);
    });
}

// ─── Header ──────────────────────────────────────────────────────────────────

/**
 * Sticky header behaviour:
 *  - Add glass-strong class when scrolled past 50 px
 *  - Hide when scrolling down past 200 px, show on scroll up
 */
function initHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Glass effect on scroll
        if (currentScroll > 50) {
            header.classList.add('glass-strong');
        } else {
            header.classList.remove('glass-strong');
        }

        // Hide / show on scroll direction
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// ─── Mobile Menu ─────────────────────────────────────────────────────────────

/**
 * Toggle the mobile navigation drawer.
 * Animates hamburger lines into an X, locks body scroll, and
 * closes on link click, close button, overlay click, or Escape.
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!menuBtn || !mobileMenu) return;

    const toggleMenu = (open) => {
        state.isMobileMenuOpen = open;
        mobileMenu.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';

        // Animate hamburger lines to X / back
        const lines = menuBtn.querySelectorAll('.menu-line');
        if (lines.length >= 2) {
            if (open) {
                lines[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
                lines[1].style.transform = 'scale(0)';
                if (lines[2]) lines[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
            } else {
                lines.forEach((line) => { line.style.transform = ''; });
            }
        }
    };

    menuBtn.addEventListener('click', () => toggleMenu(true));
    closeBtn?.addEventListener('click', () => toggleMenu(false));

    // Close when a nav link is clicked
    mobileMenu.querySelectorAll('.mobile-nav-link, a').forEach((link) => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on overlay click (the menu container itself acts as overlay)
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) toggleMenu(false);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isMobileMenuOpen) toggleMenu(false);
    });
}

// ─── Smooth Scroll ───────────────────────────────────────────────────────────

/**
 * Intercept anchor-link clicks and smooth-scroll to the target
 * with an offset equal to the header height.
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#' || href === '#!') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const headerHeight = document.getElementById('main-header')?.offsetHeight || 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}

// ─── Scroll-to-Top Button ────────────────────────────────────────────────────

/**
 * Show the #scrollToTop button when the user scrolls past 500 px;
 * scroll back to the top on click.
 */
function initScrollToTop() {
    const btn = document.getElementById('scrollToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            btn.classList.remove('opacity-0', 'invisible');
            btn.classList.add('opacity-100', 'visible');
        } else {
            btn.classList.add('opacity-0', 'invisible');
            btn.classList.remove('opacity-100', 'visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ─── Modal ───────────────────────────────────────────────────────────────────

/**
 * Generic modal open / close with scale animation.
 * Exposes window.openModal() and window.closeModal().
 * Closes on overlay click, close button, or Escape.
 */
function initModal() {
    const modal = document.getElementById('modal');
    const overlay = document.getElementById('modalOverlay');
    const closeBtnEl = document.getElementById('modalClose');
    const content = document.getElementById('modalContent');

    if (!modal || !content) return;

    window.openModal = () => {
        state.isModalOpen = true;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        });
    };

    const closeModal = () => {
        state.isModalOpen = false;
        content.classList.add('scale-95', 'opacity-0');
        content.classList.remove('scale-100', 'opacity-100');

        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    };

    window.closeModal = closeModal;

    overlay?.addEventListener('click', closeModal);
    closeBtnEl?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isModalOpen) closeModal();
    });
}

// ─── FAQ Accordion ───────────────────────────────────────────────────────────

/**
 * Click a .faq-question to expand its .faq-answer (max-height).
 * Rotates the chevron icon. Only one item open at a time.
 */
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach((button) => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const answer = item.querySelector('.faq-answer');
            const icon = button.querySelector('.faq-icon');
            const isActive = item.classList.contains('active');

            // Close every item first
            document.querySelectorAll('.faq-item').forEach((i) => {
                i.classList.remove('active');
                const a = i.querySelector('.faq-answer');
                if (a) a.style.maxHeight = '';
                i.querySelector('.faq-icon')?.classList.remove('rotate-180');
            });

            // If the clicked item was not already open, open it
            if (!isActive && answer) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon?.classList.add('rotate-180');
            }
        });
    });
}

// ─── Forms ───────────────────────────────────────────────────────────────────

/**
 * Phone auto-formatting (+7 (xxx) xxx-xx-xx) and form submission
 * handling for #contactForm and #modalForm.
 */
function initForms() {
    // ── Phone formatting ──
    document.querySelectorAll('input[type="tel"]').forEach((input) => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            // Normalise leading digit
            if (value.length > 0 && value[0] === '8') value = '7' + value.slice(1);
            if (value.length > 0 && value[0] !== '7') value = '7' + value;

            let formatted = '+7';
            if (value.length > 1) formatted += ' (' + value.slice(1, 4);
            if (value.length > 4) formatted += ') ' + value.slice(4, 7);
            if (value.length > 7) formatted += '-' + value.slice(7, 9);
            if (value.length > 9) formatted += '-' + value.slice(9, 11);

            e.target.value = formatted;
        });
    });

    // ── Form submission ──
    const contactForm = document.getElementById('contactForm');
    const modalForm = document.getElementById('modalForm');

    [contactForm, modalForm].forEach((form) => {
        if (form) form.addEventListener('submit', handleFormSubmit);
    });
}

/**
 * Validate the phone number, show a loading spinner on the submit button,
 * simulate a 1.5 s API call, reset the form, show a success notification,
 * and close the modal if the submission came from the modal form.
 */
function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const data = Object.fromEntries(new FormData(form));

    // Validate phone (should have at least 12 chars: +7XXXXXXXXXX)
    const phone = (data.phone || '').replace(/\s/g, '');
    if (phone.length < 12) {
        showNotification('Пожалуйста, введите корректный номер телефона', 'error');
        return;
    }

    // Show loading spinner on the button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962
                     7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>`;

    // Simulate API call (1.5 s)
    setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;

        showNotification(
            'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
            'success'
        );

        // Close modal if the submission came from the modal form
        if (form.id === 'modalForm' && typeof window.closeModal === 'function') {
            window.closeModal();
        }
    }, 1500);
}

// ─── Notifications ───────────────────────────────────────────────────────────

/**
 * Create a toast notification (fixed top-right).
 *  - type: 'success' (green), 'error' (red), 'info' (purple)
 *  - Slides in from the right, auto-dismisses after 5 s.
 *  - Includes a close button.
 */
function showNotification(message, type = 'info') {
    // Remove any existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const colors = {
        success: 'from-green-500 to-emerald-600',
        error: 'from-red-500 to-rose-600',
        info: 'from-purple-500 to-indigo-600'
    };

    const icons = {
        success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>',
        error: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>',
        info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    };

    const notification = document.createElement('div');
    notification.className =
        'notification fixed top-24 right-4 z-[9999] glass-strong rounded-2xl p-5 ' +
        'shadow-2xl max-w-sm transform translate-x-full transition-transform duration-300';

    notification.innerHTML = `
        <div class="flex items-start space-x-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br ${colors[type]}
                        flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">${icons[type]}</svg>
            </div>
            <div class="flex-1">
                <p class="text-white text-sm">${message}</p>
            </div>
            <button class="notification-close text-gray-400 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>`;

    document.body.appendChild(notification);

    // Slide in
    requestAnimationFrame(() => notification.classList.remove('translate-x-full'));

    // Dismiss helper
    const dismiss = () => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    };

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', dismiss);

    // Auto-dismiss after 5 s
    setTimeout(() => {
        if (notification.parentElement) dismiss();
    }, 5000);
}

// ─── GSAP Animations ─────────────────────────────────────────────────────────

/**
 * Register all scroll-driven and entry animations:
 *  - Hero staggered fade-in
 *  - Section headers fade up
 *  - Various card types staggered fade up
 *  - Stage items staggered fade up
 *  - FAQ items slide in from left
 *  - Parallax on .orb elements
 *  - Counter animation for .stat-number
 */
function initGSAPAnimations() {
    // ── Hero staggered entrance ──
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (document.querySelector('.hero-badge')) {
        heroTimeline
            .from('.hero-badge',    { opacity: 0, y: 30, duration: 0.8 }, 0.2)
            .from('.hero-title',    { opacity: 0, y: 50, duration: 1   }, 0.4)
            .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8 }, 0.6)
            .from('.hero-buttons',  { opacity: 0, y: 30, duration: 0.8 }, 0.8)
            .from('.hero-stats .stat-item', {
                opacity: 0, y: 30, duration: 0.6, stagger: 0.1
            }, 1);
    }

    // ── Section headers ──
    gsap.utils.toArray('.section-header').forEach((header) => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                once: true
            },
            opacity: 0,
            y: 50,
            duration: 0.8
        });
    });

    // ── Generic card animation helper ──
    const animateCards = (selector, extraProps = {}) => {
        gsap.utils.toArray(selector).forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 0.6,
                delay: i * 0.1,
                ...extraProps
            });
        });
    };

    animateCards('.advantage-card');
    animateCards('.catalog-card', { scale: 0.95 });
    animateCards('.project-card');
    animateCards('.why-card');
    animateCards('.review-card');

    // Business stats - animate once and stay visible
    gsap.utils.toArray('.business-stat').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            opacity: 0, y: 50, duration: 0.6, delay: i * 0.15
        });
    });

    gsap.utils.toArray('.review-card').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
            opacity: 0, y: 50, duration: 0.6, delay: i * 0.15
        });
    });

    // ── Stage items ──
    gsap.utils.toArray('.stage-item').forEach((stage, i) => {
        gsap.from(stage, {
            scrollTrigger: {
                trigger: stage,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.6,
            delay: i * 0.1
        });
    });

    // ── FAQ items slide in from left ──
    gsap.utils.toArray('.faq-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            x: -30,
            duration: 0.5,
            delay: i * 0.05
        });
    });

    // ── Parallax on background orbs ──
    gsap.utils.toArray('.orb').forEach((orb, i) => {
        gsap.to(orb, {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            },
            y: (i + 1) * -200
        });
    });

    // ── Counter animation for stat numbers ──
    gsap.utils.toArray('.stat-number').forEach((stat) => {
        const text = stat.textContent;
        const match = text.match(/[\d,]+/);
        if (!match) return;

        const finalValue = parseInt(match[0].replace(/,/g, ''), 10);
        const prefix = text.substring(0, text.indexOf(match[0]));
        const suffix = text.substring(text.indexOf(match[0]) + match[0].length);

        ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                const counter = { val: 0 };
                gsap.to(counter, {
                    val: finalValue,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate() {
                        stat.textContent =
                            prefix + Math.round(counter.val).toLocaleString('ru-RU') + suffix;
                    }
                });
            }
        });
    });
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', initApp);

// ─── Visibility Change Handler ───────────────────────────────────────────────
// Pause / resume all GSAP animations when the browser tab is hidden / visible.

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});
