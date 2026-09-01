/* =====================================================
   KANA — PRODUCTS PAGE
   Firestore = ONLY PRODUCT SOURCE

   NORMAL FILTERS:
   ?category=...
   ?type=...
   ?brand=...
   ?brand=...&category=...
   ?brand=...&type=...

   SPECIAL FILTERS:
   ?type=best-seller
   ?type=promotion
   ===================================================== */

import {
    db,
    collection,
    getDocs
} from "./firebase.js";


/* =====================================================
   1. URL PARAMETERS
===================================================== */

const params =
    new URLSearchParams(
        window.location.search
    );

const requestedCategory =
    params.get("category");

const requestedType =
    params.get("type");

const requestedBrand =
    params.get("brand");


/* =====================================================
   2. PAGE ELEMENTS
===================================================== */

const container =
    document.getElementById(
        "productsContainer"
    );

const emptyState =
    document.getElementById(
        "emptyProducts"
    );

const count =
    document.getElementById(
        "productsCount"
    );

const sortSelect =
    document.getElementById(
        "sortProducts"
    );


/* =====================================================
   3. CATEGORY INFORMATION
===================================================== */

const categoryInfo = {

    "maison-entretien": [
        "MAISON & ENTRETIEN",
        "Maison & Entretien",
        "Découvrez notre sélection de produits pour la maison et l'entretien."
    ],

    "refrigerateurs-congelateurs": [
        "RÉFRIGÉRATEURS - CONGÉLATEURS",
        "Réfrigérateurs - Congélateurs",
        "Découvrez notre sélection de réfrigérateurs et de congélateurs."
    ],

    televisions: [
        "TÉLÉVISIONS",
        "Télévisions",
        "Découvrez notre sélection de télévisions et Smart TV."
    ],

    "machines-a-laver": [
        "MACHINES À LAVER",
        "Machines à laver",
        "Découvrez notre sélection de machines à laver."
    ],

    "lave-vaisselle": [
        "LAVE-VAISSELLE",
        "Lave-vaisselle",
        "Découvrez notre sélection de lave-vaisselle."
    ],

    cuisine: [
        "CUISINE",
        "Cuisine",
        "Découvrez notre sélection d'appareils pour la cuisine."
    ]

};


/* =====================================================
   4. CATEGORY ALIASES
===================================================== */

const categoryAliases = {

    "maison-et-entretien":
        "maison-entretien",

    refrigerateur:
        "refrigerateurs-congelateurs",

    refrigerateurs:
        "refrigerateurs-congelateurs",

    congelateur:
        "refrigerateurs-congelateurs",

    congelateurs:
        "refrigerateurs-congelateurs",

    "refrigerateur-congelateur":
        "refrigerateurs-congelateurs",

    tv:
        "televisions",

    television:
        "televisions",

    "machine-a-laver":
        "machines-a-laver"

};


/* =====================================================
   5. TYPE ALIASES
===================================================== */

