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
