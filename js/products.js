import {
    db,
    collection,
    getDocs
} from "./firebase.js";


/* =====================================================
   KANA ÉLECTROMÉNAGER
   PRODUCTS PAGE
===================================================== */


/* =====================================================
   URL
===================================================== */

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const currentCategory =
    urlParams.get("category");

const currentType =
    urlParams.get("type");


/* =====================================================
   ELEMENTS
===================================================== */

const productsCategoryLabel =
    document.getElementById(
        "productsCategoryLabel"
    );

const productsCategoryTitle =
    document.getElementById(
        "productsCategoryTitle"
    );

const productsCategoryDescription =
    document.getElementById(
        "productsCategoryDescription"
    );

const productsTitle =
    document.getElementById(
        "productsTitle"
    );

const productsCount =
    document.getElementById(
        "productsCount"
    );

const productsContainer =
    document.getElementById(
        "productsContainer"
    );

const emptyProducts =
    document.getElementById(
        "emptyProducts"
    );

const sortProducts =
    document.getElementById(
        "sortProducts"
    );


/* =====================================================
   CATEGORY DATABASE
===================================================== */

const categoryInfo = {

    "maison-entretien": {

        label:
            "MAISON & ENTRETIEN",

        title:
            "Maison & Entretien",

        description:
            "Découvrez notre sélection de produits pour la maison et l'entretien."

    },

    "refrigerateurs-congelateurs": {

        label:
            "RÉFRIGÉRATEURS - CONGÉLATEURS",

        title:
            "Réfrigérateurs - Congélateurs",

        description:
            "Découvrez notre sélection de réfrigérateurs et de congélateurs."

    },

    "televisions": {

        label:
            "TÉLÉVISIONS",

        title:
            "Télévisions",

        description:
            "Découvrez notre sélection de télévisions et Smart TV."

    },

    "machines-a-laver": {

        label:
            "MACHINES À LAVER",

        title:
            "Machines à laver",

        description:
            "Découvrez notre sélection de machines à laver."

    },

    "lave-vaisselle": {

        label:
            "LAVE-VAISSELLE",

        title:
            "Lave-vaisselle",

        description:
            "Découvrez notre sélection de lave-vaisselle."

    },

    "cuisine": {

        label:
            "CUISINE",

        title:
            "Cuisine",

        description:
            "Découvrez notre sélection d'appareils pour la cuisine."

    }

};


/* =====================================================
   NORMALIZE
===================================================== */

function normalizeText(value) {

    return String(value || "")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/œ/g, "oe")
        .replace(/æ/g, "ae")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

}


/* =====================================================
   CATEGORY ALIASES
===================================================== */

const categoryAliases = {

    "maison-entretien":
        "maison-entretien",

    "maison-et-entretien":
        "maison-entretien",

    "refrigerateur":
        "refrigerateurs-congelateurs",

    "refrigerateurs":
        "refrigerateurs-congelateurs",

    "congelateur":
        "refrigerateurs-congelateurs",

    "congelateurs":
        "refrigerateurs-congelateurs",

    "refrigerateur-congelateur":
        "refrigerateurs-congelateurs",

    "refrigerateurs-congelateurs":
        "refrigerateurs-congelateurs",

    "tv":
        "televisions",

    "television":
        "televisions",

    "televisions":
        "televisions",

    "machine-a-laver":
        "machines-a-laver",

    "machines-a-laver":
        "machines-a-laver",

    "lave-vaisselle":
        "lave-vaisselle",

    "cuisine":
        "cuisine"

};


/* =====================================================
   TYPE ALIASES
===================================================== */

const typeAliases = {

    "aspirateur":
        "aspirateurs",

    "aspirateurs":
        "aspirateurs",

    "ventilateur":
        "ventilateurs",

    "ventilateurs":
        "ventilateurs",

    "climatiseur":
        "climatisation",

    "climatiseurs":
        "climatisation",

    "climatisation":
        "climatisation",

    "chauffage":
        "chauffages",

    "chauffages":
        "chauffages",

    "chauffe-eau":
        "chauffe-eau",

    "chauffe-eaux":
        "chauffe-eau",

    "refrigerateur":
        "refrigerateurs",

    "refrigerateurs":
        "refrigerateurs",

    "congelateur":
        "congelateurs",

    "congelateurs":
        "congelateurs",

    "television":
        "televisions",

    "televisions":
        "televisions",

    "machine-a-laver":
        "machines-a-laver",

    "machines-a-laver":
        "machines-a-laver",

    "lave-vaisselle":
        "lave-vaisselle",

    "machine-a-cafe":
        "machines-a-cafe",

    "machines-a-cafe":
        "machines-a-cafe",

    "air-fryer":
        "air-fryer",

    "air-fryers":
        "air-fryer",

    "blender-hachoir-mixeur-batteur":
        "blender-hachoir-mixeur-batteur",

    "micro-onde":
        "micro-ondes",

    "micro-ondes":
        "micro-ondes",

    "four":
        "fours",

    "fours":
        "fours",

    "cuisiniere":
        "cuisinieres",

    "cuisinieres":
        "cuisinieres",

    "petran":
        "petran"

};


