/* =====================================================
   KANA ÉLECTROMÉNAGER
   PRODUCT DETAILS PAGE
   FIREBASE VERSION
===================================================== */

import {
    db,
    doc,
    getDoc
} from "./firebase.js";


/* =====================================================
   1. GET PRODUCT ID
===================================================== */

const urlParams =
    new URLSearchParams(window.location.search);

const productId =
    urlParams.get("id");


/* =====================================================
   2. PAGE ELEMENTS
===================================================== */

const productImage =
    document.getElementById("productImage");

const productBrand =
    document.getElementById("productBrand");

const productName =
    document.getElementById("productName");

const productDescription =
    document.getElementById("productDescription");

const productPrice =
    document.getElementById("productPrice");

const productAvailability =
    document.getElementById("productAvailability");

const breadcrumbProduct =
    document.getElementById("breadcrumbProduct");

const whatsappProduct =
    document.getElementById("whatsappProduct");

const orderProduct =
    document.getElementById("orderProduct");

const addToCartProduct =
    document.getElementById("addToCartProduct");


/* =====================================================
   3. INSTALLMENT ELEMENTS
===================================================== */

const installmentButtons =
    document.querySelectorAll(
        ".installment-options button"
    );

const installmentPrice =
    document.getElementById(
        "installmentPrice"
    );


/* =====================================================
   4. GET PRODUCT FROM FIREBASE
===================================================== */

async function getProduct() {

    if (!productId) {

        console.error(
            "Aucun ID produit dans l'URL."
        );

        return null;

    }

    try {

        const productRef =
            doc(
                db,
                "products",
                productId
            );


        const productSnapshot =
            await getDoc(
                productRef
            );


        if (!productSnapshot.exists()) {

            console.error(
                "Produit introuvable dans Firebase:",
                productId
            );

            return null;

        }


        const product = {

            id:
                productSnapshot.id,

            ...productSnapshot.data()

        };


        console.log(
            "KANA product from Firebase:",
            product
        );


        return product;

    } catch (error) {

        console.error(
            "Erreur Firebase - chargement du produit:",
            error
        );

        return null;

    }

}


/* =====================================================
   5. FORMAT PRICE
===================================================== */

function formatPrice(price) {

    if (
        price === undefined ||
        price === null ||
        price === ""
    ) {

        return "Prix sur demande";

    }


    const number =
        Number(price);


    if (Number.isNaN(number)) {

        return `${price} DA`;

    }


    return `${number.toLocaleString(
        "fr-FR"
    )} DA`;

}


/* =====================================================
   6. INSTALLMENTS
===================================================== */

