/* =====================================================
   KANA ÉLECTROMÉNAGER
   MAIN.JS
   HOME + MOBILE SIDE MENU + NESTED CATEGORIES
   + HERO SLIDER + FIRESTORE PRODUCTS
===================================================== */

import {
    db,
    collection,
    getDocs
} from "./firebase.js";


/* =====================================================
   MOBILE SIDE MENU
===================================================== */

const menuToggle =
    document.getElementById("menuToggle");

const sideMenu =
    document.getElementById("sideMenu");

const sideMenuOverlay =
    document.getElementById("sideMenuOverlay");

const sideMenuClose =
    document.getElementById("sideMenuClose");


/* =====================================================
   OPEN SIDE MENU
===================================================== */

function openSideMenu() {

    if (!sideMenu) {
        return;
    }

    sideMenu.classList.add("active");

    if (sideMenuOverlay) {
        sideMenuOverlay.classList.add("active");
    }

    document.body.classList.add("menu-open");

    if (menuToggle) {

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

    }

    sideMenu.setAttribute(
        "aria-hidden",
        "false"
    );

}
/* =====================================================
   CLOSE SIDE MENU
===================================================== */

function closeSideMenu() {

    if (!sideMenu) {
        return;
    }

    /* Remove focus from the close button BEFORE
       hiding the menu from assistive technology */

    if (
        document.activeElement &&
        sideMenu.contains(document.activeElement)
    ) {
        document.activeElement.blur();
    }

    sideMenu.classList.remove("active");

    if (sideMenuOverlay) {
        sideMenuOverlay.classList.remove("active");
    }

    document.body.classList.remove("menu-open");

    if (menuToggle) {

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }

    sideMenu.setAttribute(
        "aria-hidden",
        "true"
    );

}

/* =====================================================
   MENU TOGGLE
===================================================== */

if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            if (
                sideMenu &&
                sideMenu.classList.contains("active")
            ) {

                closeSideMenu();

            }

            else {

                openSideMenu();

            }

        }
    );

}


/* =====================================================
   CLOSE BUTTON
===================================================== */

if (sideMenuClose) {

    sideMenuClose.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            closeSideMenu();

        }
    );

}


/* =====================================================
   OVERLAY
===================================================== */

if (sideMenuOverlay) {

    sideMenuOverlay.addEventListener(
        "click",
        function () {

            closeSideMenu();

        }
    );

}


/* =====================================================
   ESCAPE
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeSideMenu();

        }

    }
);


/* =====================================================
   CLOSE MENU AFTER CLICKING FINAL LINK
===================================================== */

if (sideMenu) {

    const finalLinks =
        sideMenu.querySelectorAll(
            "a"
        );

    finalLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    closeSideMenu();

                }
            );

        }
    );

}


/* =====================================================
   CATEGORIES DROPDOWN
===================================================== */

const categoriesMenuButton =
    document.getElementById("categoriesMenuButton");

const categoriesSubmenu =
    document.getElementById("categoriesSubmenu");

const categoriesArrow =
    document.getElementById("categoriesArrow");


/* =====================================================
   MAIN CATEGORIES TOGGLE
===================================================== */

if (
    categoriesMenuButton &&
    categoriesSubmenu
) {

    categoriesMenuButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            const isOpen =
                categoriesSubmenu.classList.contains("active");


            if (isOpen) {

                /* CLOSE MAIN CATEGORIES */

                categoriesSubmenu.classList.remove("active");

                categoriesMenuButton.classList.remove("active");

                categoriesMenuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                if (categoriesArrow) {
                    categoriesArrow.textContent = "↓";
                }


                /* CLOSE ALL NESTED SUBMENUS */

                closeAllNestedCategories();

            }

            else {

                /* OPEN MAIN CATEGORIES */

                categoriesSubmenu.classList.add("active");

                categoriesMenuButton.classList.add("active");

                categoriesMenuButton.setAttribute(
                    "aria-expanded",
                    "true"
                );

                if (categoriesArrow) {
                    categoriesArrow.textContent = "↑";
                }

            }

        }
    );

}