const typeAliases = {

    /* -----------------------------
       HOUSE & CLEANING
    ----------------------------- */

    aspirateur:
        "aspirateurs",

    aspirateurs:
        "aspirateurs",

    ventilateur:
        "ventilateurs",

    ventilateurs:
        "ventilateurs",

    climatiseur:
        "climatisation",

    climatiseurs:
        "climatisation",

    climatisation:
        "climatisation",

    chauffage:
        "chauffages",

    chauffages:
        "chauffages",

    "chauffe-eau":
        "chauffe-eau",

    "chauffe-eaux":
        "chauffe-eau",


    /* -----------------------------
       REFRIGERATORS
    ----------------------------- */

    refrigerateur:
        "refrigerateurs",

    refrigerateurs:
        "refrigerateurs",

    congelateur:
        "congelateurs",

    congelateurs:
        "congelateurs",


    /* -----------------------------
       TELEVISION
    ----------------------------- */

    tv:
        "televisions",

    television:
        "televisions",

    televisions:
        "televisions",


    /* -----------------------------
       WASHING MACHINES
    ----------------------------- */

    "machine-a-laver":
        "machines-a-laver",

    "machines-a-laver":
        "machines-a-laver",


    /* -----------------------------
       DISHWASHER
    ----------------------------- */

    "lave-vaisselle":
        "lave-vaisselle",


    /* -----------------------------
       KITCHEN
    ----------------------------- */

    "machine-a-cafe":
        "machines-a-cafe",

    "machines-a-cafe":
        "machines-a-cafe",

    "air-fryer":
        "air-fryer",

    "air-fryers":
        "air-fryer",

    blender:
        "blender-hachoir-mixeur-batteur",

    hachoir:
        "blender-hachoir-mixeur-batteur",

    mixeur:
        "blender-hachoir-mixeur-batteur",

    batteur:
        "blender-hachoir-mixeur-batteur",

    "micro-onde":
        "micro-ondes",

    "micro-ondes":
        "micro-ondes",

    four:
        "fours",

    fours:
        "fours",

    cuisiniere:
        "cuisinieres",

    cuisinieres:
        "cuisinieres",


    /* -----------------------------
       SPECIAL
    ----------------------------- */

    "best-seller":
        "best-seller",

    "best-sellers":
        "best-seller",

    bestseller:
        "best-seller",

    bestsellers:
        "best-seller",

    promotion:
        "promotion",

    promotions:
        "promotion"

};


/* =====================================================
   6. TYPE NAMES
===================================================== */

const typeNames = {

    aspirateurs:
        "Aspirateurs",

    ventilateurs:
        "Ventilateurs",

    climatisation:
        "Climatisation",

    chauffages:
        "Chauffages",

    "chauffe-eau":
        "Chauffe-eau",

    refrigerateurs:
        "Réfrigérateurs",

    congelateurs:
        "Congélateurs",

    televisions:
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

    fours:
        "Fours",

    cuisinieres:
        "Cuisinières",

    petran:
        "Petran",

    "best-seller":
        "Best Sellers",

    promotion:
        "Promotions"

};


/* =====================================================
   7. NORMALIZE TEXT
===================================================== */

function normalize(value) {

    return String(value || "")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /œ/g,
            "oe"
        )
        .replace(
            /æ/g,
            "ae"
        )
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );

}


/* =====================================================
   8. CATEGORY KEY
===================================================== */

function categoryKey(value) {

    const key =
        normalize(value);

    return (
        categoryAliases[key] ||
        key
    );

}


/* =====================================================
   9. TYPE KEY
===================================================== */

function typeKey(value) {

    const key =
        normalize(value);

    return (
        typeAliases[key] ||
        key
    );

}


/* =====================================================
   10. BRAND KEY
===================================================== */

function brandKey(value) {

    return normalize(value);

}


/* =====================================================
   11. FORMAT BRAND NAME
===================================================== */

function formatBrandName(value) {

    if (!value) {
        return "";
    }

    return String(value)
        .replace(
            /-/g,
            " "
        )
        .replace(
            /\b\w/g,
            function (letter) {
                return letter.toUpperCase();
            }
        );

}


/* =====================================================
   12. PAGE INFORMATION
===================================================== */

