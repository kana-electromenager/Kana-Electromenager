/* =====================================================
   KANA ÉLECTROMÉNAGER
   ADMIN DASHBOARD
===================================================== */

/*
   IMPORTANT :
   Ce fichier est un MODULE.
   Dans index.html :

   <script src="../data/products-data.js"></script>
   <script type="module" src="../js/admin.js"></script>
*/


/* =====================================================
   1. FIREBASE
===================================================== */

import {
    db,
    collection,
    getDocs
} from "./firebase.js";


/* =====================================================
   2. PRODUCTS DATA
===================================================== */

const products =
    Array.isArray(window.productsData)
        ? window.productsData
        : (
            typeof productsData !== "undefined"
                ? productsData
                : []
        );


/* =====================================================
   3. DASHBOARD ELEMENTS
===================================================== */

const totalProducts =
    document.getElementById("totalProducts");

const totalCategories =
    document.getElementById("totalCategories");

const totalBrands =
    document.getElementById("totalBrands");

const totalOrders =
    document.getElementById("totalOrders");

const newOrders =
    document.getElementById("newOrders");

const availableProducts =
    document.getElementById("availableProducts");

const recentOrders =
    document.getElementById("recentOrders");


/* =====================================================
   4. PRODUCT STATISTICS
===================================================== */

function updateProductStats() {

    /* -------------------------------------------------
       TOTAL PRODUCTS
    ------------------------------------------------- */

    if (totalProducts) {

        totalProducts.textContent =
            products.length;

    }


    /* -------------------------------------------------
       AVAILABLE PRODUCTS
    ------------------------------------------------- */

    const available =
        products.filter(product => {

            return (
                String(
                    product.availability || ""
                ).trim().toLowerCase()
                === "disponible"
            );

        });


    if (availableProducts) {

        availableProducts.textContent =
            available.length;

    }


    /* -------------------------------------------------
       CATEGORIES
    ------------------------------------------------- */

    const categories =
        new Set(

            products
                .map(product =>
                    product.category
                )
                .filter(Boolean)

        );


    if (totalCategories) {

        totalCategories.textContent =
            categories.size;

    }


    /* -------------------------------------------------
       BRANDS
    ------------------------------------------------- */

    const brands =
        new Set(

            products
                .map(product =>
                    product.brand
                )
                .filter(Boolean)

        );


    if (totalBrands) {

        totalBrands.textContent =
            brands.size;

    }

}


/* =====================================================
   5. GET ORDER STATUS
===================================================== */

function getOrderStatus(order) {

    const status =
        order?.status;


    if (!status) {

        return "Nouvelle";

    }


    /*
       On accepte plusieurs écritures
       possibles pour éviter les problèmes
       avec les anciennes commandes.
    */

    const normalized =
        String(status)
            .trim()
            .toLowerCase();


    if (
        normalized === "nouvelle" ||
        normalized === "new"
    ) {

        return "Nouvelle";

    }


    if (
        normalized === "confirmée" ||
        normalized === "confirmee" ||
        normalized === "confirmed"
    ) {

        return "Confirmée";

    }


    if (
        normalized === "livrée" ||
        normalized === "livree" ||
        normalized === "delivered"
    ) {

        return "Livrée";

    }


    if (
        normalized === "annulée" ||
        normalized === "annulee" ||
        normalized === "cancelled"
    ) {

        return "Annulée";

    }


    return status;

}


/* =====================================================
   6. DATE HELPER
===================================================== */

function getOrderDate(createdAt) {

    if (!createdAt) {

        return 0;

    }


    try {

        /*
           Firebase Timestamp
        */

        if (
            typeof createdAt.toDate === "function"
        ) {

            return createdAt
                .toDate()
                .getTime();

        }


        /*
           Firestore timestamp object
        */

        if (
            createdAt.seconds !== undefined
        ) {

            return (
                Number(createdAt.seconds) * 1000
            );

        }


        /*
           JS Date / string
        */

        const date =
            new Date(createdAt);


        if (
            !Number.isNaN(
                date.getTime()
            )
        ) {

            return date.getTime();

        }

    } catch (error) {

        console.error(
            "Erreur date commande :",
            error
        );

    }


    return 0;

}


/* =====================================================
   7. FORMAT PRICE
===================================================== */

function formatPrice(value) {

    const price =
        Number(value);


    if (
        Number.isNaN(price)
    ) {

        return "Prix non disponible";

    }


    return (
        price.toLocaleString("fr-FR")
        + " DA"
    );

}


/* =====================================================
   8. FORMAT DATE
===================================================== */

