/* =====================================================
   KANA — PRODUCT DETAIL
   Firestore
   Compatible with the exact product.html
===================================================== */

import {
    db,
    doc,
    getDoc
} from "./firebase.js";


/* =====================================================
   PRODUCT ID
===================================================== */

const productId =
new URLSearchParams(window.location.search).get("id");


/* =====================================================
   ELEMENTS
===================================================== */

const image =
    document.getElementById("productImage");

const imageSkeleton =
document.getElementById(
"productImageSkeleton"
);

const brand =
document.getElementById("productBrand");

const name =
document.getElementById("productName");

const description =
document.getElementById(
"productDescription"
);

const price =
document.getElementById("productPrice");

const availability =
document.getElementById(
"productAvailability"
);

const breadcrumb =
document.getElementById(
"breadcrumbProduct"
);

const characteristics =
    document.getElementById(
        "productCharacteristics"
    );

const characteristicsTitle =
    document.querySelector(
        ".product-characteristics-title"
    );

const whatsapp =
document.getElementById(
"whatsappProduct"
);

const order =
document.getElementById(
"orderProduct"
);

const addToCart =
document.getElementById(
"addToCartProduct"
);

const installmentPrice =
    document.getElementById(
        "installmentPrice"
    );

const installmentButtons =
document.querySelectorAll(
".installment-options button"
    );


/* =====================================================
   REMOVE SKELETON
===================================================== */

function removeSkeletons() {

    /*
       Remove skeleton class from every element
       that has it.

       This is the important part for your HTML.
    */

    const skeletons =
        document.querySelectorAll(
            ".skeleton"
        );


    skeletons.forEach(
        function (element) {

            element.classList.remove(
                "skeleton"
            );

            /*
               Also remove individual skeleton
               modifier classes.
            */

            element.classList.remove(
                "skeleton-brand",
                "skeleton-title",
                "skeleton-description",
                "skeleton-price",
                "skeleton-payment-title",
                "skeleton-payment-btn",
                "skeleton-installment-result",
                "skeleton-characteristics-title",
                "skeleton-availability",
                "skeleton-action"
            );

        }
    );


    /*
       Product image skeleton
    */

    if (imageSkeleton) {

        imageSkeleton.style.display =
            "none";

    }


    /*
       Make sure the real product image
       is visible when it exists.
    */

    if (image) {

        image.style.visibility =
            "visible";

    }

}


/* =====================================================
   SHOW SKELETON
===================================================== */

function showSkeleton() {

    const skeletons =
        document.querySelectorAll(
            ".skeleton"
        );


    skeletons.forEach(
        function (element) {

            element.style.display = "";

        }
    );


    if (imageSkeleton) {

        imageSkeleton.style.display =
            "";

    }

}


/* =====================================================
   LOAD PRODUCT FROM FIRESTORE
===================================================== */

async function loadProduct() {

    if (
!productId ||
productId.includes("/")
    ) {

        return null;

    }


    const productRef =
        doc(
            db,
            "products",
            productId
        );


    const snapshot =
        await getDoc(
            productRef
        );


    if (
        !snapshot.exists()
    ) {

        return null;

    }


    return {

        id:
            snapshot.id,

        ...snapshot.data()

    };

}


/* =====================================================
   FORMAT PRICE
===================================================== */

function formatPrice(value) {
    
    if (
value === "" ||
value === null ||
value === undefined
    ) {

        return "Prix sur demande";

    }


    const number =
        Number(value);


    if (
!Number.isFinite(number)
) {

        return "Prix sur demande";
    
    }


    return (
number.toLocaleString(
            "fr-FR"
        ) +
        " DA"
    );

}


/* =====================================================
   AVAILABILITY
===================================================== */

function getAvailability(product) {

    if (
product.availability ===
"Disponible"
    ) {

        return "Disponible";

    }


    if (
product.availability ===
        "Indisponible"
    ) {

        return "Indisponible";

    }


    return Number(product.stock) > 0
        ? "Disponible"
        : "Indisponible";

}


/* =====================================================
   CHARACTERISTICS
===================================================== */

