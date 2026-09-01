/* =====================================================
   KANA ÉLECTROMÉNAGER
   ADMIN - ORDERS
===================================================== */


/* =====================================================
   1. FIREBASE
===================================================== */

import {
    db,
    collection,
    getDocs,
    doc,
    updateDoc
} from "../js/firebase.js";


/* =====================================================
   2. PAGE ELEMENTS
===================================================== */

const ordersContainer =
    document.getElementById("ordersContainer");

const totalOrders =
    document.getElementById("totalOrders");

const newOrders =
    document.getElementById("newOrders");

const confirmedOrders =
    document.getElementById("confirmedOrders");

const deliveredOrders =
    document.getElementById("deliveredOrders");

const statusFilter =
    document.getElementById("statusFilter");

const refreshOrders =
    document.getElementById("refreshOrders");


/* =====================================================
   3. GLOBAL DATA
===================================================== */

let allOrders = [];

let activeFilter = "all";


/* =====================================================
   4. FORMAT PRICE
===================================================== */

function formatPrice(price) {

    const number = Number(price);

    if (!Number.isFinite(number)) {
        return "Prix sur demande";
    }

    return `${number.toLocaleString("fr-FR")} DA`;
}


/* =====================================================
   5. GET ORDER STATUS
===================================================== */

function getOrderStatus(order) {

    return order.status || "Nouvelle";
}


/* =====================================================
   6. GET DATE
===================================================== */

function getTimestampDate(createdAt) {

    if (!createdAt) {
        return 0;
    }

    try {

        /* Firebase Timestamp */

        if (
            typeof createdAt.toDate === "function"
        ) {

            return createdAt
                .toDate()
                .getTime();

        }


        /* Firestore serialized Timestamp */

        if (
            typeof createdAt === "object" &&
            createdAt.seconds !== undefined
        ) {

            return Number(createdAt.seconds) * 1000;

        }


        /* JavaScript Date */

        if (
            createdAt instanceof Date
        ) {

            return createdAt.getTime();

        }


        /* ISO string */

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
            "Erreur date :",
            error
        );

    }

    return 0;
}


/* =====================================================
   7. FORMAT DATE
===================================================== */

function formatDate(createdAt) {

    const timestamp =
        getTimestampDate(createdAt);

    if (!timestamp) {
        return "Date inconnue";
    }

    const date =
        new Date(timestamp);

    return date.toLocaleString(
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
   8. STATUS CLASS
===================================================== */

function getStatusClass(status) {

    switch (status) {

        case "Nouvelle":
            return "status-new";

        case "Confirmée":
            return "status-confirmed";

        case "Livrée":
            return "status-delivered";

        case "Annulée":
            return "status-cancelled";

        default:
            return "status-new";
    }
}


/* =====================================================
   9. ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =====================================================
   10. ESCAPE ATTRIBUTE
===================================================== */

function escapeAttribute(value) {

    return escapeHTML(value);
}


/* =====================================================
   11. LOAD ORDERS FROM FIREBASE
===================================================== */

async function loadOrders() {

    if (!ordersContainer) {
        return;
    }

    ordersContainer.innerHTML = `

        <div class="orders-loading">

            Chargement des commandes...

        </div>

    `;

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "orders"
                )
            );


        allOrders = [];


        snapshot.forEach(
            documentSnapshot => {

                const data =
                    documentSnapshot.data();

                allOrders.push({

                    firestoreId:
                        documentSnapshot.id,

                    ...data

                });

            }
        );


        /* =================================================
           SORT NEWEST FIRST
        ================================================= */

        allOrders.sort(
            (a, b) => {

                return (
                    getTimestampDate(
                        b.createdAt
                    )
                    -
                    getTimestampDate(
                        a.createdAt
                    )
                );

            }
        );


        updateStatistics();

        renderOrders();

    } catch (error) {

        console.error(
            "Erreur Firebase orders :",
            error
        );


        ordersContainer.innerHTML = `

            <div class="orders-error">

                <h3>
                    Impossible de charger les commandes
                </h3>

                <p>
                    Une erreur est survenue lors de la
                    connexion à Firebase.
                </p>

                <small>
                    ${escapeHTML(
                        error.message
                    )}
                </small>

            </div>

        `;

    }

}


