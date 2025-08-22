/**
 * Gallery Slider Manager
 * Gestion centralisée des sliders de galerie TMC
 * Optimisé pour performance et maintenabilité
 */

class GallerySliderManager {
    constructor() {
        this.galleryData = {
            dolerite: {
                title: "Dolérite",
                images: [
                    { src: "bgdolerite1.png", alt: "Dolérite - Vue générale" },
                    { src: "bgdolerite2.png", alt: "Dolérite - Détails techniques" },
                    { src: "bg dolerite décoration.png", alt: "Dolérite - Applications décoratives" }
                ],
                folder: "dolérite/Bgdolerite"
            },
            calcaire: {
                title: "Calcaire",
                images: [
                    { src: "bgcalcaire1.png", alt: "Calcaire - Vue générale" },
                    { src: "bgcalcaire2.png", alt: "Calcaire - Détails techniques" },
                    { src: "bgcalcaire3.png", alt: "Calcaire - Applications" }
                ],
                folder: "Calcaire/Bgcalcaire"
            },
            pierresTaillees: {
                title: "Pierres Taillées",
                images: [
                    { src: "bgpierretailée1.png", alt: "Pierres taillées - Vue générale" },
                    { src: "bgpierretailée2.png", alt: "Pierres taillées - Détails techniques" },
                    { src: "bgpierretailée3.png", alt: "Pierres taillées - Applications décoratives" }
                ],
                folder: "Pierre Taillé/Bgpierretaillé"
            },
            galets: {
                title: "Galets Décoratifs",
                images: [
                    { src: "bg galet basic et soninkegny.png", alt: "Galets - Basic et Soninkegny" },
                    { src: "bg galet 1.png", alt: "Galets - Vue générale" },
                    { src: "bg galet basic et soninkegny 2.png", alt: "Galets - Applications" }
                ],
                folder: "Galet Décoratif/Bggalets"
            },
            gravierMixte: {
                title: "Graviers Mixtes",
                images: [
                    { src: "bg gravier mixte.png", alt: "Gravier mixte - Vue générale" },
                    { src: "bg gravier mixte.png", alt: "Gravier mixte - Détails" },
                    { src: "bg gravier mixte.png", alt: "Gravier mixte - Applications" }
                ],
                folder: "Gravier Mixte/Bggraviermixte"
            }
        };

        this.sliders = new Map();
        this.init();
    }

    init() {
        this.createGallerySliders();
        this.initializeSliders();
        this.setupGlobalEventListeners();
    }

    createGallerySliders() {
        Object.keys(this.galleryData).forEach(category => {
            const data = this.galleryData[category];
            const containerId = `galerie-${category}`;
            const container = document.getElementById(containerId);
            
            if (container) {
                this.generateGallerySlider(container, data, category);
            }
        });
    }

    generateGallerySlider(container, data, category) {
        const galleryContainer = container.querySelector('.gallery-container');
        if (!galleryContainer) return;

        const swiperContainer = galleryContainer.querySelector('.dolerite-slider');
        if (!swiperContainer) return;

        const swiperWrapper = swiperContainer.querySelector('.swiper-wrapper');
        if (!swiperWrapper) return;

        // Vider le contenu existant
        swiperWrapper.innerHTML = '';

        // Générer les slides
        data.images.forEach(image => {
            const slide = this.createGallerySlide(image, data.folder);
            swiperWrapper.appendChild(slide);
        });
    }

    createGallerySlide(image, folder) {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        
        slide.innerHTML = `
            <div class="slide-inner">
                <img src="Assetstmc/Detailprod/${folder}/${image.src}" alt="${image.alt}" class="slide-img">
            </div>
        `;

        return slide;
    }

    initializeSliders() {
        // Configuration Swiper pour tous les sliders de galerie
        const sliderConfig = {
            loop: true,
            speed: 1000,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            on: {
                slideChangeTransitionStart: this.handleSlideTransitionStart.bind(this),
                slideChangeTransitionEnd: this.handleSlideTransitionEnd.bind(this)
            }
        };

        // Initialiser tous les sliders
        document.querySelectorAll('.dolerite-slider').forEach((slider, index) => {
            const swiperInstance = new Swiper(slider, sliderConfig);
            this.sliders.set(index, swiperInstance);
        });
    }

    handleSlideTransitionStart() {
        // Animation de sortie pour tous les slides
        gsap.to('.swiper-slide .slide-img', {
            scale: 1.1,
            rotateZ: 3,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.inOut'
        });
    }

