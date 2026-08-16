/* =====================================================
   KANA ÉLECTROMÉNAGER
   CATEGORIES DATABASE
===================================================== */

const categories = {

    /* =================================================
       1. MAISON & ENTRETIEN
    ================================================= */

    "maison-entretien": {

        title: "Maison & Entretien",

        description:
            "Découvrez nos appareils pour entretenir et équiper votre maison.",

        type: "subcategories",

        items: [

            {
                id: "aspirateurs",
                name: "Aspirateurs",
                image: "images/products/aspirateur.jpg"
            },

            {
                id: "ventilateurs",
                name: "Ventilateurs",
                image: "images/products/ventilateur.jpg"
            },

            {
                id: "climatisation",
                name: "Climatisation",
                image: "images/products/climatisation.jpg"
            },

            {
                id: "chauffages",
                name: "Chauffages",
                image: "images/products/chauffage.jpg"
            },

            {
                id: "chauffe-eau",
                name: "Chauffe-eau",
                image: "images/products/chauffe-eau.jpg"
            }

        ]
    },


    /* =================================================
       2. RÉFRIGÉRATEURS & CONGÉLATEURS
    ================================================= */

    "refrigerateur-congelateur": {

        title: "Réfrigérateurs et Congélateurs",

        description:
            "Découvrez notre sélection de réfrigérateurs et congélateurs.",

        type: "subcategories",

        items: [

            {
                id: "refrigerateurs",
                name: "Réfrigérateurs",
                image: "images/products/refrigerateur.jpg"
            },

            {
                id: "congelateurs",
                name: "Congélateurs",
                image: "images/products/congelateurs.jpg"
            }

        ]
    },


    /* =================================================
       3. TÉLÉVISIONS
    ================================================= */

    "televisions": {

        title: "Télévisions",

        description:
            "Découvrez notre sélection de télévisions et Smart TV.",

        type: "products"

    },


    /* =================================================
       4. MACHINES À LAVER
    ================================================= */

    "machines-a-laver": {

        title: "Machines à laver",

        description:
            "Découvrez notre sélection de machines à laver.",

        type: "products"

    },


    /* =================================================
       5. LAVE-VAISSELLE
    ================================================= */

    "lave-vaisselle": {

        title: "Lave-vaisselle",

        description:
            "Découvrez notre sélection de lave-vaisselle.",

        type: "products"

    },


    /* =================================================
       6. CUISINE
    ================================================= */

    "cuisine": {

        title: "Cuisine",

        description:
            "Découvrez nos équipements pour une cuisine moderne et pratique.",

        type: "subcategories",

        items: [

            {
                id: "machines-a-cafe",
                name: "Machines à café",
                image: "images/products/machine-a-cafe.jpg"
            },

            {
                id: "air-fryer",
                name: "Air Fryer",
                image: "images/products/air-fryer.jpg"
            },

            {
                id: "hachoir-mixeur-batteur-blender",
                name: "Hachoir - Mixeur - Batteur - Blender",
                image:
                    "images/products/blenders - Hachoir - Mixeur - Batteur.jpg"
            },

            {
                id: "micro-ondes",
                name: "Micro-ondes",
                image: "images/products/micro-onde.jpg"
            },

            {
                id: "fours",
                name: "Fours",
                image: "images/products/four.jpg"
            },

            {
                id: "cuisinieres",
                name: "Cuisinières",
                image: "images/products/cuisiniere.png"
            },

            {
                id: "petran",
                name: "Petran",
                image: "images/products/petran.jpg"
            }

        ]
    }

};


/* =====================================================
   URL
===================================================== */

const urlParams =
    new URLSearchParams(window.location.search);

const currentCategory =
    urlParams.get("category");


/* =====================================================
   PAGE ELEMENTS
===================================================== */

const categoryTitle =
    document.getElementById("categoryTitle");

const categoryLabel =
    document.getElementById("categoryLabel");

