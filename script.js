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

    // --- 14. Interactive Project Category Filters ---
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card, .project-card-3d');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // --- 15. Cyberpunk Command Palette (Cmd + K / Ctrl + K) ---
    const cmdKTrigger = document.getElementById('cmd-k-trigger');
    const cmdKModal = document.getElementById('cmd-k-modal');
    const cmdKInput = document.getElementById('cmd-k-input');
    const cmdKResults = document.getElementById('cmd-k-results');

    const commandsList = [
        { title: 'Go to Home', icon: 'bx-home-alt', type: 'Navigate', action: () => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }) },
        { title: 'Go to Technical Toolkit (3D)', icon: 'bx-code-curly', type: 'Navigate', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
        { title: 'Go to Work Experience', icon: 'bx-briefcase', type: 'Navigate', action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
        { title: 'Go to Community & Leadership', icon: 'bx-group', type: 'Navigate', action: () => document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' }) },
        { title: 'Go to Core Services (3D)', icon: 'bx-layer', type: 'Navigate', action: () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }) },
        { title: 'Go to Featured Projects', icon: 'bx-folder', type: 'Navigate', action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
        { title: 'Project: NX-913 Platform (Flagship)', icon: 'bx-star', type: 'Project', action: () => window.open('https://nx-913.com', '_blank') },
        { title: 'Project: Veda-AI Academic Platform', icon: 'bx-brain', type: 'Project', action: () => window.open('https://veda-ai-frontend-liard.vercel.app', '_blank') },
        { title: 'Project: TradeJack Trading Terminal', icon: 'bx-candlestick', type: 'Project', action: () => window.open('https://github.com/VivekGitNinja/TradeJack', '_blank') },
        { title: 'Project: Multi-Disease AI Predictor', icon: 'bx-plus-medical', type: 'Project', action: () => window.open('https://github.com/VivekGitNinja/Medical-Diagnosis-using-Ai-main', '_blank') },
        { title: 'Project: E-Commerce Multivendor Platform', icon: 'bx-shopping-bag', type: 'Project', action: () => window.open('https://github.com/VivekGitNinja/Ecommerce-Multivendor', '_blank') },
        { title: 'Project: Real Estate Management System', icon: 'bxs-home-alt-2', type: 'Project', action: () => window.open('https://github.com/VivekGitNinja/Real-Estate-management-system', '_blank') },
        { title: 'Project: Movie Buff Central', icon: 'bx-film', type: 'Project', action: () => window.open('https://vivekgitninja.github.io/Movie-Buff-Central/', '_blank') },
        { title: 'Project: Cricket Legends Hub', icon: 'bx-bar-chart-alt-2', type: 'Project', action: () => window.open('https://github.com/VivekGitNinja/Cricket-Legends-Hub', '_blank') },
        { title: 'Project: Faculty Book System', icon: 'bxl-java', type: 'Project', action: () => window.open('https://vivekgitninja.github.io/Faculty-Book-System/', '_blank') },
        { title: 'Go to Certifications Vault', icon: 'bx-award', type: 'Navigate', action: () => document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' }) },
        { title: 'Go to Contact Uplink', icon: 'bx-envelope', type: 'Navigate', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
        { title: 'Download Resume PDF', icon: 'bx-download', type: 'Download', action: () => window.open('./assets/VIVEK KUMAR VERMA__Resume.pdf', '_blank') },
        { title: 'Copy Email to Clipboard', icon: 'bx-copy', type: 'Action', action: () => { navigator.clipboard.writeText('vkumarverma670@gmail.com'); alert('Email vkumarverma670@gmail.com copied to clipboard!'); } },
        { title: 'Visit GitHub Profile', icon: 'bxl-github', type: 'External', action: () => window.open('https://github.com/VivekGitNinja', '_blank') },
        { title: 'Visit LinkedIn Profile', icon: 'bxl-linkedin', type: 'External', action: () => window.open('https://www.linkedin.com/in/vivekumarverma', '_blank') }
    ];

    let selectedCmdIndex = 0;

    function renderCmdResults(query = '') {
        if (!cmdKResults) return;
        cmdKResults.innerHTML = '';
        const filtered = commandsList.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));

        if (filtered.length === 0) {
            cmdKResults.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: #94a3b8; font-size: 1.4rem;">No matching commands found.</div>';
            return;
        }

        filtered.forEach((cmd, idx) => {
            const item = document.createElement('div');
            item.className = `cmd-k-item ${idx === selectedCmdIndex ? 'selected' : ''}`;
            item.innerHTML = `
                <div class="cmd-k-item-left">
                    <i class="bx ${cmd.icon}"></i>
                    <span>${cmd.title}</span>
                </div>
                <span class="cmd-k-shortcut">${cmd.type}</span>
            `;
            item.addEventListener('click', () => {
                cmd.action();
                closeCmdK();
            });
            cmdKResults.appendChild(item);
        });
    }

    function openCmdK() {
        if (cmdKModal) {
            cmdKModal.classList.add('active');
            cmdKInput.value = '';
            selectedCmdIndex = 0;
            renderCmdResults();
            setTimeout(() => cmdKInput?.focus(), 100);
        }
    }

    function closeCmdK() {
        if (cmdKModal) {
            cmdKModal.classList.remove('active');
        }
    }

    if (cmdKTrigger) cmdKTrigger.addEventListener('click', openCmdK);

    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (cmdKModal?.classList.contains('active')) {
                closeCmdK();
            } else {
                openCmdK();
            }
        } else if (e.key === 'Escape' && cmdKModal?.classList.contains('active')) {
            closeCmdK();
        }
    });

    if (cmdKModal) {
        cmdKModal.addEventListener('click', (e) => {
            if (e.target === cmdKModal) closeCmdK();
        });
    }

    if (cmdKInput) {
        cmdKInput.addEventListener('input', (e) => {
            selectedCmdIndex = 0;
            renderCmdResults(e.target.value);
        });

        cmdKInput.addEventListener('keydown', (e) => {
            const items = cmdKResults?.querySelectorAll('.cmd-k-item');
            if (!items || items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedCmdIndex = (selectedCmdIndex + 1) % items.length;
                renderCmdResults(cmdKInput.value);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedCmdIndex = (selectedCmdIndex - 1 + items.length) % items.length;
                renderCmdResults(cmdKInput.value);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const query = cmdKInput.value;
                const filtered = commandsList.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));
                if (filtered[selectedCmdIndex]) {
                    filtered[selectedCmdIndex].action();
                    closeCmdK();
                }
            }
        });
    }

    // --- 16. Project Quick View Modal Controller ---
    const projectQuickViewBtns = document.querySelectorAll('.project-quickview-btn');
    const projectModal = document.getElementById('project-modal');
    const projectModalClose = document.getElementById('project-modal-close');
    const projectModalBody = document.getElementById('project-modal-body');

    const projectDataMap = {
        '1': {
            title: 'NX-913 Event & Hackathon Platform',
            category: 'Full-Stack · AI-Powered Flagship Platform',
            img: 'assets/project_nx913.jpg',
            desc: 'Production-ready event management platform with RBAC authentication, Redis caching, BullMQ background queues, and Gemini 1.5 Pro RAG assistance. Achieved 100 SEO on Lighthouse.',
            features: [
                'Next.js 15 App Router & React interactive frontend',
                'RESTful APIs with JWT & Role-Based Access Control',
                'MongoDB data models with Redis caching & BullMQ queues',
                'Gemini 1.5 Pro AI RAG assistance with multi-provider failover'
            ],
            live: 'https://nx-913.com',
            github: 'https://github.com/VivekGitNinja'
        },
        '2': {
            title: 'Veda-AI Academic Assessment Creator',
            category: 'AI Academic Assessment Platform',
            img: 'assets/project_veda_ai.jpg',
            desc: 'Full-stack AI assessment & question paper creator platform built with Next.js 16, TypeScript, Node.js, MongoDB, Redis + BullMQ queues, WebSockets, and Google Gemini RAG API.',
            features: [
                'Next.js 16 (App Router, Turbopack) & TypeScript monorepo',
                'BullMQ queue background worker & WebSockets real-time pipeline',
                'Google Gemini RAG paper generator with mock fallback',
                'A4 PDF export via jsPDF & institutional branding'
            ],
            live: 'https://veda-ai-frontend-liard.vercel.app',
            github: 'https://github.com/VivekGitNinja/Veda-AI'
        },
        '3': {
            title: 'TradeJack Trading Terminal',
            category: 'Full-Stack Fintech Terminal',
            img: 'assets/project_tradejack.jpg',
            desc: 'High-frequency trading terminal interface featuring live order books, portfolio trackers, technical indicators, and order entries.',
            features: [
                'Real-time order book & position tracker',
                'Technical market indicators (RSI, MACD, Bollinger Bands)',
                'Modular financial API integration'
            ],
            live: 'https://github.com/VivekGitNinja/TradeJack',
            github: 'https://github.com/VivekGitNinja/TradeJack'
        },
        '4': {
            title: 'Multi-Disease Prediction System',
            category: 'Machine Learning · AI Web App',
            img: 'assets/project_disease.jpg',
            desc: 'Interactive ML web application for early risk prediction of diabetes, heart disease, and Parkinson’s using scikit-learn models and Streamlit.',
            features: [
                'Trained Classification Models (Support Vector Classifier / Logistic Regression)',
                'Real-time user parameter inference pipeline',
                'Clean interactive Streamlit dashboard'
            ],
            live: 'https://github.com/VivekGitNinja/Medical-Diagnosis-using-Ai-main',
            github: 'https://github.com/VivekGitNinja/Medical-Diagnosis-using-Ai-main'
        },
        '5': {
            title: 'E-Commerce Multivendor Platform',
            category: 'Full-Stack · E-Commerce Platform',
            img: 'assets/project_ecommerce.jpg',
            desc: 'Multivendor e-commerce application supporting buyer/seller portals, product management, order processing, and administrative dashboards.',
            features: [
                'Modular PHP & MySQLi backend architecture',
                'Multi-role access (Sellers, Buyers, Admin)',
                'Responsive Bootstrap storefront UI'
            ],
            live: 'https://github.com/VivekGitNinja/Ecommerce-Multivendor',
            github: 'https://github.com/VivekGitNinja/Ecommerce-Multivendor'
        },
        '6': {
            title: 'Real Estate Management System',
            category: 'Full-Stack Web Application',
            img: 'assets/project_realestate.jpg',
            desc: 'Full-stack property listing and real estate portal with search filtering, agent inquiries, and admin property management.',
            features: [
                'React frontend with Node.js & Express REST API',
                'Dynamic search & price range filtering',
                'MongoDB property database'
            ],
            live: 'https://github.com/VivekGitNinja/Real-Estate-management-system',
            github: 'https://github.com/VivekGitNinja/Real-Estate-management-system'
        },
        '7': {
            title: 'Movie Buff Central',
            category: 'Interactive Web Application',
            img: 'assets/project_moviebuff.jpg',
            desc: 'Immersive movie discovery portal featuring trailer embeds, movie trivia, daily quotes, and REST API integration.',
            features: [
                'Third-party Movie API integration',
                'Interactive trailer popup modal',
                'Responsive CSS Grid layout'
            ],
            live: 'https://vivekgitninja.github.io/Movie-Buff-Central/',
            github: 'https://github.com/VivekGitNinja/Movie-Buff-Central'
        },
        '8': {
            title: 'Cricket Legends Hub',
            category: 'Data Visualization & Analytics',
            img: 'assets/project_cricket.jpg',
            desc: 'Data visualization web portal providing interactive player statistics, career charts, and match analytics.',
            features: [
                'Interactive statistical charts and timelines',
                'Career records and milestone highlights'
            ],
            live: 'https://github.com/VivekGitNinja/Cricket-Legends-Hub',
            github: 'https://github.com/VivekGitNinja/Cricket-Legends-Hub'
        },
        '9': {
            title: 'Faculty Book Management System',
            category: 'Java Desktop GUI Application',
            img: 'assets/project_faculty.jpg',
            desc: 'Desktop GUI application engineered in Java Swing and MySQL for academic book cataloging, issuing records, and faculty authentication.',
            features: [
                'Java Swing GUI desktop interface',
                'MySQL relational database integration',
                'Book issuing and catalog search records'
            ],
            live: 'https://vivekgitninja.github.io/Faculty-Book-System/',
            github: 'https://github.com/VivekGitNinja/Faculty-Book-System'
        }
    };

    projectQuickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-project');
            const data = projectDataMap[id];
            if (data && projectModalBody) {
                projectModalBody.innerHTML = `
                    <span class="modal-proj-cat">${data.category}</span>
                    <h2 class="modal-proj-title">${data.title}</h2>
                    <img src="${data.img}" alt="${data.title}" class="modal-proj-img">
                    <p class="modal-proj-desc">${data.desc}</p>
                    <ul class="modal-proj-features">
                        ${data.features.map(f => `<li><i class="bx bx-check-circle"></i> ${f}</li>`).join('')}
                    </ul>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <a href="${data.live}" target="_blank" rel="noopener noreferrer" class="project-live-btn">Launch Live Application <i class="bx bx-link-external"></i></a>
                        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="project-github-btn">GitHub Repository <i class="bx bxl-github"></i></a>
                    </div>
                `;
                projectModal?.classList.add('active');
            }
        });
    });

    if (projectModalClose) {
        projectModalClose.addEventListener('click', () => projectModal?.classList.remove('active'));
    }
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) projectModal.classList.remove('active');
        });
    }

    // --- 17. Certificate Full-Screen Preview Modal Controller ---
    const certCards = document.querySelectorAll('.cert-card');
    const certModal = document.getElementById('cert-modal');
    const certModalClose = document.getElementById('cert-modal-close');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalCaption = document.getElementById('cert-modal-caption');

    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const title = card.querySelector('h3')?.innerText || 'Certification';
            const issuer = card.querySelector('.cert-issuer')?.innerText || '';

            if (img && certModalImg) {
                certModalImg.src = img.src;
                if (certModalCaption) certModalCaption.innerText = `${title} (${issuer})`;
                certModal?.classList.add('active');
            }
        });
    });

    if (certModalClose) {
        certModalClose.addEventListener('click', () => certModal?.classList.remove('active'));
    }
    if (certModal) {
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) certModal.classList.remove('active');
        });
    }
});
