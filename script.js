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

        // Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x3b82f6, 1.5);
        pointLight.position.set(0, 2, 2);
        scene.add(pointLight);

        camera.position.z = 2;

        // Mouse Parallax Interaction
        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth - 0.5) * 0.5;
            mouseY = (event.clientY / window.innerHeight - 0.5) * 0.5;
        });

        // Animation Loop
        const clock = new THREE.Clock();

        const tick = () => {
            const elapsedTime = clock.getElapsedTime();

            particlesMesh.rotation.y = elapsedTime * 0.03;
            particlesMesh.rotation.x += (mouseY - particlesMesh.rotation.x) * 0.05;
            particlesMesh.rotation.y += (mouseX - particlesMesh.rotation.y) * 0.05;

            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        };

        tick();

        // Responsive Window Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }

    // --- 5. Interactive 3D Explosive Scattering Cubes & Inner Core Controller ---
    const cubeWrappers = document.querySelectorAll('.service-cube-wrapper');
    cubeWrappers.forEach(wrapper => {
        const cube = wrapper.querySelector('.service-3d-cube');
        const hint = wrapper.querySelector('.cube-click-hint');

        function toggleScatter(e) {
            // Prevent collapsing if clicking action button inside inner core
            if (e.target.closest('.core-action-btn')) return;

            const isScattered = wrapper.classList.contains('scattered');

            // Close any other scattered cubes
            cubeWrappers.forEach(w => {
                w.classList.remove('scattered');
                const h = w.querySelector('.cube-click-hint');
                if (h) h.innerHTML = 'Click Cube to Scatter & Reveal <i class="bx bx-expand-alt"></i>';
            });

            if (!isScattered) {
                wrapper.classList.add('scattered');
                if (hint) hint.innerHTML = 'Close & Assemble Cube <i class="bx bx-collapse-alt"></i>';
            }
        }

        if (cube) cube.addEventListener('click', toggleScatter);
        if (hint) hint.addEventListener('click', toggleScatter);
    });

    const serviceCubes = document.querySelectorAll('.service-3d-cube, .tech-3d-cube');
    serviceCubes.forEach(cube => {
        let isDragging = false;
        let startX = 0, startY = 0;
        let currentRotX = 0, currentRotY = 0;

        function startDrag(e) {
            isDragging = true;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            startX = clientX;
            startY = clientY;
            cube.style.animationPlayState = 'paused';
            cube.style.cursor = 'grabbing';
        }

        function moveDrag(e) {
            if (!isDragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const deltaX = clientX - startX;
            const deltaY = clientY - startY;

            currentRotY += deltaX * 0.8;
            currentRotX -= deltaY * 0.8;

            cube.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
            startX = clientX;
            startY = clientY;
        }

        function stopDrag() {
            if (isDragging) {
                isDragging = false;
                cube.style.cursor = 'grab';
                setTimeout(() => {
                    if (!isDragging) {
                        cube.style.animationPlayState = 'running';
                    }
                }, 2500);
            }
        }

        cube.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', moveDrag);
        window.addEventListener('mouseup', stopDrag);

        cube.addEventListener('touchstart', startDrag, { passive: true });
        window.addEventListener('touchmove', moveDrag, { passive: true });
        window.addEventListener('touchend', stopDrag);
    });

    if (window.innerWidth > 768) {
        const tiltCards = document.querySelectorAll(
            '.project-card, .timeline-content, .toolkit-3d-card, .community-3d-node, .edu-card, .cert-card, .github-stat-card'
        );
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 25;
                const rotateY = (centerX - x) / 25;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                card.style.transition = 'transform 0.1s ease-out';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                card.style.transition = 'transform 0.4s ease';
            });
        });
    }

    // --- 6. Mobile Navigation & Backdrop Overlay ---
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');
    const navOverlay = document.querySelector('#nav-overlay');

    function closeMobileMenu() {
        if (menuIcon) menuIcon.classList.remove('bx-x');
        if (navbar) navbar.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
    }

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
            if (navOverlay) navOverlay.classList.toggle('active');
        });

        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', closeMobileMenu);
        }
    }

    // --- 7. Hero Section Parallax Floating Elements ---
    const homeSection = document.querySelector('.home');
    const heroLayer = document.querySelector('.hero-3d-layer');

    if (homeSection && heroLayer && window.innerWidth > 768) {
        homeSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 30;
            const y = (window.innerHeight / 2 - e.clientY) / 30;

            heroLayer.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;

            document.querySelectorAll('.floating-icon').forEach(icon => {
                const speed = parseFloat(icon.getAttribute('data-speed')) || 2;
                const xMove = (window.innerWidth / 2 - e.clientX) * (speed / 100);
                const yMove = (window.innerHeight / 2 - e.clientY) * (speed / 100);

                icon.style.transform = `translate3d(${xMove}px, ${yMove}px, 60px)`;
            });
        });

        homeSection.addEventListener('mouseleave', () => {
            heroLayer.style.transform = 'rotateY(0deg) rotateX(0deg)';
            document.querySelectorAll('.floating-icon').forEach(icon => {
                icon.style.transform = 'translate3d(0, 0, 0)';
            });
        });
    }

    // --- 8. Read More Toggle (About Section) ---
    const readMoreBtn = document.querySelector('.btn-read-more');
    const moreContent = document.querySelector('.about-more-content');

    if (readMoreBtn && moreContent) {
        readMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            moreContent.classList.toggle('active');
            const isActive = moreContent.classList.contains('active');
            readMoreBtn.innerHTML = isActive 
                ? 'Read Less <i class="bx bx-chevron-up"></i>' 
                : 'Read More <i class="bx bx-chevron-down"></i>';
        });
    }

    // --- 9. FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        if (header) {
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Close other accordion items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current item
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        }
    });

    // --- 10. Typed.js Hero Title Animation ---
    if (document.querySelector('.multiple-text') && typeof Typed !== "undefined") {
        new Typed('.multiple-text', {
            strings: [
                'Developer Relations Manager',
                'Web Developer',
                'Tech Enthusiast',
                'Full-Stack Developer'
            ],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 1600,
            loop: true
        });
    }

    // --- 11. Floating Header Capsule on Scroll ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 12. EmailJS & Direct Contact Form Handler ---
    const contactForm = document.getElementById("contact-form");
    const statusMsg = document.getElementById("status-message");

    if (contactForm) {
        if (typeof emailjs !== 'undefined') {
            try {
                emailjs.init("pxMeZnYhCPCs8V3ir");
            } catch (e) {
                console.warn("EmailJS init warning:", e);
            }
        }

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const messageInput = document.getElementById("message");

            const senderName = nameInput ? nameInput.value.trim() : '';
            const senderEmail = emailInput ? emailInput.value.trim() : '';
            const messageText = messageInput ? messageInput.value.trim() : '';

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending... <i class="bx bx-loader-alt bx-spin"></i>';
            }

            if (statusMsg) {
                statusMsg.className = 'status-loading';
                statusMsg.textContent = 'Transmitting message...';
            }

            const templateParams = {
                from_name: senderName,
                from_email: senderEmail,
                to_name: 'Vivek Kumar Verma',
                name: senderName,
                email: senderEmail,
                user_name: senderName,
                user_email: senderEmail,
                reply_to: senderEmail,
                message: messageText
            };

            const fallbackMailto = () => {
                const subject = encodeURIComponent(`Portfolio Message from ${senderName}`);
                const body = encodeURIComponent(`Name: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${messageText}`);
                window.location.href = `mailto:vkumarverma670@gmail.com?subject=${subject}&body=${body}`;

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Mail Client Opened <i class="bx bx-envelope"></i>';
                }
                if (statusMsg) {
                    statusMsg.className = 'status-success';
                    statusMsg.textContent = 'Opening your mail application... You can also email directly to vkumarverma670@gmail.com';
                }
                setTimeout(() => {
                    if (submitBtn) submitBtn.innerHTML = originalText;
                }, 4000);
            };

            if (typeof emailjs !== 'undefined') {
                emailjs.send('vivek_git5', 'template_h3r3gob', templateParams)
                    .then(() => {
                        if (submitBtn) {
                            submitBtn.innerHTML = 'Sent! <i class="bx bx-check-circle"></i>';
                        }
                        if (statusMsg) {
                            statusMsg.className = 'status-success';
                            statusMsg.textContent = 'Message successfully delivered! Vivek will get back to you shortly.';
                        }
                        contactForm.reset();

                        setTimeout(() => {
                            if (submitBtn) {
                                submitBtn.disabled = false;
                                submitBtn.innerHTML = originalText;
                            }
                            if (statusMsg) {
                                statusMsg.textContent = '';
                                statusMsg.className = '';
                            }
                        }, 5000);
                    })
                    .catch((err) => {
                        console.error('EmailJS Error, switching to mailto fallback:', err);
                        fallbackMailto();
                    });
            } else {
                fallbackMailto();
            }
        });
    }

    // --- 13. Top Scroll Progress Bar Controller ---
    window.addEventListener('scroll', () => {
        const progressBar = document.getElementById('scroll-progress-bar');
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        }
    });