const categoryDescription =
    document.getElementById("categoryDescription");

const productsTitle =
    document.getElementById("productsTitle");

const productsCount =
    document.getElementById("productsCount");

const productsContainer =
    document.getElementById("productsContainer");


/* =====================================================
   DISPLAY CATEGORY INFORMATION
===================================================== */

function displayCategoryInfo() {

    const category =
        categories[currentCategory];


    /* CATEGORY NOT FOUND */

    if (!category) {

        if (categoryLabel) {
            categoryLabel.textContent =
                "KANA ÉLECTROMÉNAGER";
        }

        if (categoryTitle) {
            categoryTitle.textContent =
                "Catégorie introuvable";
        }

        if (categoryDescription) {
            categoryDescription.textContent =
                "Cette catégorie n'existe pas.";
        }

        if (productsTitle) {
            productsTitle.textContent =
                "Catégorie introuvable";
        }

        return;
    }


    /* PAGE TITLE */

    document.title =
        `${category.title} | KANA Électroménager`;


    /* LABEL */

    if (categoryLabel) {

        categoryLabel.textContent =
            "KANA ÉLECTROMÉNAGER";
    }


    /* TITLE */

    if (categoryTitle) {

        categoryTitle.textContent =
            category.title;
    }


    /* DESCRIPTION */

    if (categoryDescription) {

        categoryDescription.textContent =
            category.description;
    }


    /* PRODUCTS TITLE */

    if (productsTitle) {

        productsTitle.textContent =
            category.title;
    }

}


/* =====================================================
   DISPLAY SUBCATEGORIES
===================================================== */

function displaySubcategories() {

    const category =
        categories[currentCategory];


    if (!category) {
        return;
    }


    if (category.type !== "subcategories") {
        return;
    }


    if (!productsContainer) {
        return;
    }


    productsContainer.innerHTML = "";


    category.items.forEach(item => {

        const card =
            document.createElement("article");


        card.className =
            "product-card";


        /*
         * IMPORTANT
         *
         * The parent category is sent as "category"
         * and the clicked subcategory is sent as "type".
         *
         * Example:
         *
         * products.html?category=maison-entretien&type=aspirateurs
         */

        const productPageUrl =
            `products.html?category=${encodeURIComponent(
                currentCategory
            )}&type=${encodeURIComponent(
                item.id
            )}`;


        card.innerHTML = `

            <a
                href="${productPageUrl}"
                class="category-type-link"
            >

                <div class="product-image-container">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                        loading="lazy"
                    >

                </div>


                <div class="product-info">

                    <h3 class="product-name">
                        ${item.name}
                    </h3>


                    <div class="product-button">
                        VOIR LES PRODUITS
                    </div>

                </div>

            </a>

        `;


        productsContainer.appendChild(card);

    });


    /* =================================================
       COUNT
    ================================================= */

    if (productsCount) {

        productsCount.textContent =
            `${category.items.length} catégorie${
                category.items.length > 1
                    ? "s"
                    : ""
            }`;

    }

}


/* =====================================================
   REDIRECT TO PRODUCTS
===================================================== */

function redirectToProducts() {

    if (!currentCategory) {
        return;
    }


    window.location.href =
        `products.html?category=${encodeURIComponent(
            currentCategory
        )}`;

}


/* =====================================================
   INITIALIZE
===================================================== */

function initCategoriesPage() {

    const category =
        categories[currentCategory];


    /* NOT FOUND */

    if (!category) {

        displayCategoryInfo();

        return;
    }


    /* INFORMATION */

    displayCategoryInfo();


    /* SUBCATEGORIES */

    if (category.type === "subcategories") {

        displaySubcategories();

    }


    /* PRODUCTS */

    else if (category.type === "products") {

        redirectToProducts();

    }

}


/* =====================================================
   DOM READY
===================================================== */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initCategoriesPage
    );

} else {

    initCategoriesPage();

}