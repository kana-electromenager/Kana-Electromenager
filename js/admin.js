/* =====================================================
   KANA ÉLECTROMÉNAGER
   ADMIN DASHBOARD
   FIRESTORE VERSION
===================================================== */

import {
    db,
    collection,
    getDocs
} from "./firebase.js";


/* =====================================================
   1. DASHBOARD ELEMENTS
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

const logoutButton =
    document.getElementById("logoutButton");


/* =====================================================
   2. DATA
===================================================== */

let products = [];

let orders = [];


/* =====================================================
   3. NORMALIZE TEXT
===================================================== */

function normalizeText(value) {

    return String(value || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


/* =====================================================
   4. LOAD PRODUCTS FROM FIRESTORE
===================================================== */

async function loadProducts() {

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


        products =
            snapshot.docs.map(
                productDocument => ({

                    id:
                        productDocument.id,

                    ...productDocument.data()

                })
            );


        console.log(
            "KANA Dashboard - produits Firestore:",
            products
        );


        return products;


    } catch (error) {

        console.error(
            "Erreur Firebase - produits:",
            error
        );


        products = [];


        return [];

    }

}


/* =====================================================
   5. PRODUCT STATISTICS
===================================================== */

function updateProductStats() {


    /* =================================================
       TOTAL PRODUCTS
    ================================================= */

    if (totalProducts) {

        totalProducts.textContent =
            products.length;

    }


    /* =================================================
       AVAILABLE PRODUCTS
    ================================================= */

    const available =
        products.filter(
            product => {

                const availability =
                    normalizeText(
                        product.availability
                    );


                return (
                    availability ===
                    "disponible"
                );

            }
        );


    if (availableProducts) {

        availableProducts.textContent =
            available.length;

    }


    /* =================================================
       CATEGORIES
    ================================================= */

    const categories =
        new Set();


    products.forEach(
        product => {

            if (
                product.category !==
                undefined &&
                product.category !==
                null &&
                String(
                    product.category
                ).trim() !== ""
            ) {

                categories.add(
                    normalizeText(
                        product.category
                    )
                );

            }

        }
    );


    if (totalCategories) {

        totalCategories.textContent =
            categories.size;

    }


    /* =================================================
       BRANDS
    ================================================= */

    const brands =
        new Set();


    products.forEach(
        product => {

            if (
                product.brand !==
                undefined &&
                product.brand !==
                null &&
                String(
                    product.brand
                ).trim() !== ""
            ) {

                brands.add(
                    normalizeText(
                        product.brand
                    )
                );

            }

        }
    );


    if (totalBrands) {

        totalBrands.textContent =
            brands.size;

    }


    console.log(
        "KANA Dashboard - statistiques produits:",
        {
            totalProducts:
                products.length,

            categories:
                categories.size,

            brands:
                brands.size,

            available:
                available.length
        }
    );

}


/* =====================================================
   6. GET ORDER STATUS
===================================================== */

function getOrderStatus(order) {

    /*
       On cherche plusieurs noms possibles
       pour rester compatible avec les anciennes
       commandes.
    */

    const rawStatus =
        order?.status ??
        order?.orderStatus ??
        order?.order_status ??
        "";


    if (
        !rawStatus ||
        String(rawStatus).trim() === ""
    ) {

        return "Nouvelle";

    }


    const normalized =
        normalizeText(
            rawStatus
        );


    /* -------------------------------------------------
       NOUVELLE
    ------------------------------------------------- */

    if (
        normalized === "nouvelle" ||
        normalized === "new"
    ) {

        return "Nouvelle";

    }


    /* -------------------------------------------------
       CONFIRMEE
    ------------------------------------------------- */

    if (
        normalized === "confirmee" ||
        normalized === "confirmed"
    ) {

        return "Confirmée";

    }


    /* -------------------------------------------------
       LIVREE
    ------------------------------------------------- */

    if (
        normalized === "livree" ||
        normalized === "delivered"
    ) {

        return "Livrée";

    }


    /* -------------------------------------------------
       ANNULEE
    ------------------------------------------------- */

    if (
        normalized === "annulee" ||
        normalized === "cancelled"
    ) {

        return "Annulée";

    }


    return String(
        rawStatus
    );

}


/* =====================================================
   7. ORDER DATE
===================================================== */

function getOrderDate(
    createdAt
) {

    if (!createdAt) {

        return 0;

    }


    try {

        /* ---------------------------------------------
           Firebase Timestamp
        --------------------------------------------- */

        if (
            typeof createdAt.toDate ===
            "function"
        ) {

            return createdAt
                .toDate()
                .getTime();

        }


        /* ---------------------------------------------
           Firestore Timestamp object
        --------------------------------------------- */

        if (
            createdAt.seconds !==
            undefined
        ) {

            return (
                Number(
                    createdAt.seconds
                ) * 1000
            );

        }


        /* ---------------------------------------------
           Date / String
        --------------------------------------------- */

        const date =
            new Date(
                createdAt
            );


        if (
            !Number.isNaN(
                date.getTime()
            )
        ) {

            return date.getTime();

        }

    } catch (error) {

        console.error(
            "Erreur date commande:",
            error
        );

    }


    return 0;

}


/* =====================================================
   8. FORMAT PRICE
===================================================== */

function formatPrice(
    value
) {

    const price =
        Number(value);


    if (
        Number.isNaN(price)
    ) {

        return "Prix non disponible";

    }


    return (
        price.toLocaleString(
            "fr-FR"
        )
        + " DA"
    );

}


/* =====================================================
   9. FORMAT DATE
===================================================== */

function formatDate(
    createdAt
) {

    const timestamp =
        getOrderDate(
            createdAt
        );


    if (!timestamp) {

        return "Date inconnue";

    }


    return new Date(
        timestamp
    ).toLocaleString(
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
   10. LOAD ORDERS FROM FIRESTORE
===================================================== */

async function loadOrders() {

    try {

        const ordersRef =
            collection(
                db,
                "orders"
            );


        const snapshot =
            await getDocs(
                ordersRef
            );


        orders =
            snapshot.docs.map(
                orderDocument => ({

                    firestoreId:
                        orderDocument.id,

                    ...orderDocument.data()

                })
            );


        console.log(
            "KANA Dashboard - commandes Firestore:",
            orders
        );


        /* ---------------------------------------------
           SORT
        --------------------------------------------- */

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


        /* =================================================
           TOTAL COMMANDES
        ================================================= */

        if (totalOrders) {

            totalOrders.textContent =
                orders.length;

        }


        /* =================================================
           NOUVELLES COMMANDES
        ================================================= */

        const newOrdersCount =
            orders.filter(
                order => {

                    return (
                        getOrderStatus(
                            order
                        ) === "Nouvelle"
                    );

                }
            ).length;


        if (newOrders) {

            newOrders.textContent =
                newOrdersCount;

        }


        /* =================================================
           RECENT ORDERS
        ================================================= */

        renderRecentOrders(
            orders
        );


        console.log(
            "KANA Dashboard - statistiques commandes:",
            {
                total:
                    orders.length,

                nouvelles:
                    newOrdersCount
            }
        );


        return orders;


    } catch (error) {

        console.error(
            "Erreur Firebase - commandes:",
            error
        );


        orders = [];


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
   11. RENDER RECENT ORDERS
===================================================== */

function renderRecentOrders(
    ordersList
) {

    if (!recentOrders) {

        return;

    }


    /* =================================================
       NO ORDERS
    ================================================= */

    if (
        !ordersList ||
        ordersList.length === 0
    ) {

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


    /* =================================================
       LAST 5 ORDERS
    ================================================= */

    const latestOrders =
        ordersList.slice(
            0,
            5
        );


    recentOrders.innerHTML =
        "";


    latestOrders.forEach(
        order => {


            /* -----------------------------------------
               CUSTOMER
            ----------------------------------------- */

            const customer =
                order.customer ||
                {};


            const customerName =
                customer.name ||
                order.customerName ||
                order.name ||
                "Client";


            /* -----------------------------------------
               PRODUCT
            ----------------------------------------- */

            const productName =
                order.productName ||
                order.product?.name ||
                order.product ||
                "Produit";


            /* -----------------------------------------
               PRICE
            ----------------------------------------- */

            const price =
                order.price ??
                order.total ??
                order.totalPrice ??
                0;


            /* -----------------------------------------
               STATUS
            ----------------------------------------- */

            const status =
                getOrderStatus(
                    order
                );


            /* -----------------------------------------
               ELEMENT
            ----------------------------------------- */

            const orderElement =
                document.createElement(
                    "a"
                );


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
   12. MAKE DASHBOARD CARDS CLICKABLE
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
   13. MAKE CARD CLICKABLE
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
        card.dataset.clickable ===
        "true"
    ) {

        return;

    }


    card.dataset.clickable =
        "true";


    card.setAttribute(
        "role",
        "link"
    );


    card.setAttribute(
        "tabindex",
        "0"
    );


    card.style.cursor =
        "pointer";


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
   14. ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

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
   15. LOGOUT
===================================================== */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "kanaAdminLoggedIn"
            );


            window.location.href =
                "login.html";

        }
    );

}


/* =====================================================
   16. INITIALIZE DASHBOARD
===================================================== */

async function initializeDashboard() {

    console.log(
        "KANA Dashboard - démarrage..."
    );


    /* ---------------------------------------------
       Initial loading state
    --------------------------------------------- */

    if (totalProducts) {

        totalProducts.textContent =
            "…";

    }


    if (totalCategories) {

        totalCategories.textContent =
            "…";

    }


    if (totalBrands) {

        totalBrands.textContent =
            "…";

    }


    if (availableProducts) {

        availableProducts.textContent =
            "…";

    }


    if (totalOrders) {

        totalOrders.textContent =
            "…";

    }


    if (newOrders) {

        newOrders.textContent =
            "…";

    }


    /* ---------------------------------------------
       Load products
    --------------------------------------------- */

    await loadProducts();


    /* ---------------------------------------------
       Calculate product statistics
    --------------------------------------------- */

    updateProductStats();


    /* ---------------------------------------------
       Make cards clickable
    --------------------------------------------- */

    setupStatCards();


    /* ---------------------------------------------
       Load orders
    --------------------------------------------- */

    await loadOrders();


    console.log(
        "KANA Dashboard - terminé."
    );

}


/* =====================================================
   17. START
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeDashboard
    );

} else {

    initializeDashboard();

}