/* =====================================================
   CATEGORY KEY
===================================================== */

function getCategoryKey(value) {

    const normalized =
        normalizeText(value);

    return (
        categoryAliases[normalized] ||
        normalized
    );

}


/* =====================================================
   TYPE KEY
===================================================== */

function getTypeKey(value) {

    const normalized =
        normalizeText(value);

    return (
        typeAliases[normalized] ||
        normalized
    );

}


/* =====================================================
   TYPE NAMES
===================================================== */

const typeNames = {

    "aspirateurs":
        "Aspirateurs",

    "ventilateurs":
        "Ventilateurs",

    "climatisation":
        "Climatisation",

    "chauffages":
        "Chauffages",

    "chauffe-eau":
        "Chauffe-eau",

    "refrigerateurs":
        "Réfrigérateurs",

    "congelateurs":
        "Congélateurs",

    "televisions":
        "Télévisions",

    "machines-a-laver":
        "Machines à laver",

    "lave-vaisselle":
        "Lave-vaisselle",

    "machines-a-cafe":
        "Machines à café",

    "air-fryer":
        "Air Fryer",

    "blender-hachoir-mixeur-batteur":
        "Hachoir - Mixeur - Batteur - Blender",

    "micro-ondes":
        "Micro-ondes",

    "fours":
        "Fours",

    "cuisinieres":
        "Cuisinières",

    "petran":
        "Petran"

};


function getTypeDisplayName(type) {

    const key =
        getTypeKey(type);

    return (
        typeNames[key] ||
        "Produits"
    );

}


/* =====================================================
   GET CATEGORY INFO
===================================================== */

function getCategoryInfo() {

    const key =
        getCategoryKey(
            currentCategory
        );

    return (
        categoryInfo[key] || {

            label:
                "KANA ÉLECTROMÉNAGER",

            title:
                "Nos produits",

            description:
                "Découvrez notre sélection de produits."

        }
    );

}


/* =====================================================
   PAGE INFORMATION
===================================================== */

function updatePageInformation() {

    const category =
        getCategoryInfo();

    if (productsCategoryLabel) {

        productsCategoryLabel.textContent =
            category.label;

    }

    if (productsCategoryTitle) {

        productsCategoryTitle.textContent =
            category.title;

    }

    if (productsCategoryDescription) {

        productsCategoryDescription.textContent =
            category.description;

    }

    if (productsTitle) {

        productsTitle.textContent =
            currentType
                ? getTypeDisplayName(currentType)
                : category.title;

    }

    document.title =
        `${category.title} | KANA`;

}


/* =====================================================
   GET PRODUCTS FROM FIREBASE
===================================================== */

async function getAllProducts() {

    try {

        const productsRef =
            collection(
                db,
                "products"
            );

        const snapshot =
            await getDocs(
                productsRef
            );

        const products =
            snapshot.docs.map(
                productDocument => ({

                    id:
                        productDocument.id,

                    ...productDocument.data()

                })
            );

        console.log(
            "KANA products from Firebase:",
            products
        );

        return products;

    } catch (error) {

        console.error(
            "Erreur Firebase - chargement des produits:",
            error
        );

        return [];

    }

}


/* =====================================================
   FILTER PRODUCTS
===================================================== */

