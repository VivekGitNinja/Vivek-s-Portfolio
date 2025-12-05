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
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        // --- 3. Scroll-Spy: Active Nav Link Indicator ---
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar a');

        window.addEventListener('scroll', () => {
            let currentSectionId = '';
            const scrollPos = window.scrollY + 200;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            if (currentSectionId) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // --- 4. Three.js 3D Starfield Background ---
    const canvas = document.querySelector('#bg-3d');
    if (canvas && typeof THREE !== "undefined") {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create Particles (Adapt density for mobile performance)
        const particlesGeometry = new THREE.BufferGeometry();
        const isMobile = window.innerWidth <= 768;
        const particlesCount = isMobile ? 1000 : 2200;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 6;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        // Material
        const particlesMaterial = new THREE.PointsMaterial({
            size: isMobile ? 0.007 : 0.005,
            color: '#3b82f6', // Electric Blue
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        // Mesh
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