/* =====================================================
   NESTED CATEGORY ELEMENTS
===================================================== */

const maisonMenuButton =
    document.getElementById("maisonMenuButton");

const maisonSubmenu =
    document.getElementById("maisonSubmenu");


const cuisineMenuButton =
    document.getElementById("cuisineMenuButton");

const cuisineSubmenu =
    document.getElementById("cuisineSubmenu");


const refrigerateursMenuButton =
    document.getElementById("refrigerateursMenuButton");

const refrigerateursSubmenu =
    document.getElementById("refrigerateursSubmenu");


/* =====================================================
   CLOSE ALL NESTED CATEGORIES
===================================================== */

function closeAllNestedCategories() {

    const buttons = [

        maisonMenuButton,

        cuisineMenuButton,

        refrigerateursMenuButton

    ];


    const submenus = [

        maisonSubmenu,

        cuisineSubmenu,

        refrigerateursSubmenu

    ];


    buttons.forEach(
        function (button) {

            if (!button) {
                return;
            }

            button.classList.remove("active");

            button.setAttribute(
                "aria-expanded",
                "false"
            );

        }
    );


    submenus.forEach(
        function (submenu) {

            if (!submenu) {
                return;
            }

            submenu.classList.remove("active");

        }
    );

}


/* =====================================================
   NESTED CATEGORY TOGGLE
===================================================== */

function setupNestedCategory(
    button,
    submenu
) {

    if (!button || !submenu) {
        return;
    }


    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();


            const isOpen =
                submenu.classList.contains("active");


            /*

               Close every other submenu first.

            */

            closeAllNestedCategories();


            /*

               If the clicked submenu was closed,
               open it.

               If it was already open,
               it stays closed.

            */

            if (!isOpen) {

                submenu.classList.add("active");

                button.classList.add("active");

                button.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        }
    );

}


/* =====================================================
   MAISON & ENTRETIEN
===================================================== */

setupNestedCategory(
    maisonMenuButton,
    maisonSubmenu
);


/* =====================================================
   CUISINE
===================================================== */

setupNestedCategory(
    cuisineMenuButton,
    cuisineSubmenu
);


/* =====================================================
   RÉFRIGÉRATEURS & CONGÉLATEURS
===================================================== */

setupNestedCategory(
    refrigerateursMenuButton,
    refrigerateursSubmenu
);


/* =====================================================
   HERO SLIDER
===================================================== */

const heroSlides = [

    {
        image: "images/hero/hero-1.jpg",

        label: "KANA ÉLECTROMÉNAGER",

        title:
            "L'électroménager, élevé au rang d'art.",

        text:
            "Des pièces d'exception, une livraison irréprochable et un service à la hauteur de votre intérieur.",

        features:
            "QUALITÉ • PERFORMANCE • DESIGN",

        button:
            "DÉCOUVRIR"

    },


    {
        image: "images/hero/hero-2.jpg",

        label: "TÉLÉVISIONS",

        title:
            "L'image cinéma, chez vous.",

        text:
            "OLED, QLED, Neo QLED — les plus grandes marques signées Kana.",

        features:
            "STYLE • PERFORMANCE",

        button:
            "DÉCOUVRIR"

    },


    {
        image: "images/hero/hero-3.jpg",

        label: "RÉFRIGÉRATEURS",

        title:
            "Fraîcheur signature, silence maîtrisé.",

        text:
            "Réfrigérateurs multi-portes, side-by-side et French Door.",

        features:
            "TECHNOLOGIE • EFFICACITÉ • CONFORT",

        button:
            "DÉCOUVRIR"

    },


    {
        image: "images/hero/hero-4.jpg",

        label: "CUISINE",

        title:
            "L'art culinaire, réinventé.",

        text:
            "Robots, machines à café et équipements d'exception pour sublimer votre cuisine.",

        features:
            "STYLE • PERFORMANCE",

        button:
            "DÉCOUVRIR"

    }

];


/* =====================================================
   HERO ELEMENTS
===================================================== */

const heroImage =
    document.getElementById("heroImage");

const heroLabel =
    document.getElementById("heroLabel");

