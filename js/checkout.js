/* =====================================================
   KANA ÉLECTROMÉNAGER
   CHECKOUT
===================================================== */

import {
    db,
    collection,
    addDoc,
    serverTimestamp
} from "./firebase.js";


/* =====================================================
   1. GET CART
===================================================== */

function getCart() {

    try {

        const saved = localStorage.getItem("kanaCart");

        if (!saved) {
            return [];
        }

        const cart = JSON.parse(saved);

        return Array.isArray(cart) ? cart : [];

    } catch (error) {

        console.error("Erreur panier :", error);

        return [];

    }

}


/* =====================================================
   2. PAGE ELEMENTS
===================================================== */

const checkoutTotal =
    document.getElementById("checkoutTotal");

const checkoutForm =
    document.getElementById("checkoutForm");

const wilayaSelect =
    document.getElementById("wilaya");

const communeSelect =
    document.getElementById("commune");

const confirmOrder =
    document.getElementById("confirmOrder");


/* =====================================================
   3. ALGERIA ADMINISTRATIVE DATA
===================================================== */

let communesData = [];


/*
   Current Algeria data:
   69 wilayas
   1541 communes

   Source:
   GeoAlgeria
*/

async function loadAlgeriaData() {

    try {

        const response = await fetch(
            "https://cdn.jsdelivr.net/npm/geoalgeria/data/ecommerce/communes.json"
        );

        if (!response.ok) {
            throw new Error(
                "Impossible de charger les données des wilayas."
            );
        }

        communesData = await response.json();

        console.log(
            "Données Algérie chargées :",
            communesData.length,
            "communes"
        );

        loadWilayas();

    } catch (error) {

        console.error(
            "Erreur chargement wilayas :",
            error
        );

        if (wilayaSelect) {

            wilayaSelect.innerHTML = `
                <option value="">
                    Impossible de charger les wilayas
                </option>
            `;

        }

    }

}


/* =====================================================
   4. LOAD WILAYAS
===================================================== */

function loadWilayas() {

    if (!wilayaSelect) {
        return;
    }

    wilayaSelect.innerHTML = `
        <option value="">
            Choisir une wilaya
        </option>
    `;


    /*
       Create unique wilayas from the dataset.
    */

    const wilayasMap = new Map();


    communesData.forEach(item => {

        const code =
            Number(item.wilaya_code);

        const name =
            item.wilaya_name_fr;


        if (
            code &&
            name &&
            !wilayasMap.has(code)
        ) {

            wilayasMap.set(
                code,
                name
            );

        }

    });


    /*
       Sort numerically:
       01
       02
       ...
       69
    */

    const wilayas =
        Array.from(
            wilayasMap.entries()
        ).sort(
            (a, b) => a[0] - b[0]
        );


    wilayas.forEach(
        ([code, name]) => {

            const option =
                document.createElement("option");

            option.value =
                String(code).padStart(2, "0");

            option.textContent =
                `${String(code).padStart(2, "0")} - ${name}`;

            wilayaSelect.appendChild(
                option
            );

        }
    );

}


/* =====================================================
   5. LOAD COMMUNES
===================================================== */

function loadCommunes(wilayaCode) {

    if (!communeSelect) {
        return;
    }


    communeSelect.innerHTML = `
        <option value="">
            Choisir une commune
        </option>
    `;


    communeSelect.disabled = true;


    if (!wilayaCode) {
        return;
    }


    const numericCode =
        Number(wilayaCode);


    const communes =
        communesData
            .filter(
                item =>
                    Number(item.wilaya_code) ===
                    numericCode
            )
            .sort(
                (a, b) =>
                    a.commune_name_fr.localeCompare(
                        b.commune_name_fr,
                        "fr"
                    )
            );


    communes.forEach(
        item => {

            const option =
                document.createElement("option");

            option.value =
                item.commune_name_fr;

            option.textContent =
                item.commune_name_fr;

            communeSelect.appendChild(
                option
            );

        }
    );


    communeSelect.disabled =
        communes.length === 0;

}


/* =====================================================
   6. WILAYA CHANGE
===================================================== */

if (wilayaSelect) {

    wilayaSelect.addEventListener(
        "change",
        event => {

            loadCommunes(
                event.target.value
            );

        }
    );

}


/* =====================================================
   7. FORMAT PRICE
===================================================== */

function formatPrice(price) {

    const number =
        Number(price);

    if (Number.isNaN(number)) {
        return "Prix sur demande";
    }

    return `${number.toLocaleString("fr-FR")} DA`;

}


/* =====================================================
   8. DISPLAY CART TOTAL
===================================================== */