/* =====================================================
   12. UPDATE STATISTICS
===================================================== */

function updateStatistics() {

    const total =
        allOrders.length;


    const nouvelles =
        allOrders.filter(
            order =>
                getOrderStatus(order)
                === "Nouvelle"
        ).length;


    const confirmees =
        allOrders.filter(
            order =>
                getOrderStatus(order)
                === "Confirmée"
        ).length;


    const livrees =
        allOrders.filter(
            order =>
                getOrderStatus(order)
                === "Livrée"
        ).length;


    if (totalOrders) {

        totalOrders.textContent =
            total;

    }


    if (newOrders) {

        newOrders.textContent =
            nouvelles;

    }


    if (confirmedOrders) {

        confirmedOrders.textContent =
            confirmees;

    }


    if (deliveredOrders) {

        deliveredOrders.textContent =
            livrees;

    }

}


/* =====================================================
   13. SET ACTIVE FILTER
===================================================== */

function setActiveFilter(filter) {

    activeFilter = filter;


    /* Update dropdown */

    if (statusFilter) {

        statusFilter.value =
            filter;

    }


    /* =================================================
       ACTIVE STAT CARD
    ================================================= */

    const statCards =
        document.querySelectorAll(
            ".stat-card"
        );


    statCards.forEach(
        card => {

            card.classList.remove(
                "active"
            );

        }
    );


    if (
        filter === "all" &&
        totalOrders
    ) {

        const card =
            totalOrders.closest(
                ".stat-card"
            );

        if (card) {
            card.classList.add(
                "active"
            );
        }

    }


    if (
        filter === "Nouvelle" &&
        newOrders
    ) {

        const card =
            newOrders.closest(
                ".stat-card"
            );

        if (card) {
            card.classList.add(
                "active"
            );
        }

    }


    if (
        filter === "Confirmée" &&
        confirmedOrders
    ) {

        const card =
            confirmedOrders.closest(
                ".stat-card"
            );

        if (card) {
            card.classList.add(
                "active"
            );
        }

    }


    if (
        filter === "Livrée" &&
        deliveredOrders
    ) {

        const card =
            deliveredOrders.closest(
                ".stat-card"
            );

        if (card) {
            card.classList.add(
                "active"
            );
        }

    }


    renderOrders();

}


/* =====================================================
   14. FILTER ORDERS
===================================================== */

function getFilteredOrders() {

    if (
        activeFilter === "all"
    ) {

        return [
            ...allOrders
        ];

    }


    return allOrders.filter(
        order =>
            getOrderStatus(order)
            === activeFilter
    );

}


/* =====================================================
   15. RENDER ORDERS
===================================================== */