const heroTitle =
    document.getElementById("heroTitle");

const heroText =
    document.getElementById("heroText");

const heroFeatures =
    document.getElementById("heroFeatures");

const heroButton =
    document.getElementById("heroButton");

const prevSlideButton =
    document.getElementById("prevSlide");

const nextSlideButton =
    document.getElementById("nextSlide");

const sliderDots =
    document.getElementById("sliderDots");


let currentSlide = 0;

let autoSlide = null;


/* =====================================================
   SHOW SLIDE
===================================================== */

function showSlide(index) {

    if (!heroSlides.length) {
        return;
    }


    if (index >= heroSlides.length) {

        currentSlide = 0;

    }

    else if (index < 0) {

        currentSlide =
            heroSlides.length - 1;

    }

    else {

        currentSlide = index;

    }


    const slide =
        heroSlides[currentSlide];


    if (heroImage) {

        heroImage.style.opacity = "0";


        setTimeout(
            function () {

                heroImage.src =
                    slide.image;

                heroImage.alt =
                    slide.title;

                heroImage.style.opacity =
                    "1";

            },
            250
        );

    }


    if (heroLabel) {

        heroLabel.textContent =
            slide.label || "";

    }


    if (heroTitle) {

        heroTitle.textContent =
            slide.title || "";

    }


    if (heroText) {

        heroText.textContent =
            slide.text || "";

    }


    if (heroFeatures) {

        heroFeatures.textContent =
            slide.features || "";

    }


    if (heroButton) {

        heroButton.textContent =
            slide.button || "DÉCOUVRIR";

        heroButton.href =
            "#categories";

    }


    updateDots();

}


/* =====================================================
   NEXT SLIDE
===================================================== */

function nextSlide() {

    showSlide(
        currentSlide + 1
    );

    restartAutoSlide();

}


/* =====================================================
   PREVIOUS SLIDE
===================================================== */

function previousSlide() {

    showSlide(
        currentSlide - 1
    );

    restartAutoSlide();

}


/* =====================================================
   CREATE DOTS
===================================================== */

function createDots() {

    if (!sliderDots) {
        return;
    }


    sliderDots.innerHTML = "";


    heroSlides.forEach(
        function (slide, index) {

            const dot =
                document.createElement(
                    "button"
                );


            dot.type = "button";

            dot.className =
                "slider-dot";


            dot.setAttribute(
                "aria-label",
                `Aller au slide ${index + 1}`
            );


            dot.addEventListener(
                "click",
                function () {

                    showSlide(index);

                    restartAutoSlide();

                }
            );


            sliderDots.appendChild(
                dot
            );

        }
    );


    updateDots();

}


/* =====================================================
   UPDATE DOTS
===================================================== */

function updateDots() {

    if (!sliderDots) {
        return;
    }


    const dots =
        sliderDots.querySelectorAll(
            ".slider-dot"
        );


    dots.forEach(
        function (dot, index) {

            dot.classList.toggle(
                "active",
                index === currentSlide
            );

        }
    );

}


/* =====================================================
   START AUTO SLIDER
===================================================== */

function startAutoSlide() {

    clearInterval(autoSlide);


    autoSlide =
        setInterval(
            function () {

                showSlide(
                    currentSlide + 1
                );

            },
            5000
        );

}


/* =====================================================
   RESTART AUTO SLIDER
===================================================== */

function restartAutoSlide() {

    clearInterval(autoSlide);

    startAutoSlide();

}


/* =====================================================
   HERO ARROWS
===================================================== */

if (nextSlideButton) {

    nextSlideButton.addEventListener(
        "click",
        nextSlide
    );

}


if (prevSlideButton) {

    prevSlideButton.addEventListener(
        "click",
        previousSlide
    );

}


/* =====================================================
   PAUSE SLIDER ON HOVER
===================================================== */

const hero =
    document.querySelector(".hero");


if (hero) {

    hero.addEventListener(
        "mouseenter",
        function () {

            clearInterval(autoSlide);

        }
    );


    hero.addEventListener(
        "mouseleave",
        function () {

            startAutoSlide();

        }
    );

}


