/**
 * ===================================
 * TMC PORTFOLIO - JAVASCRIPT UNIFIÉ
 * ===================================
 * Gestion centralisée des carrousels et sliders
 * pour portfolio-details-creative-slider-light.html
 */

class TMCPortfolio {
    constructor() {
        this.productsCarousels = [];
        this.backgroundSliders = [];
        this.init();
    }

    /**
     * Initialisation de l'application
     */
    init() {
        this.initLoadingScreen();
        this.initProductsCarousels();
        this.initBackgroundSliders();
        this.initPriceAnimations();
        this.initSmoothScroll();
    }

    /**
     * Gestion de l'écran de chargement
     */
    initLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        
        if (!loadingScreen) return;

        // Masquer l'écran de chargement après 2 secondes
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            
            // Supprimer complètement l'élément après l'animation
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 2000);
        
        // Masquer immédiatement si la page est déjà chargée
        if (document.readyState === 'complete') {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        // Masquer l'écran de chargement quand la page est complètement chargée
        window.addEventListener('load', () => {
            if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        });
    }

    /**
     * Initialisation de tous les carrousels de produits
     */
    initProductsCarousels() {
        const carouselSelectors = [
            '.products-carousel',
            '.calcaire-carousel',
            '.pierres-taillees-carousel',
            '.galets-decoratifs-carousel',
            '.gravier-center'
        ];

        carouselSelectors.forEach(selector => {
            const carousel = document.querySelector(selector);
            if (carousel) {
                this.createProductsCarousel(carousel);
            }
        });
    }

    /**
     * Création d'un carrousel de produits
     */
    createProductsCarousel(carouselElement) {
        const config = {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: carouselElement.querySelector('.products-pagination'),
                clickable: true,
            },
            navigation: {
                nextEl: carouselElement.querySelector('.products-nav-next'),
                prevEl: carouselElement.querySelector('.products-nav-prev'),
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                }
            },
            on: {
                slideChange: () => {
                    this.handleProductSlideChange(carouselElement);
                },
                init: () => {
                    // Afficher le prix du premier produit actif au chargement
                    setTimeout(() => {
                        this.updateActiveProductPrice(carouselElement);
                    }, 500);
                }
            }
        };

        // Configuration spéciale pour le gravier (centré)
        if (carouselElement.classList.contains('gravier-center')) {
            config.slidesPerView = 1;
            config.breakpoints = {
                768: { slidesPerView: 1 },
                992: { slidesPerView: 1 },
                1200: { slidesPerView: 1 }
            };
        }

        const swiper = new Swiper(carouselElement, config);
        this.productsCarousels.push(swiper);
    }

    /**
     * Initialisation de tous les sliders d'images de fond
     */
    initBackgroundSliders() {
        const sliderSelectors = [
            '.dolerite-slider',
            '.calcaire-slider',
            '.pierre-slider',
            '.galet-slider',
            '.gravier-slider'
        ];

        sliderSelectors.forEach(selector => {
            const slider = document.querySelector(selector);
            if (slider) {
                this.createBackgroundSlider(slider);
            }
        });
    }

    /**
     * Création d'un slider d'images de fond
     */
    createBackgroundSlider(sliderElement) {
        const config = {
            loop: true,
            speed: 1000,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false
            },
            pagination: {
                el: sliderElement.querySelector('.swiper-pagination'),
                clickable: true
            },
            navigation: {
                nextEl: sliderElement.querySelector('.swiper-button-next'),
                prevEl: sliderElement.querySelector('.swiper-button-prev')
            }
        };

        const swiper = new Swiper(sliderElement, config);
        this.backgroundSliders.push(swiper);
    }

    /**
     * Gestion du changement de slide pour les produits
     */
    handleProductSlideChange(carouselElement) {
        // Animation des cartes au changement de slide
        if (window.gsap) {
            gsap.fromTo('.swiper-slide-active .product-box',
                { scale: 0.8, opacity: 0.7 },
                { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
            );
        }
        
        // Masquer tous les prix d'abord
        const priceTags = carouselElement.querySelectorAll('.price-tag');
        priceTags.forEach(tag => {
            if (window.gsap) {
                gsap.to(tag, {
                    opacity: 0,
                    y: 0,
                    duration: 0.2,
                    ease: "power2.in"
                });
            } else {
                tag.style.opacity = '0';
                tag.style.transform = 'translateX(-50%) translateY(0)';
            }
        });
        
        // Afficher le prix du produit actif
        setTimeout(() => {
            this.updateActiveProductPrice(carouselElement);
        }, 300);
    }

    /**
     * Mise à jour du prix du produit actif
     */
    updateActiveProductPrice(carouselElement) {
        const activeSlide = carouselElement.querySelector('.swiper-slide-active');
        if (activeSlide) {
            const activePriceTag = activeSlide.querySelector('.price-tag');
            if (activePriceTag) {
                if (window.gsap) {
                    gsap.to(activePriceTag, {
                        opacity: 1,
                        y: -5,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                } else {
                    activePriceTag.style.opacity = '1';
                    activePriceTag.style.transform = 'translateX(-50%) translateY(-5px)';
                }
            }
        }
    }

    /**
     * Initialisation des animations de prix
     */
    initPriceAnimations() {
        const products = document.querySelectorAll('.product-box');

        products.forEach(product => {
            const priceTag = product.querySelector('.price-tag');
            if (!priceTag) return;

            product.addEventListener('mouseenter', () => {
                if (window.gsap) {
                    gsap.to(priceTag, {
                        opacity: 1,
                        y: -10,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                } else {
                    priceTag.style.opacity = '1';
                    priceTag.style.transform = 'translateX(-50%) translateY(-10px)';
                }
            });

            product.addEventListener('mouseleave', () => {
                // Ne masquer le prix que si ce n'est pas le produit actif
                if (!product.closest('.swiper-slide-active')) {
                    if (window.gsap) {
                        gsap.to(priceTag, {
                            opacity: 0,
                            y: 0,
                            duration: 0.3,
                            ease: "power2.in"
                        });
                    } else {
                        priceTag.style.opacity = '0';
                        priceTag.style.transform = 'translateX(-50%) translateY(0)';
                    }
                }
            });
        });
    }

    /**
     * Initialisation du défilement fluide
     */
    initSmoothScroll() {
        const scrollButtons = document.querySelectorAll('[onclick*="scrollTo"]');
        
        scrollButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Extraire l'ID de la cible depuis l'onclick
                const onclickAttr = button.getAttribute('onclick');
                const match = onclickAttr.match(/getElementById\('([^']+)'\)/);
                
                if (match) {
                    const targetId = match[1];
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = document.querySelector('header') ? 
                            document.querySelector('header').offsetHeight : 100;
                        const elementPosition = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: elementPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    /**
     * Méthode pour détruire tous les sliders (nettoyage)
     */
    destroy() {
        this.productsCarousels.forEach(carousel => {
            if (carousel && carousel.destroy) {
                carousel.destroy();
            }
        });
        
        this.backgroundSliders.forEach(slider => {
            if (slider && slider.destroy) {
                slider.destroy();
            }
        });
    }

    /**
     * Méthode pour redémarrer tous les sliders
     */
    restart() {
        this.destroy();
        this.init();
    }
}

/**
 * ===================================
 * INITIALISATION
 * ===================================
 */

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier que Swiper est disponible
    if (typeof Swiper === 'undefined') {
        console.error('Swiper.js n\'est pas chargé. Veuillez inclure Swiper.js avant ce script.');
        return;
    }

    // Initialiser l'application TMC Portfolio
    window.tmcPortfolio = new TMCPortfolio();
});

/**
 * ===================================
 * FONCTIONS UTILITAIRES
 * ===================================
 */

// Fonction pour redémarrer les sliders (accessible globalement)
function restartTMCSliders() {
    if (window.tmcPortfolio) {
        window.tmcPortfolio.restart();
    }
}

// Fonction pour détruire les sliders (accessible globalement)
function destroyTMCSliders() {
    if (window.tmcPortfolio) {
        window.tmcPortfolio.destroy();
    }
}

// Gestion des erreurs
window.addEventListener('error', function(e) {
    console.error('Erreur dans TMC Portfolio:', e.error);
});

// Gestion du redimensionnement de la fenêtre
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.tmcPortfolio) {
            window.tmcPortfolio.restart();
        }
    }, 250);
});