function setPageInformation() {

    const category =
        categoryKey(
            requestedCategory
        );

    const type =
        typeKey(
            requestedType
        );

    const brand =
        formatBrandName(
            requestedBrand
        );


    const info =
        categoryInfo[category] || [

            "KANA ÉLECTROMÉNAGER",

            "Nos produits",

            "Découvrez notre sélection de produits."

        ];


    /* ---------------------------------------------
       CATEGORY LABEL
    --------------------------------------------- */

    const categoryLabel =
        document.getElementById(
            "productsCategoryLabel"
        );

    const categoryTitle =
        document.getElementById(
            "productsCategoryTitle"
        );

    const categoryDescription =
        document.getElementById(
            "productsCategoryDescription"
        );


    if (categoryLabel) {

        categoryLabel.textContent =
            info[0];

    }


    if (categoryTitle) {

        categoryTitle.textContent =
            info[1];

    }


    if (categoryDescription) {

        categoryDescription.textContent =
            info[2];

    }


    /* ---------------------------------------------
       MAIN TITLE
    --------------------------------------------- */

    const productsTitle =
        document.getElementById(
            "productsTitle"
        );


    if (productsTitle) {

        if (type === "best-seller") {

            productsTitle.textContent =
                "Best Sellers";

        }

        else if (type === "promotion") {

            productsTitle.textContent =
                "Promotions";

        }

        else if (brand) {

            productsTitle.textContent =
                brand;

        }

        else if (requestedType) {

            productsTitle.textContent =
                typeNames[type] ||
                "Produits";

        }

        else {

            productsTitle.textContent =
                info[1];

        }

    }


    /* ---------------------------------------------
       DOCUMENT TITLE
    --------------------------------------------- */

    if (type === "best-seller") {

        document.title =
            "Best Sellers | KANA";

    }

    else if (type === "promotion") {

        document.title =
            "Promotions | KANA";

    }

    else if (brand) {

        document.title =
            brand +
            " | KANA";

    }

    else if (requestedType) {

        document.title =
            (
                typeNames[type] ||
                "Produits"
            ) +
            " | KANA";

    }

    else {

        document.title =
            info[1] +
            " | KANA";

    }

}


/* =====================================================
   13. CREATE ELEMENT
===================================================== */

function element(
    tag,
    className,
    text
) {

    const node =
        document.createElement(
            tag
        );


    if (className) {

        node.className =
            className;

    }


    if (text !== undefined) {

        node.textContent =
            text;

    }


    return node;

}


/* =====================================================
   14. PRODUCT PRICE
===================================================== */
function productPrice(product) {

    const wrapper =
        element(
            "div",
            "product-price"
        );

    const price =
        Number(product.price);

    const isPromotion =
        product.promotion === true &&
        Number.isFinite(
            Number(product.oldPrice)
        ) &&
        Number(product.oldPrice) > price;

    if (
        product.price === "" ||
        product.price === null ||
        product.price === undefined ||
        !Number.isFinite(price)
    ) {

        wrapper.appendChild(
            element(
                "strong",
                "",
                "Prix sur demande"
            )
        );

        return wrapper;
    }

    if (isPromotion) {

        const oldPrice =
            element(
                "del",
                "product-old-price",
                Number(
                    product.oldPrice
                ).toLocaleString("fr-FR") +
                " DA"
            );

        const newPrice =
            element(
                "strong",
                "product-new-price",
                price.toLocaleString("fr-FR") +
                " DA"
            );

        wrapper.append(
            oldPrice,
            newPrice
        );

        return wrapper;
    }

    wrapper.append(
        element(
            "strong",
            "",
            price.toLocaleString("fr-FR")
        ),

        element(
            "span",
            "",
            "DA"
        )
    );

    return wrapper;
}


/* =====================================================
   15. PRODUCT CARD
===================================================== */

function productCard(product) {

    const card =
        element(
            "article",
            "product-card"
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        "product.html?id=" +
        encodeURIComponent(
            product.id
        );


    /* ---------------------------------------------
       IMAGE
    --------------------------------------------- */

    const imageBox =
        element(
            "div",
            "product-image-container"
        );


    if (product.image) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            product.image;


        image.alt =
            product.name ||
            "Produit";


        image.loading =
            "lazy";


        image.onerror =
            function () {

                imageBox.classList.add(
                    "no-image"
                );


                imageBox.replaceChildren(
                    element(
                        "span",
                        "",
                        "Image indisponible"
                    )
                );

            };


        imageBox.appendChild(
            image
        );

    }

    else {

        imageBox.classList.add(
            "no-image"
        );


        imageBox.appendChild(
            element(
                "span",
                "",
                "Pas d'image"
            )
        );

    }


    /* ---------------------------------------------
       PRODUCT INFO
    --------------------------------------------- */

    const info =
        element(
            "div",
            "product-info"
        );


    info.appendChild(

        element(
            "h3",
            "product-name",
            product.name ||
            "Produit"
        )

    );


    if (product.brand) {

        info.appendChild(

            element(
                "span",
                "product-brand",
                product.brand
            )

        );

    }


    /* ---------------------------------------------
    SHORT DESCRIPTION
    --------------------------------------------- */

    if (product.description) {

      const shortDescription =
          String(product.description).length > 75
              ? String(product.description).substring(0, 75) + "..."
              : String(product.description);

      info.appendChild(

           element(
               "p",
              "product-description",
               shortDescription
            )

        );

    }


    /* ---------------------------------------------
    PRICE
    --------------------------------------------- */

    info.appendChild(
        productPrice(product)
    );

    link.append(
        imageBox,
        info
    );


    card.appendChild(
        link
    );


    return card;
 
}  