/* =====================================================
   HOME CATEGORIES
===================================================== */

const categories = [

    {
        name:
            "Maison & Entretien",

        image:
            "images/categories/maison-entretien.jpg",

        description:
            "Des appareils pour faciliter votre quotidien.",

        link:
            "category.html?category=maison-entretien"

    },


    {
        name:
            "Cuisine",

        image:
            "images/categories/cuisine.jpg",

        description:
            "Tout pour une cuisine pratique et moderne.",

        link:
            "category.html?category=cuisine"

    },


    {
        name:
            "Réfrigérateurs - Congélateurs",

        image:
            "images/categories/refrigerateur-congelateur.jpg",

        description:
            "Conservation, fraîcheur et performance.",

        link:
            "category.html?category=refrigerateur-congelateur"

    },


    {
        name:
            "Télévisions",

        image:
            "images/categories/televisions.jpg",

        description:
            "Une expérience audiovisuelle nouvelle génération.",

        link:
            "category.html?category=televisions"

    },


    {
        name:
            "Machines à laver",

        image:
            "images/categories/machines-a-laver.jpg",

        description:
            "Des solutions efficaces pour votre linge.",

        link:
            "category.html?category=machines-a-laver"

    },


    {
        name:
            "Lave-vaisselle",

        image:
            "images/categories/lave-vaisselle.jpg",

        description:
            "Plus de confort et moins de contraintes.",

        link:
            "category.html?category=lave-vaisselle"

    }

];


/* =====================================================
   CATEGORIES CONTAINER
===================================================== */

const categoriesContainer =
    document.getElementById(
        "categoriesContainer"
    );


/* =====================================================
   DISPLAY CATEGORIES
===================================================== */

function displayCategories() {

    if (!categoriesContainer) {
        return;
    }


    categoriesContainer.innerHTML = "";


    categories.forEach(
        function (category, index) {

            const card =
                document.createElement("a");


            card.className =
                "category-card";


            card.href =
                category.link;


            card.innerHTML = `

                <img
                    src="${category.image}"
                    alt="${category.name}"
                    loading="lazy"
                >

                <div class="category-content">

                    <span class="category-number">
                        ${String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>
                        ${category.name}
                    </h3>

                    <p>
                        ${category.description}
                    </p>

                </div>

                <span class="category-arrow">
                    →
                </span>

            `;


            categoriesContainer.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   FIRESTORE PRODUCTS
===================================================== */

let homeProducts = [];


/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadHomeProducts() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "products"
                )
            );


        homeProducts =
            snapshot.docs.map(
                function (document) {

                    return {

                        id:
                            document.id,

                        ...document.data()

                    };

                }
            );


        console.log(
            "KANA — Produits chargés depuis Firestore:",
            homeProducts
        );


        return homeProducts;

    }

    catch (error) {

        console.error(
            "KANA — Erreur Firestore:",
            error
        );


        homeProducts = [];


        return [];

    }

}


/* =====================================================
   PRODUCT PRICE
===================================================== */

function getProductPriceHTML(product) {

    const rawPrice = product.price;

    const price = Number(rawPrice);

    /* =================================================
       NO VALID PRICE
    ================================================= */

    if (
        rawPrice === null ||
        rawPrice === undefined ||
        rawPrice === "" ||
        !Number.isFinite(price)
    ) {

        return `
            <p class="home-product-price">
                Prix sur demande
            </p>
        `;

    }


    /* =================================================
       PROMOTION
    ================================================= */

    const oldPrice = Number(product.oldPrice);

    const hasPromotion =
        product.promotion === true &&
        Number.isFinite(oldPrice) &&
        oldPrice > price;


    if (hasPromotion) {

        return `
            <div class="home-product-price product-price">

                <del class="product-old-price">
                    ${oldPrice.toLocaleString("fr-FR")} DA
                </del>

                <strong class="product-new-price">
                    ${price.toLocaleString("fr-FR")} DA
                </strong>

            </div>
        `;

    }


    /* =================================================
       NORMAL PRICE
    ================================================= */

    return `
        <p class="home-product-price">
            ${price.toLocaleString("fr-FR")} DA
        </p>
    `;

}
/* =====================================================
   HOME PRODUCT CARD
===================================================== */

