/* =====================================================
   KANA — PRODUCT DETAIL
   Firestore
   Cart Drawer
   Promotion Price
   Characteristics
   Installments
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
    new URLSearchParams(
        window.location.search
    ).get("id");


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
   CART DRAWER
===================================================== */

const cartDrawer =
    document.getElementById("cartDrawer");

const cartOverlay =
    document.getElementById("cartOverlay");

const closeCartDrawer =
    document.getElementById("closeCartDrawer");

const cartDrawerContent =
    document.getElementById("cartDrawerContent");

const cartDrawerFooter =
    document.getElementById("cartDrawerFooter");


/* =====================================================
   FORMAT PRICE
===================================================== */

function formatPrice(value) {

    const number =
        Number(value);

    if (!Number.isFinite(number)) {

        return "Prix sur demande";

    }

    return (
        number.toLocaleString("fr-FR") +
        " DA"
    );

}


/* =====================================================
   PROMOTION
===================================================== */

/*
    Promotion works like this:

    promotion = true
    oldPrice = previous price
    price = promotional/current price

    Example:

    price    = 75000
    oldPrice = 90000
    promotion = true

    Display:

    90 000 DA
    75 000 DA
*/

function hasValidPromotion(product) {

    const currentPrice =
        Number(product.price);

    const oldPrice =
        Number(product.oldPrice);

    return (
        product.promotion === true &&
        Number.isFinite(currentPrice) &&
        Number.isFinite(oldPrice) &&
        oldPrice > currentPrice
    );

}


function displayProductPrice(product) {

    if (!price) {
        return;
    }


    price.replaceChildren();


    const currentPrice =
        Number(product.price);


    if (!Number.isFinite(currentPrice)) {

        price.textContent =
            "Prix sur demande";

        return;

    }


    if (
        hasValidPromotion(product)
    ) {

        const oldPriceElement =
            document.createElement("del");

        oldPriceElement.className =
            "product-old-price";

        oldPriceElement.textContent =
            formatPrice(
                product.oldPrice
            );


        const newPriceElement =
            document.createElement("strong");

        newPriceElement.className =
            "product-new-price";

        newPriceElement.textContent =
            formatPrice(
                product.price
            );


        price.append(
            oldPriceElement,
            newPriceElement
        );


        return;

    }


    price.textContent =
        formatPrice(
            product.price
        );

}


/* =====================================================
   LOAD PRODUCT
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


    if (!snapshot.exists()) {

        return null;

    }


    return {

        id:
            snapshot.id,

        ...snapshot.data()

    };

}


/* =====================================================
   SKELETONS
===================================================== */