function setupInstallments(product) {

    if (
        !installmentButtons.length ||
        !installmentPrice
    ) {

        return;

    }


    const price =
        Number(product.price);


    if (
        Number.isNaN(price) ||
        price <= 0
    ) {

        installmentButtons.forEach(
            button => {

                button.disabled = true;

            }
        );


        installmentPrice.textContent =
            "—";

        return;

    }


    installmentPrice.textContent =
        "—";


    installmentButtons.forEach(
        button => {

            button.disabled = false;


            button.addEventListener(
                "click",
                function () {

                    const months =
                        Number(
                            button.dataset.months
                        );


                    if (
                        Number.isNaN(months) ||
                        months <= 0
                    ) {

                        return;

                    }


                    const monthlyPrice =
                        price / months;


                    installmentPrice.textContent =
                        `${monthlyPrice.toLocaleString(
                            "fr-FR",
                            {
                                maximumFractionDigits: 0
                            }
                        )} DA / mois`;


                    installmentButtons.forEach(
                        btn => {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );

                }
            );

        }
    );

}


/* =====================================================
   7. DISPLAY PRODUCT
===================================================== */

function displayProduct(product) {

    if (!product) {

        showProductNotFound();

        return;

    }


    /* =================================================
       IMAGE
    ================================================= */

    if (productImage) {

        if (product.image) {

            productImage.src =
                product.image;

            productImage.alt =
                product.name ||
                "Produit";

            productImage.style.display =
                "block";

        } else {

            productImage.style.display =
                "none";

        }

    }


    /* =================================================
       BRAND
    ================================================= */

    if (productBrand) {

        productBrand.textContent =
            product.brand ||
            "KANA";

    }


    /* =================================================
       NAME
    ================================================= */

    if (productName) {

        productName.textContent =
            product.name ||
            "Produit";

    }


    /* =================================================
       DESCRIPTION
    ================================================= */

    if (productDescription) {

        productDescription.textContent =
            product.description ||
            "Découvrez notre produit.";

    }


    /* =================================================
       PRICE
    ================================================= */

    if (productPrice) {

        productPrice.textContent =
            formatPrice(
                product.price
            );

    }


    /* =================================================
       AVAILABILITY
    ================================================= */

    if (productAvailability) {

        productAvailability.textContent =
            product.availability ||
            "Disponible";

    }


    /* =================================================
       BREADCRUMB
    ================================================= */

    if (breadcrumbProduct) {

        breadcrumbProduct.textContent =
            product.name ||
            "PRODUIT";

    }


    /* =================================================
       PAGE TITLE
    ================================================= */

    document.title =
        `${product.name || "Produit"} | KANA`;


    /* =================================================
       INSTALLMENTS
    ================================================= */

    setupInstallments(
        product
    );


    /* =================================================
       WHATSAPP
    ================================================= */

    setupWhatsApp(
        product
    );


    /* =================================================
       CART
    ================================================= */

    setupAddToCart(
        product
    );


    /* =================================================
       ORDER
    ================================================= */

    setupOrder(
        product
    );

}


/* =====================================================
   8. ADD TO CART
===================================================== */

function setupAddToCart(product) {

    if (!addToCartProduct) {

        return;

    }


    addToCartProduct.addEventListener(
        "click",
        function () {

            addProductToCart(
                product
            );

        }
    );

}


/* =====================================================
   9. ADD PRODUCT TO CART
===================================================== */

function addProductToCart(product) {

    let cart = [];


    try {

        const savedCart =
            localStorage.getItem(
                "kanaCart"
            );


        if (savedCart) {

            const parsedCart =
                JSON.parse(
                    savedCart
                );


            if (Array.isArray(parsedCart)) {

                cart =
                    parsedCart;

            }

        }

    } catch (error) {

        console.error(
            "Erreur lors du chargement du panier:",
            error
        );

    }


    const existingProduct =
        cart.find(
            item =>
                String(item.id) ===
                String(product.id)
        );


    if (existingProduct) {

        existingProduct.quantity =
            Number(
                existingProduct.quantity || 1
            ) + 1;

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name ||
                "Produit",

            price:
                product.price ?? 0,

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


    try {

        localStorage.setItem(
            "kanaCart",
            JSON.stringify(cart)
        );


        showAddedToCart();

    } catch (error) {

        console.error(
            "Erreur lors de l'enregistrement du panier:",
            error
        );

    }

}


/* =====================================================
   10. ADDED TO CART MESSAGE
===================================================== */

function showAddedToCart() {

    if (!addToCartProduct) {

        return;

    }


    const originalText =
        addToCartProduct.dataset.originalText ||
        addToCartProduct.textContent;


    addToCartProduct.dataset.originalText =
        originalText;


    addToCartProduct.textContent =
        "AJOUTÉ AU PANIER ✓";


    setTimeout(
        function () {

            addToCartProduct.textContent =
                originalText;

        },
        1500
    );

}


/* =====================================================
   11. WHATSAPP
===================================================== */

function setupWhatsApp(product) {

    if (!whatsappProduct) {

        return;

    }


    const phoneNumber =
        "213799846032";


    const message =
        `Bonjour, je suis intéressé(e) par le produit : ${product.name || ""}`;


    const whatsappURL =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            message
        )}`;


    whatsappProduct.href =
        whatsappURL;

}


/* =====================================================
   12. ORDER
===================================================== */

function setupOrder(product) {

    if (!orderProduct) {

        return;

    }


    orderProduct.href =
        `checkout.html?id=${encodeURIComponent(
            product.id
        )}`;

}


/* =====================================================
   13. PRODUCT NOT FOUND
===================================================== */

function showProductNotFound() {

    if (productImage) {

        productImage.style.display =
            "none";

    }


    if (productBrand) {

        productBrand.textContent =
            "KANA";

    }


    if (productName) {

        productName.textContent =
            "Produit introuvable";

    }


    if (productDescription) {

        productDescription.textContent =
            "Ce produit n'existe pas ou n'est plus disponible.";

    }


    if (productPrice) {

        productPrice.textContent =
            "";

    }


    if (productAvailability) {

        productAvailability.textContent =
            "Indisponible";

    }


    if (breadcrumbProduct) {

        breadcrumbProduct.textContent =
            "PRODUIT";

    }


    installmentButtons.forEach(
        button => {

            button.disabled =
                true;

            button.classList.remove(
                "active"
            );

        }
    );


    if (installmentPrice) {

        installmentPrice.textContent =
            "—";

    }


    if (whatsappProduct) {

        whatsappProduct.style.display =
            "none";

    }


    if (orderProduct) {

        orderProduct.style.display =
            "none";

    }


    if (addToCartProduct) {

        addToCartProduct.style.display =
            "none";

    }

}


/* =====================================================
   14. INITIALIZE
===================================================== */

async function initProductPage() {

    console.log(
        "KANA product ID:",
        productId
    );


    const product =
        await getProduct();


    displayProduct(
        product
    );

}


/* =====================================================
   15. START
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initProductPage
    );

} else {

    initProductPage();

}