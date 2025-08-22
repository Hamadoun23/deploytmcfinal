/**
 * Products Carousel Manager
 * Gestion centralisée des carrousels de produits TMC
 * Optimisé pour performance et maintenabilité
 */

class ProductsCarouselManager {
    constructor() {
        this.productsData = {
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
                    { name: "Pierres Poli 1", price: 45000, image: "Poli 1.png" },
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
                    { name: "Kanbila", price: 29000, image: "Kanbila.png" },
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

        this.init();
    }

    init() {
        this.createProductCarousels();
        this.initializeCarousels();
        this.setupEventListeners();
    }

    createProductCarousels() {
        Object.keys(this.productsData).forEach(category => {
            const data = this.productsData[category];
            const containerId = `galerie-${category}`;
            const container = document.getElementById(containerId);
            
            if (container) {
                this.generateProductCarousel(container, data, category);
            }
        });
    }

    generateProductCarousel(container, data, category) {
        const carouselContainer = container.querySelector('.products-carousel-container');
        if (!carouselContainer) return;

        const swiperWrapper = carouselContainer.querySelector('.swiper-wrapper');
        if (!swiperWrapper) return;

        // Vider le contenu existant
        swiperWrapper.innerHTML = '';

        // Générer les slides
        data.products.forEach(product => {
            const slide = this.createProductSlide(product, data.folder);
            swiperWrapper.appendChild(slide);
        });
    }

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

    initializeCarousels() {
        // Configuration Swiper pour tous les carrousels
        const carouselConfig = {
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
                slideChange: this.handleSlideChange.bind(this),
                init: this.handleCarouselInit.bind(this)
            }
        };

        // Initialiser tous les carrousels
        document.querySelectorAll('.products-carousel').forEach(carousel => {
            new Swiper(carousel, carouselConfig);
        });
    }

    handleSlideChange() {
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
        setTimeout(this.updateActiveProductPrice.bind(this), 300);
    }

    handleCarouselInit() {
        // Afficher le prix du premier produit actif au chargement
        setTimeout(this.updateActiveProductPrice.bind(this), 500);
    }

    updateActiveProductPrice() {
        const activeSlide = document.querySelector('.products-carousel .swiper-slide-active');
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

    setupEventListeners() {
        // Animation prix au survol et gestion du produit actif
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

    // Méthode pour mettre à jour les prix
    updatePrices(category, newPrices) {
        if (this.productsData[category]) {
            this.productsData[category].products.forEach(product => {
                if (newPrices[product.name]) {
                    product.price = newPrices[product.name];
                }
            });
            this.createProductCarousels();
        }
    }

    // Méthode pour ajouter un nouveau produit
    addProduct(category, product) {
        if (this.productsData[category]) {
            this.productsData[category].products.push(product);
            this.createProductCarousels();
        }
    }
}

// Initialisation automatique quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier que Swiper et GSAP sont disponibles
    if (typeof Swiper !== 'undefined' && typeof gsap !== 'undefined') {
        window.productsCarouselManager = new ProductsCarouselManager();
    } else {
        console.warn('Swiper ou GSAP non disponible. Attente du chargement...');
        // Réessayer après un délai
        setTimeout(() => {
            if (typeof Swiper !== 'undefined' && typeof gsap !== 'undefined') {
                window.productsCarouselManager = new ProductsCarouselManager();
            }
        }, 1000);
    }
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductsCarouselManager;
}
