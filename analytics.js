/**
 * Opération "Data Supremacy"
 * Script de suivi des événements Google Analytics 4 (GA4) pour lumifolio.com
 * Auteur : L'Architecte
 * Version : 1.0
 */

document.addEventListener('DOMContentLoaded', () => {

    // Fonction de wrapper sécurisée pour envoyer des événements à GA4
    const trackGA4Event = (eventName, params = {}) => {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        } else {
            console.warn(`GA4 gtag function not found. Event "${eventName}" not tracked.`);
        }
    };

    // --- MODULE 1: SUIVI DES CLICS SUR LES APPELS À L'ACTION (CTA) ---
    const initCtaTracking = () => {
        const ctaButtons = document.querySelectorAll('a.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', () => {
                const location = button.closest('section')?.id || button.closest('header')?.id || 'sticky';
                trackGA4Event('cta_click', {
                    button_text: button.textContent.trim(),
                    button_location: location
                });
            });
        });
    };

    // --- MODULE 2: SUIVI DE L'ENGAGEMENT AVEC LA FAQ ---
    const initFaqTracking = () => {
        const faqContainer = document.querySelector('.faq-accordion');
        if (!faqContainer) return;

        faqContainer.addEventListener('click', e => {
            const questionButton = e.target.closest('.faq-question');
            if (questionButton && !questionButton.parentElement.classList.contains('active')) {
                trackGA4Event('faq_open', {
                    question_title: questionButton.textContent.trim()
                });
            }
        });
    };

    // --- MODULE 3: SUIVI DU CLIC DE PRISE DE CONTACT ---
    const initContactTracking = () => {
        const contactLink = document.querySelector('.footer-contact a[href^="mailto:"]');
        if (contactLink) {
            contactLink.addEventListener('click', () => {
                trackGA4Event('contact_click');
            });
        }
    };

    // --- MODULE 4: SUIVI DE LA PROFONDEUR DE DÉFILEMENT (SCROLL) ---
    const initScrollDepthTracking = () => {
        const milestones = { 25: false, 50: false, 75: false, 90: false };
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            for (const milestone in milestones) {
                if (scrollPercent >= milestone && !milestones[milestone]) {
                    milestones[milestone] = true;
                    trackGA4Event('scroll_depth', {
                        scroll_percent: parseInt(milestone)
                    });
                }
            }
        }, { passive: true });
    };

    // --- MODULE 5: SUIVI DE L'INTERACTION VIDÉO ---
    const initVideoTracking = () => {
        const video = document.getElementById('video-demonstration');
        if (!video) return;

        const trackingFlags = { start: false, 25: false, 50: false, 75: false, complete: false };

        video.addEventListener('play', () => {
            if (!trackingFlags.start) {
                trackingFlags.start = true;
                trackGA4Event('video_start', { video_title: 'demonstration_solution' });
            }
        });

        video.addEventListener('timeupdate', () => {
            const percent = (video.currentTime / video.duration) * 100;
            if (percent >= 25 && !trackingFlags[25]) {
                trackingFlags[25] = true;
                trackGA4Event('video_progress', { video_title: 'demonstration_solution', video_percent: 25 });
            }
            if (percent >= 50 && !trackingFlags[50]) {
                trackingFlags[50] = true;
                trackGA4Event('video_progress', { video_title: 'demonstration_solution', video_percent: 50 });
            }
            if (percent >= 75 && !trackingFlags[75]) {
                trackingFlags[75] = true;
                trackGA4Event('video_progress', { video_title: 'demonstration_solution', video_percent: 75 });
            }
        });

        video.addEventListener('ended', () => {
            if (!trackingFlags.complete) {
                trackingFlags.complete = true;
                trackGA4Event('video_complete', { video_title: 'demonstration_solution' });
            }
        });
    };


    // --- INITIALISATION DE TOUS LES MODULES DE SUIVI ---
    initCtaTracking();
    initFaqTracking();
    initContactTracking();
    initScrollDepthTracking();
    initVideoTracking();

});
