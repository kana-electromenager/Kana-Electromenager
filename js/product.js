/* =====================================================
   KANA ÉLECTROMÉNAGER
   PRODUCT DETAILS PAGE
===================================================== */


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

const productCategory =
    document.getElementById("productCategory");

const productType =
    document.getElementById("productType");

const productAvailability =
    document.getElementById("productAvailability");

const breadcrumbProduct =
    document.getElementById("breadcrumbProduct");

const productExtraDescription =
    document.getElementById(
        "productExtraDescription"
    );

const whatsappProduct =
    document.getElementById(
        "whatsappProduct"
    );

const orderProduct =
    document.getElementById(
        "orderProduct"
    );

const addToCartProduct =
    document.getElementById(
        "addToCartProduct"
    );


/* =====================================================
   3. GET ALL PRODUCTS
===================================================== */

function getAllProducts() {

    let allProducts = [];


    /* ---------------------------------------------
       DEFAULT PRODUCTS
    --------------------------------------------- */

    if (typeof productsData !== "undefined") {

        if (Array.isArray(productsData)) {

            allProducts = [
                ...productsData
            ];

        }

    }


    /* ---------------------------------------------
       ADMIN PRODUCTS
    --------------------------------------------- */

    try {

        const savedProducts =
            localStorage.getItem(
                "kanaProducts"
            );


        if (savedProducts) {

            const adminProducts =
                JSON.parse(savedProducts);


            if (Array.isArray(adminProducts)) {

                allProducts = [
                    ...allProducts,
                    ...adminProducts
                ];

            }

        }

    } catch (error) {

        console.error(
            "Erreur lors du chargement des produits Admin.",
            error
        );

    }


    return allProducts;

}


/* =====================================================
   4. FIND PRODUCT
===================================================== */

function getProduct() {

    if (!productId) {

        return null;

    }


    const allProducts =
        getAllProducts();


    return allProducts.find(
        product =>
            String(product.id) ===
            String(productId)
    );

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


    return `${number.toLocaleString("fr-FR")} DA`;

}


/* =====================================================
   6. DISPLAY PRODUCT
===================================================== */

function displayProduct(product) {

    if (!product) {

        showProductNotFound();

        return;

    }


    /* ---------------------------------------------
       IMAGE
    --------------------------------------------- */

    if (productImage) {

        productImage.src =
            product.image || "";

        productImage.alt =
            product.name || "Produit";

        productImage.style.display =
            "block";

    }


    /* ---------------------------------------------
       BRAND
    --------------------------------------------- */

    if (productBrand) {

        productBrand.textContent =
            product.brand || "KANA";

    }


    /* ---------------------------------------------
       NAME
    --------------------------------------------- */

    if (productName) {

        productName.textContent =
            product.name || "Produit";

    }


    /* ---------------------------------------------
       DESCRIPTION
    --------------------------------------------- */

    if (productDescription) {

        productDescription.textContent =
            product.description ||
            "Découvrez notre produit.";

    }


    /* ---------------------------------------------
       PRICE
    --------------------------------------------- */

    if (productPrice) {

        productPrice.textContent =
            formatPrice(product.price);

    }


    /* ---------------------------------------------
       CATEGORY
    --------------------------------------------- */

    if (productCategory) {

        productCategory.textContent =
            product.category || "—";

    }


    /* ---------------------------------------------
       TYPE
    --------------------------------------------- */

    if (productType) {

        productType.textContent =
            product.type || "—";

    }


    /* ---------------------------------------------
       AVAILABILITY
    --------------------------------------------- */

    if (productAvailability) {

        productAvailability.textContent =
            product.availability ||
            "Disponible";

    }


    /* ---------------------------------------------
       BREADCRUMB
    --------------------------------------------- */

    if (breadcrumbProduct) {

        breadcrumbProduct.textContent =
            product.name || "PRODUIT";

    }


    /* ---------------------------------------------
       BROWSER TITLE
    --------------------------------------------- */

    document.title =
        `${product.name || "Produit"} | KANA`;


    /* ---------------------------------------------
       EXTRA DESCRIPTION
    --------------------------------------------- */

    if (productExtraDescription) {

        const description =
            product.description ||
            "Les informations détaillées de ce produit seront disponibles prochainement.";


        productExtraDescription.innerHTML = "";


        const paragraph =
            document.createElement("p");


        paragraph.textContent =
            description;


        productExtraDescription.appendChild(
            paragraph
        );

    }


    /* ---------------------------------------------
       WHATSAPP
    --------------------------------------------- */

    setupWhatsApp(product);


    /* ---------------------------------------------
       ADD TO CART
    --------------------------------------------- */

    setupAddToCart(product);


    /* ---------------------------------------------
       ORDER
    --------------------------------------------- */

    setupOrder(product);

}


/* =====================================================
   7. ADD TO CART
===================================================== */

function setupAddToCart(product) {

    if (!addToCartProduct) {

        console.warn(
            "Le bouton AJOUTER AU PANIER est introuvable."
        );

        return;

    }


    addToCartProduct.addEventListener(
        "click",
        function () {

            addProductToCart(product);

        }
    );

}


/* =====================================================
   8. ADD PRODUCT TO CART
===================================================== */

function addProductToCart(product) {

    let cart = [];


    /* ---------------------------------------------
       GET EXISTING CART
    --------------------------------------------- */

    try {

        const savedCart =
            localStorage.getItem("kanaCart");


        if (savedCart) {

            const parsedCart =
                JSON.parse(savedCart);


            if (Array.isArray(parsedCart)) {

                cart = parsedCart;

            }

        }

    } catch (error) {

        console.error(
            "Erreur lors du chargement du panier.",
            error
        );

    }


    /* ---------------------------------------------
       CHECK IF PRODUCT ALREADY EXISTS
    --------------------------------------------- */

    const existingProduct =
        cart.find(
            item =>
                String(item.id) ===
                String(product.id)
        );


    if (existingProduct) {

        existingProduct.quantity =
            Number(existingProduct.quantity || 1) + 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name || "Produit",

            price: product.price ?? 0,

            image: product.image || "",

            brand: product.brand || "KANA",

            category: product.category || "",

            type: product.type || "",

            quantity: 1

        });

    }


    /* ---------------------------------------------
       SAVE CART
    --------------------------------------------- */

    try {

        localStorage.setItem(
            "kanaCart",
            JSON.stringify(cart)
        );

        showAddedToCart();

    } catch (error) {

        console.error(
            "Erreur lors de l'enregistrement du panier.",
            error
        );

    }

}


/* =====================================================
   9. SHOW ADDED MESSAGE
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
   10. WHATSAPP
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
   11. ORDER PRODUCT
===================================================== */

function setupOrder(product) {

    if (!orderProduct) {

        return;

    }


    const checkoutURL =
        `checkout.html?id=${encodeURIComponent(
            product.id
        )}`;


    orderProduct.href =
        checkoutURL;

}


/* =====================================================
   12. PRODUCT NOT FOUND
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


    if (productCategory) {

        productCategory.textContent =
            "—";

    }


    if (productType) {

        productType.textContent =
            "—";

    }


    if (productAvailability) {

        productAvailability.textContent =
            "Indisponible";

    }


    if (breadcrumbProduct) {

        breadcrumbProduct.textContent =
            "PRODUIT";

    }


    if (productExtraDescription) {

        productExtraDescription.innerHTML = `

            <p>
                Aucun produit correspondant
                à cette référence n'a été trouvé.
            </p>

        `;

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
   13. INITIALIZE
===================================================== */

function initProductPage() {

    const product =
        getProduct();


    displayProduct(product);

}


initProductPage();