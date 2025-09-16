(function () {
        const header = document.querySelector('[data-header]');
        const nav = document.querySelector('[data-nav]');
        const navToggle = document.querySelector('.nav-toggle');
        const navBackdrop = document.querySelector('[data-nav-backdrop]');
        const scrollTopBtn = document.querySelector('.scroll-top');
        const body = document.body;

        const toggleNav = (open) => {
                if (!nav) {
                        return;
                }
                const shouldOpen = typeof open === 'boolean' ? open : !nav.classList.contains('is-open');
                nav.classList.toggle('is-open', shouldOpen);
                navToggle?.classList.toggle('is-open', shouldOpen);
                navToggle?.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
                navBackdrop?.classList.toggle('is-visible', shouldOpen);
                body.classList.toggle('no-scroll', shouldOpen);
        };

        navToggle?.addEventListener('click', () => toggleNav());
        navBackdrop?.addEventListener('click', () => toggleNav(false));

        const smoothScrollTo = (selector) => {
                if (!selector || !selector.startsWith('#')) {
                        return;
                }
                const target = document.querySelector(selector);
                if (!target) {
                        return;
                }
                const headerOffset = header ? header.offsetHeight + 8 : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        };

        const scrollTriggers = document.querySelectorAll('[data-scroll], [data-scroll-target]');
        scrollTriggers.forEach((trigger) => {
                trigger.addEventListener('click', (event) => {
                        const element = event.currentTarget;
                        const selector = element.dataset.scrollTarget || element.getAttribute('href');
                        if (!selector || !selector.startsWith('#')) {
                                return;
                        }
                        event.preventDefault();
                        toggleNav(false);
                        window.requestAnimationFrame(() => smoothScrollTo(selector));
                });
        });

        const updateHeaderState = () => {
                const isScrolled = window.scrollY > 40;
                header?.setAttribute('data-scrolled', isScrolled ? 'true' : 'false');
                if (scrollTopBtn) {
                        if (window.scrollY > 360) {
                                scrollTopBtn.classList.add('is-visible');
                        } else {
                                scrollTopBtn.classList.remove('is-visible');
                        }
                }
        };

        window.addEventListener('scroll', updateHeaderState, { passive: true });
        window.addEventListener('resize', () => {
                if (window.innerWidth > 1080) {
                        toggleNav(false);
                }
        });
        updateHeaderState();

        scrollTopBtn?.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        const navLinks = nav ? Array.from(nav.querySelectorAll('a[data-scroll]')) : [];
        const navMap = new Map();
        navLinks.forEach((link) => {
                        const href = link.getAttribute('href') || '';
                        const id = href.startsWith('#') ? href.substring(1) : '';
                        if (id) {
                                navMap.set(id, link);
                        }
        });

        const setActiveNavLink = (id) => {
                navLinks.forEach((link) => link.classList.remove('is-active'));
                const activeLink = navMap.get(id);
                if (activeLink) {
                        activeLink.classList.add('is-active');
                }
        };

        const sections = Array.from(document.querySelectorAll('[data-section]'));
        if ('IntersectionObserver' in window) {
                const sectionObserver = new IntersectionObserver(
                        (entries) => {
                                entries.forEach((entry) => {
                                        if (entry.isIntersecting) {
                                                const id = entry.target.id;
                                                if (id) {
                                                        setActiveNavLink(id);
                                                }
                                        }
                                });
                        },
                        { threshold: 0.55, rootMargin: '0px 0px -20%' }
                );
                sections.forEach((section) => {
                        if (section.id) {
                                sectionObserver.observe(section);
                        }
                });
        }

        const counters = Array.from(document.querySelectorAll('[data-counter]'));
        const animateCounter = (element) => {
                const target = Number(element.dataset.counterTarget || element.textContent || '0');
                if (!Number.isFinite(target)) {
                        return;
                }
                const duration = Number(element.dataset.counterDuration || 1600);
                const decimalsAttr = element.dataset.counterDecimals;
                const decimals = decimalsAttr ? Number(decimalsAttr) : (String(element.dataset.counterTarget || '').split('.')[1]?.length ?? 0);
                const suffix = element.dataset.counterSuffix || '';
                const prefix = element.dataset.counterPrefix || '';
                let startTimestamp;

                const step = (timestamp) => {
                        if (startTimestamp === undefined) {
                                startTimestamp = timestamp;
                        }
                        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                        const value = target * progress;
                        element.textContent = `${prefix}${value.toLocaleString('uk-UA', {
                                minimumFractionDigits: decimals,
                                maximumFractionDigits: decimals
                        })}${suffix}`;
                        if (progress < 1) {
                                window.requestAnimationFrame(step);
                        }
                };

                window.requestAnimationFrame(step);
        };

        if ('IntersectionObserver' in window) {
                const counterObserver = new IntersectionObserver(
                        (entries, observer) => {
                                entries.forEach((entry) => {
                                        if (entry.isIntersecting) {
                                                animateCounter(entry.target);
                                                observer.unobserve(entry.target);
                                        }
                                });
                        },
                        { threshold: 0.6, rootMargin: '0px 0px -10%' }
                );
                counters.forEach((counter) => counterObserver.observe(counter));
        } else {
                counters.forEach((counter) => animateCounter(counter));
        }

        const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
        const productCards = Array.from(document.querySelectorAll('.product-card'));
        let activeFilter = 'all';

        const applyFilter = (category) => {
                activeFilter = category;
                filterButtons.forEach((button) => {
                        const isActive = button.dataset.filter === category;
                        button.classList.toggle('is-active', isActive);
                        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
                });

                productCards.forEach((card) => {
                        const cardCategories = (card.dataset.category || '').split(',');
                        const shouldHide = category !== 'all' && !cardCategories.includes(category);
                        card.classList.toggle('is-hidden', shouldHide);
                });
        };

        filterButtons.forEach((button) => {
                button.addEventListener('click', () => {
                        const value = button.dataset.filter || 'all';
                        if (value !== activeFilter) {
                                applyFilter(value);
                        }
                });
        });

        if (filterButtons.length) {
                applyFilter('all');
        }

        const initSlider = (root) => {
                const slides = Array.from(root.querySelectorAll('[data-slide]'));
                if (!slides.length) {
                        return;
                }
                const prev = root.querySelector('[data-prev]');
                const next = root.querySelector('[data-next]');
                const currentLabel = root.querySelector('[data-current]');
                const totalLabel = root.querySelector('[data-total]');
                const interval = Number(root.dataset.interval || 7000);
                let index = 0;
                let timerId;

                const update = () => {
                        slides.forEach((slide, slideIndex) => {
                                slide.classList.toggle('is-active', slideIndex === index);
                        });
                        if (currentLabel) {
                                currentLabel.textContent = String(index + 1);
                        }
                        if (totalLabel) {
                                totalLabel.textContent = String(slides.length);
                        }
                };

                const goTo = (value) => {
                        index = (value + slides.length) % slides.length;
                        update();
                };

                const stop = () => {
                        if (timerId) {
                                window.clearInterval(timerId);
                                timerId = undefined;
                        }
                };

                const start = () => {
                        if (interval <= 0) {
                                return;
                        }
                        stop();
                        timerId = window.setInterval(() => {
                                goTo(index + 1);
                        }, interval);
                };

                prev?.addEventListener('click', () => {
                        goTo(index - 1);
                        start();
                });

                next?.addEventListener('click', () => {
                        goTo(index + 1);
                        start();
                });

                root.addEventListener('mouseenter', stop);
                root.addEventListener('mouseleave', start);

                update();
                start();
        };

        document.querySelectorAll('[data-slider]').forEach((slider) => initSlider(slider));

        const faqItems = Array.from(document.querySelectorAll('.faq__item'));
        faqItems.forEach((item) => {
                const button = item.querySelector('button');
                const answer = item.querySelector('.faq__answer');
                if (!button || !answer) {
                        return;
                }
                button.addEventListener('click', () => {
                        const isOpen = item.classList.toggle('is-open');
                        button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                        if (isOpen) {
                                faqItems.forEach((other) => {
                                        if (other !== item) {
                                                other.classList.remove('is-open');
                                                const otherButton = other.querySelector('button');
                                                otherButton?.setAttribute('aria-expanded', 'false');
                                        }
                                });
                        }
                });
        });

        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
                contactForm.addEventListener('submit', (event) => {
                        event.preventDefault();
                        const messageElement = contactForm.querySelector('.form-message');
                        if (messageElement) {
                                messageElement.textContent = 'Дякуємо! Ми зв\'яжемося з вами протягом 48 годин.';
                                messageElement.classList.add('is-visible');
                                window.setTimeout(() => {
                                        messageElement.classList.remove('is-visible');
                                }, 4800);
                        }
                        contactForm.reset();
                });
        }

        const footerForm = document.querySelector('.footer__form');
        if (footerForm) {
                footerForm.addEventListener('submit', (event) => {
                        event.preventDefault();
                        const existingMessage = footerForm.querySelector('.footer__message');
                        if (existingMessage) {
                                existingMessage.remove();
                        }
                        const message = document.createElement('span');
                        message.className = 'footer__message';
                        message.textContent = 'Підпис оформлено. Перевірте свою пошту.';
                        footerForm.appendChild(message);
                        const emailInput = footerForm.querySelector('input[type="email"]');
                        if (emailInput) {
                                emailInput.value = '';
                        }
                        window.setTimeout(() => {
                                message.remove();
                        }, 4200);
                });
        }
})();