function displayCharacteristics(
    product
) {

    if (!characteristics) {

        return;

    }


    characteristics.replaceChildren();


    const data =
        product.characteristics;


    /*
       No characteristics
    */

    if (
        !data ||
        typeof data !== "object" ||
        Array.isArray(data)
    ) {

        characteristics.style.display =
            "none";

        if (characteristicsTitle) {

            characteristicsTitle.style.display =
                "none";

        }

        return;

    }


    const entries =
        Object.entries(data)
            .filter(
                function ([key, value]) {

                    return (
                        String(key).trim() !== "" &&
                        String(value).trim() !== ""
                    );

                }
            );


    /*
       Empty characteristics
    */

    if (!entries.length) {

        characteristics.style.display =
            "none";

        if (characteristicsTitle) {

            characteristicsTitle.style.display =
                "none";

        }

        return;

    }


    /*
       Show section
    */

    characteristics.style.display =
        "";


    if (characteristicsTitle) {

        characteristicsTitle.style.display =
            "";

    }


    const list =
        document.createElement(
            "div"
        );


    list.className =
        "characteristics-list";


    entries.forEach(
        function ([key, value]) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "characteristic-row";


            const label =
                document.createElement(
                    "span"
                );


            label.className =
                "characteristic-label";


            label.textContent =
                key;


            const result =
                document.createElement(
                    "strong"
                );


            result.className =
                "characteristic-value";


            result.textContent =
                value;


            row.appendChild(
                label
            );


            row.appendChild(
                result
            );


            list.appendChild(
                row
            );

        }
    );


    characteristics.appendChild(
        list
    );

}


/* =====================================================
   INSTALLMENTS
===================================================== */

