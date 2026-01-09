/**
 * ChronicSoreness - Main JavaScript
 * Mobile-first interactive features
 */

(function() {
    'use strict';

    // DOM Elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-menu a');

    /**
     * Mobile Menu Toggle
     */
    function initMobileMenu() {
        if (!mobileMenuToggle || !navMenu) return;

        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Header scroll effect
     */
    function initHeaderScroll() {
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without scrolling
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    /**
     * Active navigation highlighting
     */
    function initActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage ||
                (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Intersection Observer for animations
     */
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;

        const animatedElements = document.querySelectorAll(
            '.faq-card, .condition-card, .pillar, .story-card, .resource-card'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            el.classList.add('animate-prepare');
            observer.observe(el);
        });
    }

    /**
     * Newsletter form handling
     */
    function initNewsletter() {
        const form = document.querySelector('.newsletter-form');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            // Show success message
            const button = this.querySelector('button');
            const originalText = button.textContent;
            button.textContent = 'Thank you!';
            button.disabled = true;

            // Reset after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                this.reset();
            }, 3000);

            // In production, you would send this to your backend
            console.log('Newsletter signup:', email);
        });
    }

    /**
     * FAQ accordion functionality for content pages
     */
    function initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-accordion-item');

        faqItems.forEach(item => {
            const trigger = item.querySelector('.faq-trigger');
            const content = item.querySelector('.faq-content');

            if (trigger && content) {
                trigger.addEventListener('click', function() {
                    const isOpen = this.getAttribute('aria-expanded') === 'true';
                    this.setAttribute('aria-expanded', !isOpen);
                    content.hidden = isOpen;
                });
            }
        });
    }

    /**
     * Reading progress indicator for content pages
     */
    function initReadingProgress() {
        const progressBar = document.querySelector('.reading-progress');
        if (!progressBar) return;

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = progress + '%';
        }, { passive: true });
    }

    /**
     * Social Sharing Buttons
     */
    function initShareButtons() {
        const pageUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(document.title);
        const pageDescription = encodeURIComponent(
            document.querySelector('meta[name="description"]')?.content || ''
        );

        // Handle social share clicks
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', async function(e) {
                const type = this.dataset.share;
                const url = this.dataset.url ? encodeURIComponent(this.dataset.url) : pageUrl;
                const title = this.dataset.title ? encodeURIComponent(this.dataset.title) : pageTitle;

                let shareUrl;
                switch (type) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
                        break;
                    case 'pinterest':
                        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`;
                        break;
                    case 'email':
                        shareUrl = `mailto:?subject=${title}&body=I thought you might find this helpful: ${url}`;
                        window.location.href = shareUrl;
                        return;
                    case 'copy':
                        e.preventDefault();
                        try {
                            await navigator.clipboard.writeText(decodeURIComponent(url));
                            const originalText = this.innerHTML;
                            this.innerHTML = '<span aria-hidden="true">&#10003;</span> Copied!';
                            this.classList.add('copied');
                            setTimeout(() => {
                                this.innerHTML = originalText;
                                this.classList.remove('copied');
                            }, 2000);
                        } catch (err) {
                            console.error('Failed to copy:', err);
                        }
                        return;
                    case 'native':
                        e.preventDefault();
                        if (navigator.share) {
                            try {
                                await navigator.share({
                                    title: decodeURIComponent(title),
                                    url: decodeURIComponent(url)
                                });
                            } catch (err) {
                                console.log('Share cancelled');
                            }
                        }
                        return;
                    default:
                        return;
                }

                if (shareUrl) {
                    e.preventDefault();
                    window.open(shareUrl, 'share', 'width=600,height=400,location=no,menubar=no');
                }
            });
        });

        // Inject share section on content pages
        injectShareSection();
    }

    /**
     * Inject share section at bottom of content pages
     */
    function injectShareSection() {
        const mainContent = document.querySelector('main');
        const isContentPage = document.querySelector('.content-section, .page-header');
        const existingShareSection = document.querySelector('.share-section');

        if (!mainContent || !isContentPage || existingShareSection) return;

        const shareSection = document.createElement('div');
        shareSection.className = 'share-section';
        shareSection.innerHTML = `
            <h3>Share This Resource</h3>
            <p style="color: var(--color-text-light); margin-bottom: 1rem;">Help others discover this information</p>
            <div class="share-buttons">
                <button class="share-btn share-btn--facebook" data-share="facebook" aria-label="Share on Facebook">
                    <span aria-hidden="true">f</span> Facebook
                </button>
                <button class="share-btn share-btn--twitter" data-share="twitter" aria-label="Share on X/Twitter">
                    <span aria-hidden="true">&#120143;</span> Twitter
                </button>
                <button class="share-btn share-btn--linkedin" data-share="linkedin" aria-label="Share on LinkedIn">
                    <span aria-hidden="true">in</span> LinkedIn
                </button>
                <button class="share-btn share-btn--pinterest" data-share="pinterest" aria-label="Share on Pinterest">
                    <span aria-hidden="true">P</span> Pinterest
                </button>
                <button class="share-btn share-btn--email" data-share="email" aria-label="Share via Email">
                    <span aria-hidden="true">&#9993;</span> Email
                </button>
                <button class="share-btn share-btn--copy" data-share="copy" aria-label="Copy link">
                    <span aria-hidden="true">&#128279;</span> Copy Link
                </button>
            </div>
        `;

        // Insert before footer or at end of main
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.parentNode.insertBefore(shareSection, footer);
        } else {
            mainContent.appendChild(shareSection);
        }

        // Re-init share buttons for the new section
        shareSection.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', async function(e) {
                const type = this.dataset.share;
                const pageUrl = encodeURIComponent(window.location.href);
                const pageTitle = encodeURIComponent(document.title);

                let shareUrl;
                switch (type) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}`;
                        break;
                    case 'pinterest':
                        shareUrl = `https://pinterest.com/pin/create/button/?url=${pageUrl}&description=${pageTitle}`;
                        break;
                    case 'email':
                        window.location.href = `mailto:?subject=${pageTitle}&body=I thought you might find this helpful: ${pageUrl}`;
                        return;
                    case 'copy':
                        e.preventDefault();
                        try {
                            await navigator.clipboard.writeText(window.location.href);
                            const originalText = this.innerHTML;
                            this.innerHTML = '<span aria-hidden="true">&#10003;</span> Copied!';
                            this.classList.add('copied');
                            setTimeout(() => {
                                this.innerHTML = originalText;
                                this.classList.remove('copied');
                            }, 2000);
                        } catch (err) {
                            console.error('Failed to copy:', err);
                        }
                        return;
                }
                if (shareUrl) {
                    e.preventDefault();
                    window.open(shareUrl, 'share', 'width=600,height=400,location=no,menubar=no');
                }
            });
        });
    }

    /**
     * Calculate and display reading time
     */
    function initReadingTime() {
        const contentSections = document.querySelectorAll('.content-section');
        const pageHeader = document.querySelector('.page-header');

        if (contentSections.length === 0 || !pageHeader) return;

        // Calculate word count from all content sections
        let wordCount = 0;
        contentSections.forEach(section => {
            const text = section.textContent || '';
            wordCount += text.trim().split(/\s+/).filter(word => word.length > 0).length;
        });

        // Average reading speed: 200-250 words per minute
        const readingSpeed = 225;
        const minutes = Math.ceil(wordCount / readingSpeed);

        // Create reading time element
        const readingTimeEl = document.createElement('div');
        readingTimeEl.className = 'reading-time';
        readingTimeEl.innerHTML = `${minutes} min read`;

        // Insert after page header title
        const pageHeaderContent = pageHeader.querySelector('.container');
        if (pageHeaderContent) {
            const title = pageHeaderContent.querySelector('h1');
            if (title && title.nextSibling) {
                title.parentNode.insertBefore(readingTimeEl, title.nextSibling);
            } else if (title) {
                pageHeaderContent.appendChild(readingTimeEl);
            }
        }
    }

    /**
     * Table of contents highlighting
     */
    function initTableOfContents() {
        const toc = document.querySelector('.table-of-contents');
        if (!toc) return;

        const headings = document.querySelectorAll('.content-section h2[id], .content-section h3[id]');
        const tocLinks = toc.querySelectorAll('a');

        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    tocLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, {
            rootMargin: '-20% 0px -80% 0px'
        });

        headings.forEach(heading => observer.observe(heading));
    }

    /**
     * Lazy loading images
     */
    function initLazyLoading() {
        if (!('IntersectionObserver' in window)) return;

        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    /**
     * Dark mode theme toggle
     */
    function initThemeToggle() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        themeToggle.innerHTML = `
            <span class="icon-sun" aria-hidden="true">&#9728;</span>
            <span class="icon-moon" aria-hidden="true">&#9790;</span>
        `;
        document.body.appendChild(themeToggle);

        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (systemPrefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        // Toggle theme on click
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Announce change for screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'visually-hidden';
            announcement.textContent = `Switched to ${newTheme} mode`;
            document.body.appendChild(announcement);
            setTimeout(() => announcement.remove(), 1000);
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }

    /**
     * Back to top button
     */
    function initBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.innerHTML = '&uarr;';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: var(--color-bg-alt);
            border: 1px solid var(--color-bg-dark);
            color: var(--color-text);
            font-size: 1.25rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
            z-index: 998;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;
        document.body.appendChild(backToTop);

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        }, { passive: true });

        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /**
     * Site Search functionality
     */
    function initSiteSearch() {
        // Site search data - all pages and their content keywords
        const searchData = [
            {
                title: 'Home',
                url: 'index.html',
                description: 'Comprehensive resources for women living with chronic pain conditions',
                category: 'Main',
                keywords: ['home', 'chronic pain', 'women', 'support', 'resources']
            },
            {
                title: 'Chronic Pain Conditions',
                url: 'conditions.html',
                description: 'Learn about fibromyalgia, endometriosis, chronic fatigue syndrome, and more',
                category: 'Conditions',
                keywords: ['fibromyalgia', 'endometriosis', 'chronic fatigue', 'CFS', 'ME', 'pelvic pain', 'autoimmune', 'lupus', 'migraine', 'conditions', 'diagnosis']
            },
            {
                title: 'Treatment Options',
                url: 'treatments.html',
                description: 'Medical treatments, physical therapies, and integrative approaches for chronic pain',
                category: 'Treatments',
                keywords: ['treatment', 'medication', 'therapy', 'physical therapy', 'massage', 'acupuncture', 'CBD', 'opioids', 'pain management', 'doctor']
            },
            {
                title: 'Lifestyle Management',
                url: 'lifestyle.html',
                description: 'Pacing, exercise, sleep, nutrition, and stress management strategies',
                category: 'Lifestyle',
                keywords: ['lifestyle', 'pacing', 'exercise', 'sleep', 'nutrition', 'diet', 'stress', 'management', 'self-care', 'energy']
            },
            {
                title: 'Resources & Tools',
                url: 'resources.html',
                description: 'Symptom trackers, doctor guides, apps, and support communities',
                category: 'Resources',
                keywords: ['resources', 'tools', 'tracker', 'diary', 'apps', 'community', 'support group', 'doctor', 'guide']
            },
            {
                title: 'Symptom Checker',
                url: 'symptom-checker.html',
                description: 'Interactive quiz to help identify potential chronic pain conditions',
                category: 'Tools',
                keywords: ['symptom', 'checker', 'quiz', 'assessment', 'diagnosis', 'identify', 'condition']
            },
            {
                title: 'Medical Glossary',
                url: 'glossary.html',
                description: 'Definitions of medical terms related to chronic pain conditions',
                category: 'Resources',
                keywords: ['glossary', 'terms', 'definitions', 'medical', 'vocabulary', 'dictionary']
            },
            {
                title: 'Symptom Diary',
                url: 'symptom-diary.html',
                description: 'Printable daily symptom tracking template',
                category: 'Tools',
                keywords: ['diary', 'tracker', 'log', 'daily', 'printable', 'template', 'record']
            },
            {
                title: 'FAQ',
                url: 'faq.html',
                description: 'Frequently asked questions about chronic pain conditions and management',
                category: 'Support',
                keywords: ['faq', 'questions', 'answers', 'help', 'common', 'frequently asked']
            },
            {
                title: 'Crisis & Emergency Resources',
                url: 'crisis-resources.html',
                description: 'Immediate help for pain crises, mental health emergencies, and urgent support',
                category: 'Support',
                keywords: ['crisis', 'emergency', 'help', 'hotline', 'suicide', 'mental health', '988', 'urgent']
            },
            {
                title: 'About Us',
                url: 'about.html',
                description: 'Our mission, values, and commitment to the chronic pain community',
                category: 'About',
                keywords: ['about', 'mission', 'team', 'privacy', 'disclaimer']
            },
            {
                title: 'Contact Us',
                url: 'contact.html',
                description: 'Get in touch with ChronicSoreness. Submit questions, feedback, or share your story',
                category: 'About',
                keywords: ['contact', 'email', 'feedback', 'message', 'question', 'story', 'partnership']
            },
            {
                title: 'Accessibility',
                url: 'accessibility.html',
                description: 'Our commitment to digital accessibility and WCAG compliance',
                category: 'About',
                keywords: ['accessibility', 'WCAG', 'screen reader', 'keyboard', 'disability', 'accessible']
            }
        ];

        // Create search function
        function searchSite(query) {
            if (!query || query.length < 2) return [];

            const searchTerms = query.toLowerCase().split(/\s+/);

            return searchData
                .map(item => {
                    let score = 0;
                    const titleLower = item.title.toLowerCase();
                    const descLower = item.description.toLowerCase();
                    const keywordsStr = item.keywords.join(' ').toLowerCase();

                    searchTerms.forEach(term => {
                        if (titleLower.includes(term)) score += 10;
                        if (descLower.includes(term)) score += 5;
                        if (keywordsStr.includes(term)) score += 3;
                    });

                    return { ...item, score };
                })
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, 6);
        }

        // Inject search into header on desktop
        const nav = document.querySelector('.nav, .nav-container');
        if (nav) {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'header-search search-container';
            searchContainer.innerHTML = `
                <div class="search-input-wrapper">
                    <span class="search-icon" aria-hidden="true">&#128269;</span>
                    <input type="search" class="search-input" placeholder="Search..." aria-label="Search site">
                    <div class="search-results" role="listbox" aria-label="Search results"></div>
                </div>
            `;

            // Insert before nav menu
            const navMenu = nav.querySelector('.nav-menu');
            if (navMenu) {
                nav.insertBefore(searchContainer, navMenu);
            }

            const searchInput = searchContainer.querySelector('.search-input');
            const searchResults = searchContainer.querySelector('.search-results');

            let debounceTimer;
            searchInput.addEventListener('input', function() {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    const results = searchSite(this.value);

                    if (this.value.length < 2) {
                        searchResults.classList.remove('active');
                        return;
                    }

                    if (results.length === 0) {
                        searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
                    } else {
                        searchResults.innerHTML = results.map(item => `
                            <div class="search-result-item">
                                <a href="${item.url}">
                                    <div class="search-result-title">${item.title}</div>
                                    <div class="search-result-description">${item.description}</div>
                                    <div class="search-result-category">${item.category}</div>
                                </a>
                            </div>
                        `).join('');
                    }

                    searchResults.classList.add('active');
                }, 200);
            });

            // Close results on click outside
            document.addEventListener('click', function(e) {
                if (!searchContainer.contains(e.target)) {
                    searchResults.classList.remove('active');
                }
            });

            // Keyboard navigation
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    searchResults.classList.remove('active');
                    this.blur();
                }
            });
        }
    }

    /**
     * Breadcrumb navigation
     */
    function initBreadcrumbs() {
        const pageHeader = document.querySelector('.page-header');
        if (!pageHeader) return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Define breadcrumb structure
        const breadcrumbMap = {
            'conditions.html': { name: 'Conditions', parent: null },
            'treatments.html': { name: 'Treatments', parent: null },
            'lifestyle.html': { name: 'Lifestyle', parent: null },
            'resources.html': { name: 'Resources', parent: null },
            'about.html': { name: 'About', parent: null },
            'faq.html': { name: 'FAQ', parent: null },
            'contact.html': { name: 'Contact', parent: { url: 'about.html', name: 'About' } },
            'accessibility.html': { name: 'Accessibility', parent: { url: 'about.html', name: 'About' } },
            'symptom-checker.html': { name: 'Symptom Checker', parent: { url: 'resources.html', name: 'Resources' } },
            'glossary.html': { name: 'Glossary', parent: { url: 'resources.html', name: 'Resources' } },
            'symptom-diary.html': { name: 'Symptom Diary', parent: { url: 'resources.html', name: 'Resources' } },
            'crisis-resources.html': { name: 'Crisis Resources', parent: { url: 'resources.html', name: 'Resources' } }
        };

        const pageInfo = breadcrumbMap[currentPage];
        if (!pageInfo) return;

        // Build breadcrumb
        const breadcrumb = document.createElement('nav');
        breadcrumb.className = 'breadcrumb';
        breadcrumb.setAttribute('aria-label', 'Breadcrumb');

        let breadcrumbHTML = `
            <ol class="breadcrumb-list" itemscope itemtype="https://schema.org/BreadcrumbList">
                <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <a href="index.html" itemprop="item"><span itemprop="name">Home</span></a>
                    <meta itemprop="position" content="1">
                </li>
        `;

        let position = 2;
        if (pageInfo.parent) {
            breadcrumbHTML += `
                <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <a href="${pageInfo.parent.url}" itemprop="item"><span itemprop="name">${pageInfo.parent.name}</span></a>
                    <meta itemprop="position" content="${position}">
                </li>
            `;
            position++;
        }

        breadcrumbHTML += `
                <li class="breadcrumb-item active" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <span itemprop="name">${pageInfo.name}</span>
                    <meta itemprop="position" content="${position}">
                </li>
            </ol>
        `;

        breadcrumb.innerHTML = breadcrumbHTML;

        // Insert before page header
        pageHeader.parentNode.insertBefore(breadcrumb, pageHeader);

        // Wrap in container
        const container = document.createElement('div');
        container.className = 'container';
        container.appendChild(breadcrumb.querySelector('.breadcrumb-list'));
        breadcrumb.innerHTML = '';
        breadcrumb.appendChild(container);
    }

    /**
     * Related content suggestions
     */
    function initRelatedContent() {
        const mainContent = document.querySelector('main');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Don't show on home page or if no main content
        if (!mainContent || currentPage === 'index.html' || currentPage === '') return;

        // Related content mapping
        const relatedMap = {
            'conditions.html': [
                { url: 'symptom-checker.html', title: 'Symptom Checker', description: 'Take our interactive quiz to identify potential conditions', category: 'Tool' },
                { url: 'treatments.html', title: 'Treatment Options', description: 'Explore medical and integrative treatment approaches', category: 'Guide' },
                { url: 'glossary.html', title: 'Medical Glossary', description: 'Understand the terminology used by healthcare providers', category: 'Resource' }
            ],
            'treatments.html': [
                { url: 'conditions.html', title: 'Conditions Guide', description: 'Learn about specific chronic pain conditions', category: 'Guide' },
                { url: 'lifestyle.html', title: 'Lifestyle Management', description: 'Complementary strategies for pain management', category: 'Guide' },
                { url: 'resources.html', title: 'Resources & Tools', description: 'Find trackers, guides, and support communities', category: 'Resource' }
            ],
            'lifestyle.html': [
                { url: 'treatments.html', title: 'Treatment Options', description: 'Medical and therapeutic treatment approaches', category: 'Guide' },
                { url: 'symptom-diary.html', title: 'Symptom Diary', description: 'Track your symptoms and identify patterns', category: 'Tool' },
                { url: 'faq.html', title: 'FAQ', description: 'Common questions about managing chronic pain', category: 'Support' }
            ],
            'resources.html': [
                { url: 'symptom-checker.html', title: 'Symptom Checker', description: 'Interactive assessment tool', category: 'Tool' },
                { url: 'glossary.html', title: 'Medical Glossary', description: 'Definitions of medical terms', category: 'Resource' },
                { url: 'crisis-resources.html', title: 'Crisis Resources', description: 'Emergency support and hotlines', category: 'Support' }
            ],
            'symptom-checker.html': [
                { url: 'conditions.html', title: 'Conditions Guide', description: 'Detailed information about chronic pain conditions', category: 'Guide' },
                { url: 'treatments.html', title: 'Treatment Options', description: 'Explore your treatment options', category: 'Guide' },
                { url: 'resources.html', title: 'Resources', description: 'Tools and support for your journey', category: 'Resource' }
            ],
            'glossary.html': [
                { url: 'conditions.html', title: 'Conditions', description: 'Learn about specific conditions in depth', category: 'Guide' },
                { url: 'faq.html', title: 'FAQ', description: 'Answers to common questions', category: 'Support' }
            ],
            'symptom-diary.html': [
                { url: 'lifestyle.html', title: 'Lifestyle Tips', description: 'Strategies for daily management', category: 'Guide' },
                { url: 'resources.html', title: 'More Tools', description: 'Additional tracking and support resources', category: 'Resource' }
            ],
            'faq.html': [
                { url: 'conditions.html', title: 'Conditions', description: 'Detailed condition information', category: 'Guide' },
                { url: 'treatments.html', title: 'Treatments', description: 'Treatment options and approaches', category: 'Guide' },
                { url: 'crisis-resources.html', title: 'Crisis Support', description: 'Immediate help when you need it', category: 'Support' }
            ],
            'crisis-resources.html': [
                { url: 'faq.html', title: 'FAQ', description: 'Common questions and answers', category: 'Support' },
                { url: 'resources.html', title: 'Resources', description: 'Additional support tools', category: 'Resource' }
            ],
            'about.html': [
                { url: 'contact.html', title: 'Contact Us', description: 'Get in touch with questions or feedback', category: 'About' },
                { url: 'faq.html', title: 'FAQ', description: 'Frequently asked questions', category: 'Support' },
                { url: 'accessibility.html', title: 'Accessibility', description: 'Our accessibility commitment', category: 'About' }
            ],
            'contact.html': [
                { url: 'about.html', title: 'About Us', description: 'Learn about our mission and values', category: 'About' },
                { url: 'faq.html', title: 'FAQ', description: 'Find answers to common questions', category: 'Support' }
            ],
            'accessibility.html': [
                { url: 'about.html', title: 'About Us', description: 'Learn about our mission', category: 'About' },
                { url: 'contact.html', title: 'Contact', description: 'Report accessibility issues', category: 'About' }
            ]
        };

        const related = relatedMap[currentPage];
        if (!related || related.length === 0) return;

        // Create related content section
        const relatedSection = document.createElement('section');
        relatedSection.className = 'related-content';
        relatedSection.innerHTML = `
            <div class="container">
                <h3>Related Resources</h3>
                <div class="related-grid">
                    ${related.map(item => `
                        <a href="${item.url}" class="related-card">
                            <div class="related-card-category">${item.category}</div>
                            <div class="related-card-title">${item.title}</div>
                            <div class="related-card-description">${item.description}</div>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;

        // Insert before share section or footer
        const shareSection = document.querySelector('.share-section');
        const footer = document.querySelector('.footer');

        if (shareSection) {
            shareSection.parentNode.insertBefore(relatedSection, shareSection);
        } else if (footer) {
            footer.parentNode.insertBefore(relatedSection, footer);
        } else {
            mainContent.appendChild(relatedSection);
        }
    }

    /**
     * Initialize all features
     */
    function init() {
        initMobileMenu();
        initHeaderScroll();
        initSmoothScroll();
        initActiveNavigation();
        initScrollAnimations();
        initNewsletter();
        initFAQAccordion();
        initReadingProgress();
        initShareButtons();
        initTableOfContents();
        initLazyLoading();
        initThemeToggle();
        initBackToTop();
        initReadingTime();
        initSiteSearch();
        initBreadcrumbs();
        initRelatedContent();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Add animation CSS dynamically
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .animate-prepare {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        .header.scrolled {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(animationStyles);

})();