/* =====================================================
   16. DISPLAY PRODUCTS
===================================================== */

function display(
    products,
    message
) {

    if (!container) {
        return;
    }


    container.replaceChildren();


    /* ---------------------------------------------
       NO PRODUCTS
    --------------------------------------------- */

    if (!products.length) {

        container.style.display =
            "none";


        if (emptyState) {

            emptyState.hidden =
                false;

        }


        if (count) {

            count.textContent =
                message ||
                "Aucun produit disponible.";

        }


        return;

    }


    /* ---------------------------------------------
       PRODUCTS FOUND
    --------------------------------------------- */

    container.style.display =
        "";


    if (emptyState) {

        emptyState.hidden =
            true;

    }


    if (count) {

        count.textContent =
            products.length +
            (
                products.length > 1
                    ? " produits"
                    : " produit"
            );

    }


    products.forEach(
        function (product) {

            container.appendChild(
                productCard(product)
            );

        }
    );

}


/* =====================================================
   17. SORT PRODUCTS
===================================================== */

function sortProducts(products) {

    const result =
        products.slice();


    const price =
        function (item) {

            const value =
                Number(
                    item.price
                );


            return Number.isFinite(
                value
            )
                ? value
                : Number.POSITIVE_INFINITY;

        };


    /* ---------------------------------------------
       PRICE ASCENDING
    --------------------------------------------- */

    if (
        sortSelect &&
        sortSelect.value ===
        "price-asc"
    ) {

        result.sort(
            function (a, b) {

                return (
                    price(a) -
                    price(b)
                );

            }
        );

    }


    /* ---------------------------------------------
       PRICE DESCENDING
    --------------------------------------------- */

    if (
        sortSelect &&
        sortSelect.value ===
        "price-desc"
    ) {

        result.sort(
            function (a, b) {

                return (
                    price(b) -
                    price(a)
                );

            }
        );

    }


    /* ---------------------------------------------
       NAME
    --------------------------------------------- */

    if (
        sortSelect &&
        sortSelect.value ===
        "name"
    ) {

        result.sort(
            function (a, b) {

                return String(
                    a.name || ""
                ).localeCompare(
                    String(
                        b.name || ""
                    ),
                    "fr"
                );

            }
        );

    }


    return result;

}


/* =====================================================
   18. CHECK BEST SELLER
===================================================== */

function isBestSeller(product) {

    /*
       Main field:
       bestSeller: true

       Also accepts:
       bestseller: true
       isBestSeller: true
    */

    return (
        product.bestSeller === true ||
        product.bestseller === true ||
        product.isBestSeller === true
    );

}


/* =====================================================
   19. CHECK PROMOTION
===================================================== */

function isPromotion(product) {

    /*
       Main field:
       promotion: true

       Also accepts:
       isPromotion: true
       onPromotion: true
    */

    return (
        product.promotion === true ||
        product.isPromotion === true ||
        product.onPromotion === true
    );

}


/* =====================================================
   20. LOAD PRODUCTS FROM FIRESTORE
===================================================== */

async function loadCatalogue() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "products"
            )
        );


    return snapshot.docs.map(
        function (item) {

            return {

                id:
                    item.id,

                ...item.data()

            };

        }
    );

}


/* =====================================================
   21. FILTER PRODUCTS
===================================================== */

