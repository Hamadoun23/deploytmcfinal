/**
 * Unified Product Carousel Manager
 * Gestionnaire unifié pour tous les carrousels de produits TMC
 * Un seul modèle réutilisable pour toutes les sections
 */

class UnifiedProductCarousel {
    constructor() {
        this.carousels = new Map();
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    /**
     * Crée un carrousel de produits pour une section donnée
     * @param {string} sectionId - ID de la section (ex: 'galerie-dolerite')
     * @param {Array} products - Liste des produits
     * @param {string} folder - Dossier des images
     */
    createCarousel(sectionId, products, folder) {
        const container = document.getElementById(sectionId);
        if (!container) {
            console.warn(`Section ${sectionId} non trouvée`);
            return;
        }

        const carouselContainer = container.querySelector('.products-carousel-container');
        if (!carouselContainer) {
            console.warn(`Container carrousel non trouvé dans ${sectionId}`);
            return;
        }

        const swiperWrapper = carouselContainer.querySelector('.swiper-wrapper');
        if (!swiperWrapper) {
            console.warn(`Swiper wrapper non trouvé dans ${sectionId}`);
            return;
        }

        // Vider le contenu existant
        swiperWrapper.innerHTML = '';

        // Générer les slides
        products.forEach(product => {
            const slide = this.createProductSlide(product, folder);
            swiperWrapper.appendChild(slide);
        });

        // Initialiser le carrousel Swiper
        this.initializeSwiper(carouselContainer, sectionId);
    }

    /**
     * Crée un slide de produit
     */
    createProductSlide(product, folder) {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        
        slide.innerHTML = `
            <div class="product-card">
                <div class="tp-pd-3-gallery-img small-img mb-20 hover-effect product-box">
                    <img data-speed=".8" src="Assetstmc/Detailprod/${folder}/${product.image}" alt="${product.name}">
                    <div class="price-tag">A partir de <br> ${product.price.toLocaleString()} FCFA / T</div>
                </div>
                <h3 class="product-title">${product.name}</h3>
            </div>
        `;

        return slide;
    }

    /**
     * Initialise le carrousel Swiper
     */
    initializeSwiper(container, sectionId) {
        const swiperElement = container.querySelector('.products-carousel');
        
        // Détruire l'ancienne instance si elle existe
        if (this.carousels.has(sectionId)) {
            this.carousels.get(sectionId).destroy();
        }

        const swiper = new Swiper(swiperElement, {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.products-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.products-nav-next',
                prevEl: '.products-nav-prev',
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
                slideChange: () => this.handleSlideChange(sectionId),
                init: () => this.handleCarouselInit(sectionId)
            }
        });

        this.carousels.set(sectionId, swiper);
    }