function renderOrders() {

    if (!ordersContainer) {
        return;
    }


    const filteredOrders =
        getFilteredOrders();


    if (
        filteredOrders.length === 0
    ) {

        let message =
            "Aucune commande";


        if (
            activeFilter === "Nouvelle"
        ) {

            message =
                "Aucune nouvelle commande";

        }


        if (
            activeFilter === "Confirmée"
        ) {

            message =
                "Aucune commande confirmée";

        }


        if (
            activeFilter === "Livrée"
        ) {

            message =
                "Aucune commande livrée";

        }


        if (
            activeFilter === "Annulée"
        ) {

            message =
                "Aucune commande annulée";

        }


        ordersContainer.innerHTML = `

            <div class="empty-orders">

                <div class="empty-icon">
                    K
                </div>

                <h3>
                    ${escapeHTML(message)}
                </h3>

                <p>
                    Aucune commande ne correspond
                    à ce filtre.
                </p>

            </div>

        `;

        return;

    }


    ordersContainer.innerHTML = "";


    filteredOrders.forEach(
        order => {

            const card =
                createOrderCard(
                    order
                );

            ordersContainer.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   16. CREATE ORDER CARD
===================================================== */

function createOrderCard(order) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "order-card";


    const customer =
        order.customer || {};


    const status =
        getOrderStatus(order);


    const productName =
        order.productName ||
        (
            order.product &&
            order.product.name
        ) ||
        "Produit";


    const productImage =
        order.productImage ||
        (
            order.product &&
            order.product.image
        ) ||
        "";


    const price =
      Number(
        order.price ??
        order.productPrice ??
        order.product?.price ??
        order.total ??
        0
    );


    const orderId =
        order.id ||
        order.firestoreId;


    const customerName =
        customer.name ||
        order.customerName ||
        "Non renseigné";


    const customerPhone =
        customer.phone ||
        order.customerPhone ||
        "Non renseigné";


    const wilaya =
        customer.wilaya ||
        "Wilaya non renseignée";


    const commune =
        customer.commune ||
        "Non renseignée";


    const address =
        customer.address ||
        "Non renseignée";


    const notes =
        customer.notes ||
        "";


    card.innerHTML = `

        <!-- =================================================
             HEADER
        ================================================== -->

        <div class="order-header">

            <div class="order-header-left">

                <span class="order-number">

                    ${escapeHTML(orderId)}

                </span>

                <span class="order-date">

                    ${formatDate(
                        order.createdAt
                    )}

                </span>

            </div>


            <span
                class="order-status ${getStatusClass(status)}"
            >

                ${escapeHTML(status)}

            </span>

        </div>


        <!-- =================================================
             BODY
        ================================================== -->

        <div class="order-body">


            <!-- PRODUCT -->

            <div class="order-product">

                <div class="order-product-image">

                    ${
                        productImage

                        ?

                        `
                        <img
                            src="${escapeAttribute(
                                productImage
                            )}"
                            alt="${escapeAttribute(
                                productName
                            )}"
                        >
                        `

                        :

                        `
                        <span>
                            K
                        </span>
                        `
                    }

                </div>


                <div class="order-product-info">

                    <span class="section-label">
                        PRODUIT
                    </span>

                    <h3>
                        ${escapeHTML(
                            productName
                        )}
                    </h3>

                    <strong>
                        ${formatPrice(
                            price
                        )}
                    </strong>

                </div>

            </div>


            <!-- CUSTOMER -->

            <div class="order-customer">

                <span class="section-label">
                    CLIENT
                </span>


                <p>

                    <strong>
                        ${escapeHTML(
                            customerName
                        )}
                    </strong>

                </p>


                <p>

                    <span>
                        Téléphone :
                    </span>

                    <a
                        href="tel:${escapeAttribute(
                            customerPhone
                        )}"
                    >
                        ${escapeHTML(
                            customerPhone
                        )}
                    </a>

                </p>

            </div>


            <!-- DELIVERY -->

            <div class="order-delivery">

                <span class="section-label">
                    LIVRAISON
                </span>


                <p>

                    <strong>
                        ${escapeHTML(
                            wilaya
                        )}
                    </strong>

                </p>


                <p>

                    <span>
                        Commune :
                    </span>

                    ${escapeHTML(
                        commune
                    )}

                </p>


                <p>

                    <span>
                        Adresse :
                    </span>

                    ${escapeHTML(
                        address
                    )}

                </p>


                ${
                    notes

                    ?

                    `
                    <p class="order-notes">

                        <span>
                            Note :
                        </span>

                        ${escapeHTML(
                            notes
                        )}

                    </p>
                    `

                    :

                    ""
                }

            </div>

        </div>


        <!-- =================================================
             FOOTER
        ================================================== -->

        <div class="order-footer">


            <div class="order-total">

                <span>
                    TOTAL
                </span>

                <strong>
                    ${formatPrice(
                        price
                    )}
                </strong>

            </div>


            <div class="order-actions">

                <label
                    for="status-${escapeAttribute(
                        order.firestoreId
                    )}"
                >
                    Statut
                </label>


                <select
                    id="status-${escapeAttribute(
                        order.firestoreId
                    )}"
                    class="order-status-select"
                    data-order-id="${escapeAttribute(
                        order.firestoreId
                    )}"
                >

                    <option
                        value="Nouvelle"
                        ${
                            status === "Nouvelle"
                            ? "selected"
                            : ""
                        }
                    >
                        Nouvelle
                    </option>


                    <option
                        value="Confirmée"
                        ${
                            status === "Confirmée"
                            ? "selected"
                            : ""
                        }
                    >
                        Confirmée
                    </option>


                    <option
                        value="Livrée"
                        ${
                            status === "Livrée"
                            ? "selected"
                            : ""
                        }
                    >
                        Livrée
                    </option>


                    <option
                        value="Annulée"
                        ${
                            status === "Annulée"
                            ? "selected"
                            : ""
                        }
                    >
                        Annulée
                    </option>

                </select>

            </div>

        </div>

    `;


    return card;

}