function formatDate(createdAt) {

    const timestamp =
        getOrderDate(createdAt);


    if (!timestamp) {

        return "Date inconnue";

    }


    return new Date(timestamp)
        .toLocaleString(
            "fr-FR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


/* =====================================================
   9. LOAD ORDERS FROM FIRESTORE
===================================================== */

async function loadOrders() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "orders"
                )
            );


        const orders = [];


        snapshot.forEach(
            documentSnapshot => {

                orders.push({

                    firestoreId:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }
        );


        /*
           Plus récente → plus ancienne
        */

        orders.sort(
            (a, b) => {

                return (
                    getOrderDate(
                        b.createdAt
                    )
                    -
                    getOrderDate(
                        a.createdAt
                    )
                );

            }
        );


        /* -------------------------------------------------
           TOTAL ORDERS
        ------------------------------------------------- */

        if (totalOrders) {

            totalOrders.textContent =
                orders.length;

        }


        /* -------------------------------------------------
           NEW ORDERS
        ------------------------------------------------- */

        const newOrdersCount =
            orders.filter(
                order =>
                    getOrderStatus(order)
                    === "Nouvelle"
            ).length;


        if (newOrders) {

            newOrders.textContent =
                newOrdersCount;

        }


        /* -------------------------------------------------
           RECENT ORDERS
        ------------------------------------------------- */

        renderRecentOrders(
            orders
        );


        /*
           Retourner les commandes au cas où
           on en aurait besoin plus tard.
        */

        return orders;

    } catch (error) {

        console.error(
            "Erreur lors du chargement des commandes :",
            error
        );


        if (totalOrders) {

            totalOrders.textContent =
                "—";

        }


        if (newOrders) {

            newOrders.textContent =
                "—";

        }


        if (recentOrders) {

            recentOrders.innerHTML = `

                <div class="admin-empty">

                    <span>
                        Impossible de charger les commandes
                    </span>

                    <p>
                        Vérifiez votre connexion Firebase.
                    </p>

                </div>

            `;

        }


        return [];

    }

}


/* =====================================================
   10. RENDER RECENT ORDERS
===================================================== */

function renderRecentOrders(
    orders
) {

    /*
       Si la section n'existe pas dans index.html,
       on ne fait rien.
    */

    if (!recentOrders) {

        return;

    }


    /*
       Aucune commande
    */

    if (!orders.length) {

        recentOrders.innerHTML = `

            <div class="admin-empty">

                <span>
                    Aucune commande
                </span>

                <p>
                    Les nouvelles commandes apparaîtront ici.
                </p>

            </div>

        `;

        return;

    }


    /*
       Afficher les 5 dernières
    */

    const latestOrders =
        orders.slice(0, 5);


    recentOrders.innerHTML = "";


    latestOrders.forEach(
        order => {

            const customer =
                order.customer || {};


            const customerName =
                customer.name ||
                order.customerName ||
                "Client";


            const productName =
                order.productName ||
                order.product?.name ||
                "Produit";


            const price =
                order.price ||
                order.total ||
                0;


            const status =
                getOrderStatus(
                    order
                );


            const orderElement =
                document.createElement("a");


            orderElement.href =
                "orders.html";


            orderElement.className =
                "admin-recent-order";


            orderElement.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(
                            customerName
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            productName
                        )}
                    </span>

                </div>


                <div>

                    <strong>
                        ${formatPrice(
                            price
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            status
                        )}
                    </span>

                </div>

            `;


            recentOrders.appendChild(
                orderElement
            );

        }
    );

}

/* =====================================================
   MAKE DASHBOARD CARDS CLICKABLE
===================================================== */

function setupStatCards() {

    makeCardClickable(
        totalProducts,
        "products.html"
    );

    makeCardClickable(
        totalCategories,
        "categories.html"
    );

    makeCardClickable(
        totalBrands,
        "brands.html"
    );

    makeCardClickable(
        totalOrders,
        "orders.html"
    );

    makeCardClickable(
        newOrders,
        "orders.html?status=Nouvelle"
    );

    makeCardClickable(
        availableProducts,
        "products.html?availability=Disponible"
    );

}


/* =====================================================
   MAKE CARD CLICKABLE
===================================================== */

function makeCardClickable(
    statElement,
    destination
) {

    if (!statElement) {
        return;
    }


    const card =
        statElement.closest(
            ".admin-stat-card"
        );


    if (!card) {
        return;
    }


    if (
        card.dataset.clickable === "true"
    ) {
        return;
    }


    card.dataset.clickable = "true";


    card.setAttribute(
        "role",
        "link"
    );


    card.setAttribute(
        "tabindex",
        "0"
    );


    card.style.cursor = "pointer";


    card.addEventListener(
        "click",
        function () {

            window.location.href =
                destination;

        }
    );


    card.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                window.location.href =
                    destination;

            }

        }
    );

}



/* =====================================================
   13. LOGOUT
===================================================== */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            /*
               Pour le moment :
               retour à la page de connexion.
            */

            window.location.href =
                "login.html";

        }
    );

}


/* =====================================================
   14. ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   15. INITIALIZE DASHBOARD
===================================================== */

function initializeDashboard() {

    /*
       Produits / catégories / marques /
       produits disponibles
    */

    updateProductStats();


    /*
       Cartes cliquables
    */

    setupStatCards();


    /*
       Commandes Firestore
    */

    loadOrders();

}


/* =====================================================
   16. START
===================================================== */

initializeDashboard();