    /**
     * Gère le changement de slide
     */
    handleSlideChange(sectionId) {
        // Animation des cartes au changement de slide
        gsap.fromTo('.swiper-slide-active .product-box',
            { scale: 0.8, opacity: 0.7 },
            { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
        );
        
        // Masquer tous les prix d'abord
        document.querySelectorAll('.products-carousel .price-tag').forEach(tag => {
            gsap.to(tag, {
                opacity: 0,
                y: 0,
                duration: 0.2,
                ease: "power2.in"
            });
        });
        
        // Afficher le prix du produit actif
        setTimeout(() => this.updateActiveProductPrice(sectionId), 300);
    }

    /**
     * Gère l'initialisation du carrousel
     */
    handleCarouselInit(sectionId) {
        setTimeout(() => this.updateActiveProductPrice(sectionId), 500);
    }

    /**
     * Met à jour le prix du produit actif
     */
    updateActiveProductPrice(sectionId) {
        const activeSlide = document.querySelector(`#${sectionId} .products-carousel .swiper-slide-active`);
        if (activeSlide) {
            const activePriceTag = activeSlide.querySelector('.price-tag');
            if (activePriceTag) {
                gsap.to(activePriceTag, {
                    opacity: 1,
                    y: -5,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        }
    }

    /**
     * Configure les événements de survol
     */
    setupEventListeners() {
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.product-box')) {
                const productBox = e.target.closest('.product-box');
                const priceTag = productBox.querySelector('.price-tag');
                
                if (priceTag) {
                    gsap.to(priceTag, {
                        opacity: 1,
                        y: -10,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                }
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.product-box')) {
                const productBox = e.target.closest('.product-box');
                const priceTag = productBox.querySelector('.price-tag');
                
                if (priceTag && !productBox.closest('.swiper-slide-active')) {
                    gsap.to(priceTag, {
                        opacity: 0,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.in"
                    });
                }
            }
        });
    }

    /**
     * Met à jour les produits d'un carrousel
     */
    updateProducts(sectionId, newProducts, folder) {
        this.createCarousel(sectionId, newProducts, folder);
    }

    /**
     * Ajoute un produit à un carrousel existant
     */
    addProduct(sectionId, product, folder) {
        const swiper = this.carousels.get(sectionId);
        if (swiper) {
            const slide = this.createProductSlide(product, folder);
            swiper.appendSlide(slide);
        }
    }

    /**
     * Supprime un produit d'un carrousel
     */
    removeProduct(sectionId, index) {
        const swiper = this.carousels.get(sectionId);
        if (swiper) {
            swiper.removeSlide(index);
        }
    }
}

// Données des produits (centralisées)
const PRODUCTS_DATA = {
    dolerite: {
        title: "Dolérite",
        products: [
            { name: "5/15", price: 30000, image: "Dolérite 5-15 .png" },
            { name: "0/5", price: 27000, image: "Dolérite 0-5.png" },
            { name: "0/4", price: 25000, image: "Dolérite 0-4.png" },
            { name: "10/14", price: 28000, image: "Dolérite 10-14.png" },
            { name: "15/25", price: 33000, image: "Dolérite 15-25.png" },
            { name: "0/31,5", price: 26000, image: "Dolérite 0-31,5.png" },
            { name: "5/25", price: 32000, image: "Dolérite 5-25.png" },
            { name: "4/6", price: 29000, image: "Dolérite 4-6.png" },
            { name: "4/8", price: 31000, image: "Dolérite 4-8.png" },
            { name: "8/16", price: 34000, image: "Dolérite 8-16.png" },
            { name: "12/20", price: 36000, image: "Dolérite 12-20.png" },
            { name: "5/20", price: 30000, image: "Dolérite 5-20.png" },
            { name: "15/20", price: 35000, image: "Dolérite 15-20.png" },
            { name: "6/10", price: 28000, image: "Dolérite 6-10.png" }
        ],
        folder: "dolérite"
    },
    calcaire: {
        title: "Calcaire",
        products: [
            { name: "0/5", price: 22000, image: "Calcaire 0-5.png" },
            { name: "0/31,5", price: 24000, image: "Calcaire 0-31,5.png" },
            { name: "15/25", price: 28000, image: "Calcaire 15-25.png" },
            { name: "5/15", price: 26000, image: "Calcaire 5-15.png" }
        ],
        folder: "Calcaire"
    },
    pierresTaillees: {
        title: "Pierres Taillées",
        products: [
            { name: "Pierres préfabriquées", price: 40000, image: "pierrepréfabriqué.png" },
            { name: "Pierres Poli 2", price: 45000, image: "Poli 2.png" },
            { name: "Pierres Poli 3", price: 45000, image: "Poli 3.png" },
            { name: "Pierres Poli 4", price: 45000, image: "Poli 4.png" },
            { name: "10 x 10 cm", price: 50000, image: "Format 10x10.png" },
            { name: "10x 15 cm", price: 55000, image: "Format 10x15.png" },
            { name: "10 x 20 cm", price: 60000, image: "Format 10x20.png" },
            { name: "10 x 30 cm", price: 65000, image: "Format 10x30.png" },
            { name: "15 x 20 cm", price: 70000, image: "Format 15x20.png" },
            { name: "15 x 15 cm", price: 68000, image: "Format 15x15.png" },
            { name: "20 x 20 cm", price: 75000, image: "Format 20x20.png" },
            { name: "20 x 30 cm", price: 80000, image: "Format 20X30.png" },
            { name: "30 x 30 cm", price: 85000, image: "Format 30x30.png" },
            { name: "Assemblage 1", price: 90000, image: "Assemblage 1.png" },
            { name: "Assemblage 2", price: 90000, image: "Assemblage 2.png" },
            { name: "Assemblage 3", price: 90000, image: "Assemblage 3.png" },
            { name: "Assemblage 4", price: 90000, image: "Assemblage 4.png" }
        ],
        folder: "Pierre Taillé"
    },
    galets: {
        title: "Galets Décoratifs",
        products: [
            { name: "BADIANGARA", price: 28000, image: "BADIANGARA.png" },
            { name: "Gawa", price: 32000, image: "Gawa.png" },
            { name: "Kabaro", price: 30000, image: "Kabaro.png" },
            { name: "Kambila", price: 29000, image: "Kanbila.png" },
            { name: "Soninkegny", price: 31000, image: "Soninkegny.png" }
        ],
        folder: "Galet Décoratif"
    },
    gravierMixte: {
        title: "Graviers Mixtes",
        products: [
            { name: "gravier mixte", price: 20000, image: "gravier mixte.png" }
        ],
        folder: "Gravier Mixte"
    }
};

// Initialisation automatique
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper !== 'undefined' && typeof gsap !== 'undefined') {
        window.unifiedCarousel = new UnifiedProductCarousel();
        
        // Créer tous les carrousels automatiquement
        Object.keys(PRODUCTS_DATA).forEach(category => {
            const data = PRODUCTS_DATA[category];
            const sectionId = `galerie-${category}`;
            
            // Vérifier si la section existe dans le HTML
            if (document.getElementById(sectionId)) {
                window.unifiedCarousel.createCarousel(sectionId, data.products, data.folder);
            }
        });
    } else {
        console.warn('Swiper ou GSAP non disponible. Attente du chargement...');
        setTimeout(() => {
            if (typeof Swiper !== 'undefined' && typeof gsap !== 'undefined') {
                window.unifiedCarousel = new UnifiedProductCarousel();
                
                Object.keys(PRODUCTS_DATA).forEach(category => {
                    const data = PRODUCTS_DATA[category];
                    const sectionId = `galerie-${category}`;
                    
                    if (document.getElementById(sectionId)) {
                        window.unifiedCarousel.createCarousel(sectionId, data.products, data.folder);
                    }
                });
            }
        }, 1000);
    }
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UnifiedProductCarousel, PRODUCTS_DATA };
}