    handleSlideTransitionEnd() {
        // Animation d'entrée pour le slide actif
        gsap.fromTo('.swiper-slide-active .slide-img',
            { 
                scale: 1.3, 
                rotateZ: -2, 
                opacity: 0 
            },
            {
                scale: 1,
                rotateZ: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'expo.out'
            }
        );
    }

    setupGlobalEventListeners() {
        // Gestion des événements globaux pour les sliders
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAllSliders();
            } else {
                this.resumeAllSliders();
            }
        });

        // Pause au survol (optionnel)
        document.querySelectorAll('.dolerite-slider').forEach(slider => {
            slider.addEventListener('mouseenter', () => {
                const swiperInstance = this.getSwiperInstance(slider);
                if (swiperInstance && swiperInstance.autoplay) {
                    swiperInstance.autoplay.stop();
                }
            });

            slider.addEventListener('mouseleave', () => {
                const swiperInstance = this.getSwiperInstance(slider);
                if (swiperInstance && swiperInstance.autoplay) {
                    swiperInstance.autoplay.start();
                }
            });
        });
    }

    getSwiperInstance(sliderElement) {
        for (let [index, instance] of this.sliders) {
            if (instance.el === sliderElement) {
                return instance;
            }
        }
        return null;
    }

    pauseAllSliders() {
        this.sliders.forEach(swiperInstance => {
            if (swiperInstance.autoplay) {
                swiperInstance.autoplay.stop();
            }
        });
    }

    resumeAllSliders() {
        this.sliders.forEach(swiperInstance => {
            if (swiperInstance.autoplay) {
                swiperInstance.autoplay.start();
            }
        });
    }

    // Méthode pour mettre à jour les images d'une galerie
    updateGalleryImages(category, newImages) {
        if (this.galleryData[category]) {
            this.galleryData[category].images = newImages;
            this.createGallerySliders();
            this.initializeSliders();
        }
    }

    // Méthode pour ajouter une image à une galerie
    addGalleryImage(category, image) {
        if (this.galleryData[category]) {
            this.galleryData[category].images.push(image);
            this.createGallerySliders();
            this.initializeSliders();
        }
    }

    // Méthode pour obtenir les données d'une galerie
    getGalleryData(category) {
        return this.galleryData[category] || null;
    }

    // Méthode pour obtenir toutes les données des galeries
    getAllGalleryData() {
        return this.galleryData;
    }

    // Méthode pour recharger un slider spécifique
    reloadSlider(category) {
        const containerId = `galerie-${category}`;
        const container = document.getElementById(containerId);
        
        if (container) {
            const data = this.galleryData[category];
            this.generateGallerySlider(container, data, category);
            
            // Trouver et détruire l'ancienne instance
            const sliderElement = container.querySelector('.dolerite-slider');
            const oldInstance = this.getSwiperInstance(sliderElement);
            if (oldInstance) {
                oldInstance.destroy();
            }
            
            // Créer une nouvelle instance
            const newInstance = new Swiper(sliderElement, {
                loop: true,
                speed: 1000,
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                on: {
                    slideChangeTransitionStart: this.handleSlideTransitionStart.bind(this),
                    slideChangeTransitionEnd: this.handleSlideTransitionEnd.bind(this)
                }
            });
            
            // Mettre à jour la référence
            this.sliders.set(category, newInstance);
        }
    }

    // Méthode pour personnaliser la configuration d'un slider
    customizeSlider(category, customConfig) {
        const containerId = `galerie-${category}`;
        const container = document.getElementById(containerId);
        
        if (container) {
            const sliderElement = container.querySelector('.dolerite-slider');
            const oldInstance = this.getSwiperInstance(sliderElement);
            
            if (oldInstance) {
                oldInstance.destroy();
            }
            
            const defaultConfig = {
                loop: true,
                speed: 1000,
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                on: {
                    slideChangeTransitionStart: this.handleSlideTransitionStart.bind(this),
                    slideChangeTransitionEnd: this.handleSlideTransitionEnd.bind(this)
                }
            };
            
            const mergedConfig = { ...defaultConfig, ...customConfig };
            const newInstance = new Swiper(sliderElement, mergedConfig);
            this.sliders.set(category, newInstance);
        }
    }
}

// Initialisation automatique quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier que Swiper et GSAP sont disponibles
    if (typeof Swiper !== 'undefined' && typeof gsap !== 'undefined') {
        window.gallerySliderManager = new GallerySliderManager();
    } else {
        console.warn('Swiper ou GSAP non disponible. Attente du chargement...');
        // Réessayer après un délai
        setTimeout(() => {
            if (typeof Swiper !== 'undefined' && typeof gsap !== 'undefined') {
                window.gallerySliderManager = new GallerySliderManager();
            }
        }, 1000);
    }
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GallerySliderManager;
}
