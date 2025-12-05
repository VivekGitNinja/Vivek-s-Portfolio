/* Main Javascript File for Modern Minimalist Portfolio with 3D & Animations */

document.addEventListener("DOMContentLoaded", function () {

    // --- 1. Lenis Smooth Scroll Setup ---
    let lenis;
    if (typeof Lenis !== "undefined") {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        // Sync Lenis with GSAP ScrollTrigger
        if (typeof ScrollTrigger !== "undefined") {
            lenis.on('scroll', ScrollTrigger.update);
        }

        // GSAP Ticker for smooth animation loop
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        // Disable GSAP's native lag smoothing to prevent jitters
        gsap.ticker.lagSmoothing(0);
    }

    // --- 2. GSAP & ScrollTrigger Setup ---
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // Kinetic Typography for Hero
        gsap.from(".home-content h1", {
            y: 80,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out",
            stagger: 0.1
        });

        gsap.from(".home-content h3, .home-content p, .social-media, .hero-cta-group", {
            y: 40,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            stagger: 0.15,
            ease: "power3.out"
        });

        // Scroll Reveal Animations for Sections
        const animatedElements = document.querySelectorAll(
            '.heading, .quantum-card, .skills-box, .timeline-item, .community-3d-node, .service-3d-container, .project-card, .github-stat-card, .edu-card, .cert-card, .faq-item, .contact-wrapper'
        );

        animatedElements.forEach(el => {