function removeSkeletons() {

    const skeletons =
        document.querySelectorAll(
            ".skeleton"
        );


    skeletons.forEach(
        function (element) {

            element.classList.remove(
                "skeleton"
            );

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


    if (imageSkeleton) {

        imageSkeleton.style.display =
            "none";

    }


    if (image) {

        image.style.visibility =
            "visible";

    }

}


function showSkeleton() {

    const skeletons =
        document.querySelectorAll(
            ".skeleton"
        );


    skeletons.forEach(
        function (element) {

            element.style.display =
                "";

        }
    );


    if (imageSkeleton) {

        imageSkeleton.style.display =
            "";

    }

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

function displayCharacteristics(product) {

    if (!characteristics) {

        return;

    }


    characteristics.replaceChildren();


    const data =
        product.characteristics;


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


    if (!entries.length) {

        characteristics.style.display =
            "none";


        if (characteristicsTitle) {

            characteristicsTitle.style.display =
                "none";

        }


        return;

    }


    characteristics.style.display =
        "";


    if (characteristicsTitle) {

        characteristicsTitle.style.display =
            "";

    }


    const list =
        document.createElement("div");


    list.className =
        "characteristics-list";


    entries.forEach(
        function ([key, value]) {

            const row =
                document.createElement("div");


            row.className =
                "characteristic-row";


            const label =
                document.createElement("span");


            label.className =
                "characteristic-label";


            label.textContent =
                key;


            const result =
                document.createElement("strong");


            result.className =
                "characteristic-value";


            result.textContent =
                value;


            row.append(
                label,
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
   Promotion = NEW PRICE
===================================================== */

function configureInstallments(product) {

    console.log("PRODUCT PRICE:", product.price);
    console.log("PRODUCT OLD PRICE:", product.oldPrice);
    console.log("PRODUCT PROMOTION:", product.promotion);

    const currentPrice = Number(product.price);

    const validPrice =
        Number.isFinite(currentPrice) &&
        currentPrice > 0;


    if (installmentPrice) {

        installmentPrice.textContent = "—";

    }


    installmentButtons.forEach(function (button) {

        button.disabled = !validPrice;

        button.classList.remove("active");


        if (!validPrice) {

            return;

        }


        button.onclick = function () {

            const months =
                Number(button.dataset.months);


            if (
                !Number.isFinite(months) ||
                months <= 0
            ) {

                return;

            }


            installmentButtons.forEach(function (item) {

                item.classList.remove("active");

            });


            button.classList.add("active");


            const monthlyAmount =
                currentPrice / months;


            if (installmentPrice) {

                installmentPrice.textContent =
                    monthlyAmount.toLocaleString(
                        "fr-FR",
                        {
                            maximumFractionDigits: 0
                        }
                    ) +
                    " DA / mois";

            }

        };

    });


    /*
       ============================================
       AFFICHER AUTOMATIQUEMENT 10 MOIS
       SI UN BOUTON 10 MOIS EXISTE
       ============================================
    */

    const defaultButton =
        document.querySelector(
            '.installment-options button[data-months="10"]'
        );


    if (defaultButton && validPrice) {

        defaultButton.click();

    }

}

/* =====================================================
   ADD PRODUCT TO CART
===================================================== */

function addProductToCart(product) {

    let cart = [];


    try {

        const saved =
            localStorage.getItem(
                "kanaCart"
            );


        if (saved) {

            const parsed =
                JSON.parse(saved);


            if (
                Array.isArray(parsed)
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

                return (
                    String(item.id) ===
                    String(product.id)
                );

            }
        );


    if (existing) {

        existing.quantity =
            (
                Number(
                    existing.quantity
                ) || 1
            ) + 1;
        existing.price =
             product.price ?? 0;

        existing.oldPrice =
             product.oldPrice ?? null;

        existing.promotion =
             product.promotion === true;

        existing.name =
              product.name ||
              "Produit";

        existing.image =
              product.image ||
             "";

        existing.brand =
              product.brand ||
             "KANA";

        existing.category =
             product.category ||
             "";

        existing.type =
               product.type ||
              "";    

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

            oldPrice:
                product.oldPrice ??
                null,

            promotion:
                product.promotion === true,

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
        JSON.stringify(cart)
    );

}


/* =====================================================
   GET CART
===================================================== */

function getCart() {

    try {

        const saved =
            localStorage.getItem(
                "kanaCart"
            );


        if (!saved) {

            return [];

        }


        const cart =
            JSON.parse(saved);


        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        console.error(
            "Erreur panier :",
            error
        );


        return [];

    }

}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart(cart) {

    localStorage.setItem(
        "kanaCart",
        JSON.stringify(cart)
    );

}


/* =====================================================
   CART PRICE
===================================================== */

function formatCartPrice(value) {

    const number =
        Number(value) || 0;


    return (
        number.toLocaleString(
            "fr-FR"
        ) +
        " DA"
    );

}


/* =====================================================
   CART DRAWER
===================================================== */

function renderCartDrawer() {

    if (!cartDrawerContent) {

        return;

    }


    const cart =
        getCart();


    /* ---------------------------------------------
       EMPTY
    --------------------------------------------- */

    if (!cart.length) {

        cartDrawerContent.innerHTML = `

            <div class="cart-drawer-empty">

                <div class="cart-empty-icon">
                    🛒
                </div>

                <h3>
                    Votre panier est vide
                </h3>

                <p>
                    Aucun produit ajouté pour le moment.
                </p>

            </div>

        `;


        if (cartDrawerFooter) {

            cartDrawerFooter.innerHTML = `

                <a
                    href="cart.html"
                    class="cart-drawer-view-cart"
                >
                    VOIR MON PANIER
                </a>

            `;

        }


        return;

    }


    cartDrawerContent.innerHTML =
        "";


    let total =
        0;


    cart.forEach(
        function (product, index) {

            const itemPrice =
                Number(
                    product.price
                ) || 0;


            const quantity =
                Number(
                    product.quantity
                ) || 1;


            const subtotal =
                itemPrice *
                quantity;


            total +=
                subtotal;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "cart-drawer-item";


            item.innerHTML = `

                <div class="cart-drawer-image">

                    <img
                        src="${product.image || ""}"
                        alt="${product.name || "Produit"}"
                    >

                </div>


                <div class="cart-drawer-info">

                    <h3>
                        ${product.name || "Produit"}
                    </h3>


                    <span class="cart-drawer-price">
                        ${formatCartPrice(itemPrice)}
                    </span>


                    <div class="cart-drawer-controls">

                        <button
                            type="button"
                            class="drawer-quantity-btn"
                            data-index="${index}"
                            data-change="-1"
                        >
                            −
                        </button>


                        <span>
                            ${quantity}
                        </span>


                        <button
                            type="button"
                            class="drawer-quantity-btn"
                            data-index="${index}"
                            data-change="1"
                        >
                            +
                        </button>

                    </div>


                    <strong class="cart-drawer-subtotal">
                        ${formatCartPrice(subtotal)}
                    </strong>


                    <button
                        type="button"
                        class="drawer-remove-btn"
                        data-index="${index}"
                    >
                        SUPPRIMER
                    </button>

                </div>

            `;


            cartDrawerContent.appendChild(
                item
            );

        }
    );


    /* ---------------------------------------------
       FOOTER
    --------------------------------------------- */

    if (cartDrawerFooter) {

        cartDrawerFooter.innerHTML = `

            <div class="cart-drawer-total">

                <span>
                    TOTAL
                </span>

                <strong>
                    ${formatCartPrice(total)}
                </strong>

            </div>


            <a
                href="checkout.html"
                class="cart-drawer-checkout"
            >
                COMMANDER
            </a>


            <a
                href="cart.html"
                class="cart-drawer-view-cart"
            >
                VOIR LE PANIER
            </a>

        `;

    }


    /* ---------------------------------------------
       QUANTITY
    --------------------------------------------- */

    document
        .querySelectorAll(
            ".drawer-quantity-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        const change =
                            Number(
                                button.dataset.change
                            );


                        const updatedCart =
                            getCart();


                        if (
                            !updatedCart[index]
                        ) {

                            return;

                        }


                        updatedCart[index].quantity =
                            (
                                Number(
                                    updatedCart[index].quantity
                                ) || 1
                            ) +
                            change;


                        if (
                            updatedCart[index].quantity <=
                            0
                        ) {

                            updatedCart.splice(
                                index,
                                1
                            );

                        }


                        saveCart(
                            updatedCart
                        );


                        renderCartDrawer();

                    }
                );

            }
        );


    /* ---------------------------------------------
       REMOVE
    --------------------------------------------- */

    document
        .querySelectorAll(
            ".drawer-remove-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        const updatedCart =
                            getCart();


                        updatedCart.splice(
                            index,
                            1
                        );


                        saveCart(
                            updatedCart
                        );


                        renderCartDrawer();

                    }
                );

            }
        );

}


/* =====================================================
   OPEN CART
===================================================== */

function openCartDrawer() {

    renderCartDrawer();


    if (cartDrawer) {

        cartDrawer.classList.add(
            "open"
        );

    }


    if (cartOverlay) {

        cartOverlay.classList.add(
            "show"
        );

    }


    document.body.classList.add(
        "cart-drawer-open"
    );

}


/* =====================================================
   CLOSE CART
===================================================== */

function closeCartDrawerMenu() {

    if (cartDrawer) {

        cartDrawer.classList.remove(
            "open"
        );

    }


    if (cartOverlay) {

        cartOverlay.classList.remove(
            "show"
        );

    }


    document.body.classList.remove(
        "cart-drawer-open"
    );

}


/* =====================================================
   ACTIONS
===================================================== */

function configureActions(product) {

    /* ---------------------------------------------
       WHATSAPP
    --------------------------------------------- */

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


    /* ---------------------------------------------
       ORDER
    --------------------------------------------- */

    if (order) {

        order.href =
            "checkout.html?id=" +
            encodeURIComponent(
                product.id
            );

    }


    /* ---------------------------------------------
       CART
    --------------------------------------------- */

    if (addToCart) {

        addToCart.onclick =
            function () {

                try {

                    addProductToCart(
                        product
                    );


                    openCartDrawer();


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

function displayProduct(product) {

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

    displayProductPrice(
        product
    );


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
       TITLE
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


    removeSkeletons();

}


/* =====================================================
   CART DRAWER EVENTS
===================================================== */

if (closeCartDrawer) {

    closeCartDrawer.addEventListener(
        "click",
        closeCartDrawerMenu
    );

}


if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeCartDrawerMenu
    );

}


/* =====================================================
   ESC
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeCartDrawerMenu();

        }

    }
);


/* =====================================================
   INITIALIZE
===================================================== */

async function initialize() {

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