function filterProducts(
    products
) {

    let filtered =
        [...products];


    /* ---------------------------------------------
       CATEGORY
    --------------------------------------------- */

    if (
        currentCategory &&
        currentCategory.trim() !== ""
    ) {

        const requestedCategory =
            getCategoryKey(
                currentCategory
            );

        filtered =
            filtered.filter(
                product => {

                    const productCategory =
                        getCategoryKey(
                            product.category
                        );

                    return (
                        productCategory ===
                        requestedCategory
                    );

                }
            );

    }


    /* ---------------------------------------------
       TYPE
    --------------------------------------------- */

    if (
        currentType &&
        currentType.trim() !== ""
    ) {

        const requestedType =
            getTypeKey(
                currentType
            );

        filtered =
            filtered.filter(
                product => {

                    const productType =
                        getTypeKey(
                            product.type
                        );

                    return (
                        productType ===
                        requestedType
                    );

                }
            );

    }


    return filtered;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =====================================================
   PRICE
===================================================== */

function formatPrice(price) {

    if (
        price === undefined ||
        price === null ||
        price === ""
    ) {

        return `
            <div class="product-price">
                <strong>
                    Prix sur demande
                </strong>
            </div>
        `;

    }

    const number =
        Number(price);

    if (Number.isNaN(number)) {

        return `
            <div class="product-price">
                <strong>
                    ${escapeHTML(price)}
                </strong>
            </div>
        `;

    }

    return `
        <div class="product-price">

            <strong>
                ${number.toLocaleString("fr-FR")}
            </strong>

            <span>
                DA
            </span>

        </div>
    `;

}


/* =====================================================
   PRODUCT CARD
===================================================== */

function createProductCard(
    product
) {

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "product-card";

    const image =
        product.image || "";

    card.innerHTML = `

        <a
            href="product.html?id=${encodeURIComponent(
                product.id
            )}"
        >

            <div class="product-image-container">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(
                        product.name ||
                        "Produit"
                    )}"
                    loading="lazy"
                >

            </div>

            <div class="product-info">

                <h3 class="product-name">
                    ${escapeHTML(
                        product.name ||
                        "Produit"
                    )}
                </h3>

                ${
                    product.brand
                        ? `
                            <span class="product-brand">
                                ${escapeHTML(
                                    product.brand
                                )}
                            </span>
                        `
                        : ""
                }

                ${formatPrice(
                    product.price
                )}

                <div class="product-button">
                    VOIR LE PRODUIT
                </div>

            </div>

        </a>

    `;

    return card;

}


/* =====================================================
   DISPLAY PRODUCTS
===================================================== */

function displayProducts(
    products
) {

    if (!productsContainer) {

        console.error(
            "productsContainer introuvable."
        );

        return;

    }

    productsContainer.innerHTML =
        "";


    /* ---------------------------------------------
       EMPTY
    --------------------------------------------- */

    if (!products.length) {

        productsContainer.style.display =
            "none";

        if (emptyProducts) {

            emptyProducts.hidden =
                false;

        }

        if (productsCount) {

            productsCount.textContent =
                "Aucun produit disponible.";

        }

        return;

    }


    /* ---------------------------------------------
       SHOW
    --------------------------------------------- */

    productsContainer.style.display =
        "";

    if (emptyProducts) {

        emptyProducts.hidden =
            true;

    }

    products.forEach(
        product => {

            productsContainer.appendChild(
                createProductCard(product)
            );

        }
    );


    if (productsCount) {

        productsCount.textContent =
            `${products.length} produit${
                products.length > 1
                    ? "s"
                    : ""
            } disponible${
                products.length > 1
                    ? "s"
                    : ""
            }.`;

    }

}


/* =====================================================
   SORT
===================================================== */

function sortProductsList(
    products,
    sortType
) {

    const sorted =
        [...products];


    if (
        sortType ===
        "price-asc"
    ) {

        sorted.sort(
            (a, b) =>
                Number(a.price || 0) -
                Number(b.price || 0)
        );

    }


    if (
        sortType ===
        "price-desc"
    ) {

        sorted.sort(
            (a, b) =>
                Number(b.price || 0) -
                Number(a.price || 0)
        );

    }


    if (
        sortType ===
        "name"
    ) {

        sorted.sort(
            (a, b) =>
                String(a.name || "")
                    .localeCompare(
                        String(b.name || ""),
                        "fr"
                    )
        );

    }


    return sorted;

}


/* =====================================================
   PAGE INITIALIZATION
===================================================== */

async function initProductsPage() {

    updatePageInformation();

    if (productsContainer) {

        productsContainer.innerHTML = `
            <p class="products-loading">
                Chargement des produits...
            </p>
        `;

    }


    const allProducts =
        await getAllProducts();


    const filteredProducts =
        filterProducts(
            allProducts
        );


    console.log(
        "KANA filtered products:",
        filteredProducts
    );


    displayProducts(
        filteredProducts
    );


    /* ---------------------------------------------
       SORT
    --------------------------------------------- */

    if (sortProducts) {

        sortProducts.addEventListener(
            "change",
            function () {

                const sorted =
                    sortProductsList(
                        filteredProducts,
                        this.value
                    );

                displayProducts(
                    sorted
                );

            }
        );

    }

}


/* =====================================================
   DOM READY
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initProductsPage
    );

} else {

    initProductsPage();

}