/* =====================================================
   17. UPDATE ORDER STATUS IN FIREBASE
===================================================== */

async function updateOrderStatus(
    firestoreId,
    newStatus
) {

    if (
        !firestoreId ||
        !newStatus
    ) {

        return;

    }


    try {

        await updateDoc(

            doc(
                db,
                "orders",
                firestoreId
            ),

            {
                status:
                    newStatus
            }

        );


        /* =============================================
           UPDATE LOCAL ORDER
        ============================================= */

        const order =
            allOrders.find(
                item =>
                    item.firestoreId ===
                    firestoreId
            );


        if (order) {

            order.status =
                newStatus;

        }


        /* =============================================
           UPDATE STATISTICS
        ============================================= */

        updateStatistics();


        /* =============================================
           KEEP CURRENT FILTER
        ============================================= */

        renderOrders();


    } catch (error) {

        console.error(
            "Erreur modification statut :",
            error
        );


        alert(
            "Impossible de modifier le statut."
        );

    }

}


/* =====================================================
   18. ORDER STATUS CHANGE
===================================================== */

if (ordersContainer) {

    ordersContainer.addEventListener(
        "change",
        function (event) {

            const select =
                event.target.closest(
                    ".order-status-select"
                );


            if (!select) {
                return;
            }


            const firestoreId =
                select.dataset.orderId;


            const newStatus =
                select.value;


            updateOrderStatus(
                firestoreId,
                newStatus
            );

        }
    );

}


/* =====================================================
   19. DROPDOWN FILTER
===================================================== */

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        function () {

            setActiveFilter(
                this.value
            );

        }
    );

}


/* =====================================================
   20. STAT CARD CLICKS
===================================================== */

if (totalOrders) {

    const card =
        totalOrders.closest(
            ".stat-card"
        );


    if (card) {

        card.style.cursor =
            "pointer";


        card.addEventListener(
            "click",
            function () {

                setActiveFilter(
                    "all"
                );

            }
        );

    }

}


if (newOrders) {

    const card =
        newOrders.closest(
            ".stat-card"
        );


    if (card) {

        card.style.cursor =
            "pointer";


        card.addEventListener(
            "click",
            function () {

                setActiveFilter(
                    "Nouvelle"
                );

            }
        );

    }

}


if (confirmedOrders) {

    const card =
        confirmedOrders.closest(
            ".stat-card"
        );


    if (card) {

        card.style.cursor =
            "pointer";


        card.addEventListener(
            "click",
            function () {

                setActiveFilter(
                    "Confirmée"
                );

            }
        );

    }

}


if (deliveredOrders) {

    const card =
        deliveredOrders.closest(
            ".stat-card"
        );


    if (card) {

        card.style.cursor =
            "pointer";


        card.addEventListener(
            "click",
            function () {

                setActiveFilter(
                    "Livrée"
                );

            }
        );

    }

}


/* =====================================================
   21. REFRESH BUTTON
===================================================== */

if (refreshOrders) {

    refreshOrders.addEventListener(
        "click",
        function () {

            loadOrders();

        }
    );

}


/* =====================================================
   22. INITIALIZE
===================================================== */

setActiveFilter("all");

loadOrders();