function displayCheckoutTotal() {

    const cart =
        getCart();


    if (!checkoutTotal) {
        return;
    }


    if (!cart.length) {

        checkoutTotal.innerHTML = `
            <div class="checkout-error">
                Votre panier est vide.
            </div>
        `;

        if (confirmOrder) {
            confirmOrder.disabled = true;
        }

        return;

    }


    let total = 0;


    cart.forEach(product => {

        const price =
            Number(product.price) || 0;

        const quantity =
            Number(product.quantity) || 1;

        total +=
            price * quantity;

    });


    checkoutTotal.innerHTML = `

        <div class="checkout-total-content">

            <span class="checkout-total-label">
                TOTAL
            </span>

            <strong class="checkout-total-price">
                ${formatPrice(total)}
            </strong>

        </div>

    `;


    if (confirmOrder) {
        confirmOrder.disabled = false;
    }

}


/* =====================================================
   9. VALIDATE PHONE
===================================================== */

function isValidPhone(phone) {

    const cleaned =
        phone.replace(/\s+/g, "");

    return /^0[567]\d{8}$/.test(
        cleaned
    );

}


/* =====================================================
   10. CREATE ORDER
===================================================== */

async function createOrder() {

    const cart =
        getCart();


    if (!cart.length) {

        alert(
            "Votre panier est vide."
        );

        return;

    }


    const customerName =
        document
            .getElementById("customerName")
            ?.value
            .trim();


    const customerPhone =
        document
            .getElementById("customerPhone")
            ?.value
            .trim();


    const wilayaCode =
        wilayaSelect?.value || "";


    const commune =
        communeSelect?.value || "";


    const address =
        document
            .getElementById("address")
            ?.value
            .trim();


    const notes =
        document
            .getElementById("notes")
            ?.value
            .trim();


    /* =================================================
       VALIDATION
    ================================================= */

    if (
        !customerName ||
        !customerPhone ||
        !wilayaCode ||
        !commune ||
        !address
    ) {

        alert(
            "Veuillez remplir tous les champs obligatoires."
        );

        return;

    }


    if (!isValidPhone(customerPhone)) {

        alert(
            "Veuillez entrer un numéro de téléphone algérien valide."
        );

        return;

    }


    const wilaya =
        communesData.find(
            item =>
                String(item.wilaya_code).padStart(2, "0") ===
                wilayaCode
        );


    if (!wilaya) {

        alert(
            "Wilaya invalide."
        );

        return;

    }


    /* =================================================
       CALCUL TOTAL
    ================================================= */

    let total = 0;


    const products =
        cart.map(product => {

            const price =
                Number(product.price) || 0;

            const quantity =
                Number(product.quantity) || 1;


            total +=
                price * quantity;


            return {

                id:
                    String(product.id),

                name:
                    product.name || "",

                brand:
                    product.brand || "KANA",

                image:
                    product.image || "",

                price:
                    price,

                quantity:
                    quantity

            };

        });


    /* =================================================
       ORDER OBJECT
    ================================================= */

    const order = {

        orderId:
            "KANA-" + Date.now(),

        products:
            products,

        total:
            total,

        customer: {

            name:
                customerName,

            phone:
                customerPhone,

            wilayaCode:
                wilayaCode,

            wilaya:
                wilaya.wilaya_name_fr,

            commune:
                commune,

            address:
                address,

            notes:
                notes || ""

        },

        status:
            "Nouvelle",

        paymentMethod:
            "Paiement à la livraison",

        createdAt:
            serverTimestamp()

    };


    /* =================================================
       SEND TO FIRESTORE
    ================================================= */

    try {

        if (confirmOrder) {

            confirmOrder.disabled =
                true;

            confirmOrder.textContent =
                "ENREGISTREMENT...";

        }


        console.log(
            "Envoi de la commande vers Firebase...",
            order
        );


        const orderRef =
            await addDoc(
                collection(
                    db,
                    "orders"
                ),
                order
            );


        console.log(
            "Commande Firebase créée :",
            orderRef.id
        );


        /*
           Clear cart after successful order.
        */

        localStorage.removeItem(
            "kanaCart"
        );


        alert(
            "Votre commande a été enregistrée avec succès."
        );


        window.location.href =
            "index.html";


    } catch (error) {

        console.error(
            "ERREUR FIREBASE COMMANDE :",
            error
        );


        alert(
            "Impossible d'enregistrer la commande. Vérifiez votre connexion et réessayez."
        );


        if (confirmOrder) {

            confirmOrder.disabled =
                false;

            confirmOrder.textContent =
                "CONFIRMER LA COMMANDE";

        }

    }

}


/* =====================================================
   11. FORM SUBMIT
===================================================== */

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            await createOrder();

        }
    );

}


/* =====================================================
   12. INITIALIZE
===================================================== */

async function initCheckout() {

    console.log(
        "KANA Checkout initialisation..."
    );


    displayCheckoutTotal();


    if (communeSelect) {

        communeSelect.disabled =
            true;

    }


    await loadAlgeriaData();


    console.log(
        "Checkout prêt."
    );

}


initCheckout();