function configureInstallments(
    product
) {

    const amount =
        Number(
            product.price
        );


    const enabled =
        Number.isFinite(amount) &&
        amount > 0;


            if (installmentPrice) {

                installmentPrice.textContent =
                    "—";

    }


    installmentButtons.forEach(
        function (button) {

            button.disabled =
                !enabled;


            button.classList.remove(
                "active"
            );


            button.onclick =
                null;


            if (!enabled) {

                return;

            }


            button.onclick =
                function () {

                    const months =
                        Number(
                            button.dataset.months
                        );


                    if (
                        !Number.isFinite(
                            months
                        ) ||
                        months <= 0
                    ) {

                        return;

                    }


                    installmentButtons
                        .forEach(
                            function (item) {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    if (
                        installmentPrice
                    ) {

                        installmentPrice
                            .textContent =
                            (
                                amount /
                                months
                            )
                            .toLocaleString(
                                "fr-FR",
                                {
maximumFractionDigits:
                                        0
                                }
) +
                    " DA / mois";
            
                    }

                };

        }
    );

}


/* =====================================================
   CART
===================================================== */

function addProductToCart(
product
) {

    let cart = [];


    try {

        const saved =
localStorage.getItem(
                "kanaCart"
            );


        if (saved) {

            const parsed =
                JSON.parse(
                    saved
                );


            if (
                Array.isArray(
                    parsed
                )
            ) {

                cart =
                    parsed;

            }

        }

    } catch (error) {

        console.error(
"Erreur panier :",
            error
        );

    }


    const existing =
        cart.find(
            function (item) {

                return String(
                    item.id
                ) ===
                String(
                    product.id
                );

            }
        );


    if (existing) {

        existing.quantity =
Number(
existing.quantity || 1
) + 1;

    } else {

        cart.push({

            id:
product.id,

            name:
product.name ||
"Produit",

            price:
product.price ??
0,

            image:
product.image ||
"",
            
            brand:
                product.brand ||
                "KANA",

            category:
                product.category ||
                "",

            type:
                product.type ||
                "",

            quantity:
                1

        });

    }


    localStorage.setItem(
        "kanaCart",
        JSON.stringify(
            cart
        )
    );

}


/* =====================================================
   ACTIONS
===================================================== */

function configureActions(
product
) {

    /*
       WHATSAPP
    */

    if (whatsapp) {

        const message =
"Bonjour, je suis intéressé(e) par le produit : " +
            (
product.name ||
                ""
);


        whatsapp.href =
"https://wa.me/213799846032?text=" +
            encodeURIComponent(
                message
            );

    }


    /*
       ORDER
    */

    if (order) {

        order.href =
"checkout.html?id=" +
encodeURIComponent(
product.id
);

    }


    /*
       CART
    */

    if (addToCart) {
        
        addToCart.onclick =
            function () {

                try {

                    addProductToCart(
                        product
                    );


                    const original =
                        addToCart.dataset
                            .originalText ||
                        "AJOUTER AU PANIER";


                    addToCart.dataset
                        .originalText =
                        original;


                addToCart.textContent =
"AJOUTÉ AU PANIER ✓";


                window.setTimeout(
function () {

addToCart.textContent =
original;

                        },
1500
);


            } catch (error) {
                
                    console.error(
                        "Erreur panier :",
                        error
                    );

                }

            };

    }

}


/* =====================================================
   PRODUCT NOT FOUND
===================================================== */

function showNotFound() {
    
    /*
       First remove skeleton.
    */

    removeSkeletons();


    if (image) {

image.style.display =
            "none";

    }


    if (imageSkeleton) {

        imageSkeleton.style.display =
            "none";

    }


    if (brand) {

        brand.textContent =
            "KANA";

    }


    if (name) {

        name.textContent =
"Produit introuvable";
    
    }


    if (description) {

description.textContent =
"Ce produit n'existe pas ou n'est plus disponible.";
    
    }


    if (price) {

price.textContent =
"";
    
    }


    if (availability) {

availability.textContent =
"Indisponible";
    
    }


    if (breadcrumb) {

breadcrumb.textContent =
"PRODUIT";
    
    }


    if (characteristics) {

        characteristics.style.display =
            "none";

    }


    if (characteristicsTitle) {

        characteristicsTitle.style.display =
            "none";

    }


    if (installmentPrice) {

installmentPrice.textContent =
"—";

    }


    installmentButtons.forEach(
function (button) {

        button.disabled =
true;

        button.classList.remove(
"active"
);
    
        }
);
    

    [
whatsapp,
order,
addToCart

].forEach(
function (element) {

        if (element) {

element.style.display =
                    "none";

            }

        }
    );

}


/* =====================================================
   DISPLAY PRODUCT
===================================================== */

function displayProduct(
product
) {

    if (!product) {

        showNotFound();

        return;

    }


    /* =================================================
       IMAGE
    ================================================= */

    if (image) {

        image.alt =
product.name ||
"Produit";


        image.onerror =
            function () {

                if (imageSkeleton) {

                    imageSkeleton.style.display =
                        "none";

                }


                image.style.display =
                    "none";

            };


        if (product.image) {
            
            /*
               Keep skeleton until image is
               actually loaded.
            */

            image.style.display =
                "none";


            if (imageSkeleton) {

                imageSkeleton.style.display =
                    "";

            }


            image.onload =
                function () {

                    if (imageSkeleton) {

                        imageSkeleton.style.display =
                            "none";

                    }


image.style.display =
                        "block";

                };


            image.src =
                product.image;

        } else {

            image.removeAttribute(
"src"
);


            image.style.display =
                "none";


            if (imageSkeleton) {

                imageSkeleton.style.display =
                    "none";

            }

        }

    }


    /* =================================================
       BRAND
    ================================================= */

    if (brand) {

        brand.textContent =
            product.brand ||
            "KANA";

    }


    /* =================================================
       NAME
    ================================================= */

    if (name) {

        name.textContent =
            product.name ||
            "Produit";

    }


    /* =================================================
       DESCRIPTION
    ================================================= */

    if (description) {

description.textContent =
product.description ||
"Découvrez notre produit.";
    
    }


    /* =================================================
       PRICE
    ================================================= */

    if (price) {

price.textContent =
formatPrice(
product.price
);
    
    }


    /* =================================================
       AVAILABILITY
    ================================================= */

    if (availability) {

availability.textContent =
getAvailability(
product
);
    
    }


    /* =================================================
       BREADCRUMB
    ================================================= */

    if (breadcrumb) {

breadcrumb.textContent =
            product.name ||
            "PRODUIT";

    }


    /* =================================================
       CHARACTERISTICS
    ================================================= */

    displayCharacteristics(
        product
    );


    /* =================================================
       PAGE TITLE
    ================================================= */

    document.title =
        (
            product.name ||
            "Produit"
        ) +
        " | KANA";


    /* =================================================
       INSTALLMENTS
    ================================================= */

    configureInstallments(
        product
    );


    /* =================================================
       ACTIONS
    ================================================= */

    configureActions(
        product
    );


    /*
       NOW:
       Product data exists.
       Remove skeletons from text/buttons.
    */

    removeSkeletons();

}


/* =====================================================
   INITIALIZE
===================================================== */

async function initialize() {
    
    /*
       Keep skeleton visible while Firestore
       is loading.
    */

    showSkeleton();


    try {

        const product =
            await loadProduct();


        displayProduct(
            product
        );

    } catch (error) {

        console.error(
"Erreur Firestore lors du chargement du produit :",
error
);


        showNotFound();
    
}

}


/* =====================================================
   START
===================================================== */

if (
document.readyState ===
"loading"
) {

document.addEventListener(
"DOMContentLoaded",
initialize
);

} else {

initialize();

}