function createHomeProductCard(product) {

    const card =
        document.createElement("a");


    card.className =
        "home-product-card";


    card.href =
        `product.html?id=${encodeURIComponent(
            product.id
        )}`;


    /* =================================================
       IMAGE
    ================================================= */

    const image =
        product.image || "";


    let imageHTML;


    if (image) {

        imageHTML = `

            <img
                src="${image}"
                alt="${product.name || "Produit"}"
                loading="lazy"
            >

        `;

    }

    else {

        imageHTML = `

            <div class="home-product-no-image">
                Image indisponible
            </div>

        `;

    }


    /* =================================================
       LABEL
    ================================================= */

    let labelHTML = "";


    if (product.bestSeller === true) {

        labelHTML = `

            <span class="home-product-label">
                BEST SELLER
            </span>

        `;

    }

    else if (product.promotion === true) {

        labelHTML = `

            <span class="home-product-label">
                PROMOTION
            </span>

        `;

    }


    /* =================================================
       DESCRIPTION
    ================================================= */

    const description =
        product.description || "";


    let descriptionHTML = "";


    if (description) {

        descriptionHTML = `

            <p class="home-product-description">
                ${description}
            </p>

        `;

    }


    /* =================================================
       PRICE
    ================================================= */

    const priceHTML =
        getProductPriceHTML(product);


    /* =================================================
       CARD HTML
    ================================================= */

    card.innerHTML = `

        <div class="home-product-image">

            ${imageHTML}

        </div>


        <div class="home-product-info">

            ${labelHTML}


            <h3>
                ${product.name || "Produit"}
            </h3>


            ${descriptionHTML}


            ${priceHTML}


        </div>

    `;


    return card;

}


/* =====================================================
   DISPLAY PRODUCTS
===================================================== */

function displayHomeProducts(
    products,
    containerId
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!products.length) {

        container.innerHTML = `

            <p class="home-products-empty">
                Aucun produit disponible
                pour le moment.
            </p>

        `;

        return;

    }


    products.forEach(
        function (product) {

            container.appendChild(
                createHomeProductCard(
                    product
                )
            );

        }
    );

}


/* =====================================================
   BEST SELLERS
===================================================== */

function displayBestSellers() {

    const products =
        homeProducts
            .filter(
                function (product) {

                    return (
                        product.bestSeller === true
                    );

                }
            )
            .slice(0, 5);


    displayHomeProducts(
        products,
        "bestSellersContainer"
    );

}


/* =====================================================
   PROMOTIONS
===================================================== */

function displayPromotions() {

    const products =
        homeProducts
            .filter(
                function (product) {

                    return (
                        product.promotion === true
                    );

                }
            )
            .slice(0, 4);


    displayHomeProducts(
        products,
        "promotionsContainer"
    );

}


/* =====================================================
   INITIALIZE HOME
===================================================== */

async function initializeHome() {

    console.log(
        "KANA — main.js chargé"
    );


    /* HERO */

    createDots();

    showSlide(0);


    /* CATEGORIES */

    displayCategories();


    /* PRODUCT LOADING */

    const bestSellersContainer =
        document.getElementById(
            "bestSellersContainer"
        );


    const promotionsContainer =
        document.getElementById(
            "promotionsContainer"
        );


    if (bestSellersContainer) {

        bestSellersContainer.innerHTML = `

            <p class="home-products-empty">
                Chargement...
            </p>

        `;

    }


    if (promotionsContainer) {

        promotionsContainer.innerHTML = `

            <p class="home-products-empty">
                Chargement...
            </p>

        `;

    }


    /* FIRESTORE */

    await loadHomeProducts();


    /* PRODUCTS */

    displayBestSellers();

    displayPromotions();


    /* SLIDER */

    startAutoSlide();

}


/* =====================================================
   START APPLICATION
===================================================== */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeHome
    );

}

else {

    initializeHome();

}