function filterProducts(products) {

    const category =
        categoryKey(
            requestedCategory
        );

    const type =
        typeKey(
            requestedType
        );

    const brand =
        brandKey(
            requestedBrand
        );


    return products.filter(
        function (product) {

            /* =========================================
               SPECIAL FILTER — BEST SELLERS
            ========================================= */

            if (
                type === "best-seller"
            ) {

                return isBestSeller(
                    product
                );

            }


            /* =========================================
               SPECIAL FILTER — PROMOTIONS
            ========================================= */

            if (
                type === "promotion"
            ) {

                return isPromotion(
                    product
                );

            }


            /* =========================================
               NORMAL PRODUCT FILTERS
            ========================================= */

            const productCategory =
                categoryKey(
                    product.category
                );


            const productType =
                typeKey(
                    product.type
                );


            const productBrand =
                brandKey(
                    product.brand
                );


            /* -----------------------------------------
               CATEGORY
            ----------------------------------------- */

            const categoryMatches =
                !category ||
                productCategory ===
                category;


            /* -----------------------------------------
               TYPE
            ----------------------------------------- */

            const typeMatches =
                !type ||
                productType ===
                type;


            /* -----------------------------------------
               BRAND
            ----------------------------------------- */

            const brandMatches =
                !brand ||
                productBrand ===
                brand;


            /* -----------------------------------------
               ALL FILTERS
            ----------------------------------------- */

            return (
                categoryMatches &&
                typeMatches &&
                brandMatches
            );

        }
    );

}


/* =====================================================
   22. SKELETON LOADING
===================================================== */

function showLoading() {

    if (!container) {
        return;
    }


    container.style.display =
        "";


    if (emptyState) {

        emptyState.hidden =
            true;

    }


    container.replaceChildren();


    /* ---------------------------------------------
       CREATE SKELETON CARDS
    --------------------------------------------- */

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const card =
            element(
                "article",
                "product-card product-card-skeleton"
            );


        const image =
            element(
                "div",
                "product-image-container skeleton-image"
            );


        const info =
            element(
                "div",
                "product-info"
            );


        const name =
            element(
                "div",
                "skeleton-line skeleton-name"
            );


        const brand =
            element(
                "div",
                "skeleton-line skeleton-brand"
            );


        const price =
            element(
                "div",
                "skeleton-line skeleton-price"
            );


        const button =
            element(
                "div",
                "skeleton-button"
            );


        info.append(
            name,
            brand,
            price,
            button
        );


        card.append(
            image,
            info
        );


        container.appendChild(
            card
        );

    }


    if (count) {

        count.textContent =
            "";

    }

}


/* =====================================================
   23. INITIALIZE
===================================================== */

async function initialize() {

    console.log(
        "KANA Products initialisation..."
    );


    /* ---------------------------------------------
       PAGE INFORMATION
    --------------------------------------------- */

    setPageInformation();


    /* ---------------------------------------------
       LOADING
    --------------------------------------------- */

    showLoading();


    try {

        /* -----------------------------------------
           LOAD PRODUCTS
        ----------------------------------------- */

        const products =
            await loadCatalogue();


        console.log(
            "Produits Firestore :",
            products
        );


        /* -----------------------------------------
           FILTER
        ----------------------------------------- */

        const filtered =
            filterProducts(
                products
            );


        console.log(
            "Produits après filtrage :",
            filtered
        );


        /* -----------------------------------------
           RENDER
        ----------------------------------------- */

        const render =
            function () {

                display(
                    sortProducts(
                        filtered
                    )
                );

            };


        /* -----------------------------------------
           SORT
        ----------------------------------------- */

        if (sortSelect) {

            sortSelect.addEventListener(
                "change",
                render
            );

        }


        render();

    }

    catch (error) {

        console.error(
            "Erreur Firestore lors du chargement des produits :",
            error
        );


        display(
            [],
            "Impossible de charger les produits."
        );

    }

}


/* =====================================================
   24. START
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );

}

else {

    initialize();

}