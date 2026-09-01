/* =====================================================
   KANA ÉLECTROMÉNAGER
   ADMIN - CUSTOMERS
===================================================== */


/* =====================================================
   1. FIREBASE
===================================================== */

import {
    db,
    collection,
    getDocs
} from "../js/firebase.js";


/* =====================================================
   2. PAGE ELEMENTS
===================================================== */

const customersContainer =
    document.getElementById(
        "customersContainer"
    );

const totalCustomers =
    document.getElementById(
        "totalCustomers"
    );

const totalOrders =
    document.getElementById(
        "totalOrders"
    );

const returningCustomers =
    document.getElementById(
        "returningCustomers"
    );

const totalRevenue =
    document.getElementById(
        "totalRevenue"
    );

const customerSearch =
    document.getElementById(
        "customerSearch"
    );

const refreshCustomers =
    document.getElementById(
        "refreshCustomers"
    );


/* =====================================================
   3. GLOBAL DATA
===================================================== */

let allCustomers = [];


/* =====================================================
   4. FORMAT PRICE
===================================================== */

function formatPrice(price) {

    const number = Number(price);

    if (!Number.isFinite(number)) {

        return "0 DA";

    }

    return `${number.toLocaleString("fr-FR")} DA`;

}


/* =====================================================
   5. GET TIMESTAMP
===================================================== */

function getTimestampDate(createdAt) {

    if (!createdAt) {

        return 0;

    }


    try {

        /* Firebase Timestamp */

        if (
            typeof createdAt.toDate ===
            "function"
        ) {

            return createdAt
                .toDate()
                .getTime();

        }


        /* Serialized Firestore Timestamp */

        if (
            typeof createdAt === "object" &&
            createdAt.seconds !== undefined
        ) {

            return (
                Number(createdAt.seconds) *
                1000
            );

        }


        /* JavaScript Date */

        if (
            createdAt instanceof Date
        ) {

            return createdAt.getTime();

        }


        /* String date */

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
            "Erreur date client :",
            error
        );

    }


    return 0;

}


/* =====================================================
   6. FORMAT DATE
===================================================== */

function formatDate(createdAt) {

    const timestamp =
        getTimestampDate(
            createdAt
        );


    if (!timestamp) {

        return "Date inconnue";

    }


    return new Date(
        timestamp
    ).toLocaleDateString(
        "fr-FR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/* =====================================================
   7. ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
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
   8. GET CUSTOMER KEY
=====================================================

   Since customers do not create accounts,
   we identify them mainly by phone number.

===================================================== */

function getCustomerKey(order) {

    const customer =
        order.customer || {};


    const phone =
        customer.phone ||
        order.customerPhone ||
        "";


    const normalizedPhone =
        String(phone)
            .replace(
                /\s+/g,
                ""
            )
            .replace(
                /-/g,
                ""
            );


    if (normalizedPhone) {

        return `phone:${normalizedPhone}`;

    }


    const name =
        customer.name ||
        order.customerName ||
        "";


    const wilaya =
        customer.wilaya ||
        "";


    return `guest:${String(name)
        .trim()
        .toLowerCase()}-${String(wilaya)
        .trim()
        .toLowerCase()}`;

}


/* =====================================================
   9. GET ORDER PRICE
===================================================== */

function getOrderPrice(order) {

    return Number(
        order.price ??
        order.productPrice ??
        order.product?.price ??
        order.total ??
        0
    );

}


/* =====================================================
   10. LOAD CUSTOMERS
===================================================== */

async function loadCustomers() {

    if (!customersContainer) {

        return;

    }


    customersContainer.innerHTML = `

        <div class="customers-loading">

            <div class="loading-spinner"></div>

            <p>
                Chargement des clients...
            </p>

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


        const customerMap =
            new Map();


        let ordersCount = 0;

        let revenue = 0;


        /* =================================================
           BUILD CUSTOMERS FROM ORDERS
        ================================================= */

        snapshot.forEach(
            documentSnapshot => {

                const order =
                    documentSnapshot.data();


                ordersCount++;


                const orderPrice =
                    getOrderPrice(
                        order
                    );


                revenue += orderPrice;


                const key =
                    getCustomerKey(
                        order
                    );


                const customer =
                    order.customer || {};


                const name =
                    customer.name ||
                    order.customerName ||
                    "Client non renseigné";


                const phone =
                    customer.phone ||
                    order.customerPhone ||
                    "Téléphone non renseigné";


                const wilaya =
                    customer.wilaya ||
                    "Wilaya non renseignée";


                const commune =
                    customer.commune ||
                    "Commune non renseignée";


                const address =
                    customer.address ||
                    "Adresse non renseignée";


                const createdAt =
                    order.createdAt;


                if (
                    !customerMap.has(key)
                ) {

                    customerMap.set(
                        key,
                        {

                            key,

                            name,

                            phone,

                            wilaya,

                            commune,

                            address,

                            orders: 1,

                            totalSpent:
                                orderPrice,

                            lastOrder:
                                createdAt,

                            firstOrder:
                                createdAt

                        }
                    );

                } else {

                    const existing =
                        customerMap.get(
                            key
                        );


                    existing.orders++;


                    existing.totalSpent +=
                        orderPrice;


                    const currentDate =
                        getTimestampDate(
                            existing.lastOrder
                        );


                    const newDate =
                        getTimestampDate(
                            createdAt
                        );


                    if (
                        newDate > currentDate
                    ) {

                        existing.lastOrder =
                            createdAt;

                        existing.name =
                            name;

                        existing.phone =
                            phone;

                        existing.wilaya =
                            wilaya;

                        existing.commune =
                            commune;

                        existing.address =
                            address;

                    }


                    const firstDate =
                        getTimestampDate(
                            existing.firstOrder
                        );


                    if (
                        newDate < firstDate &&
                        newDate !== 0
                    ) {

                        existing.firstOrder =
                            createdAt;

                    }

                }

            }
        );


        allCustomers =
            Array.from(
                customerMap.values()
            );


        /* =================================================
           SORT
           MOST RECENT CUSTOMER FIRST
        ================================================= */

        allCustomers.sort(
            (a, b) => {

                return (
                    getTimestampDate(
                        b.lastOrder
                    )
                    -
                    getTimestampDate(
                        a.lastOrder
                    )
                );

            }
        );


        /* =================================================
           STATISTICS
        ================================================= */

        const returning =
            allCustomers.filter(
                customer =>
                    customer.orders > 1
            ).length;


        if (totalCustomers) {

            totalCustomers.textContent =
                allCustomers.length;

        }


        if (totalOrders) {

            totalOrders.textContent =
                ordersCount;

        }


        if (returningCustomers) {

            returningCustomers.textContent =
                returning;

        }


        if (totalRevenue) {

            totalRevenue.textContent =
                formatPrice(
                    revenue
                );

        }


        renderCustomers();

    } catch (error) {

        console.error(
            "Erreur Firebase customers :",
            error
        );


        customersContainer.innerHTML = `

            <div class="customers-error">

                <div class="error-icon">
                    K
                </div>

                <h3>
                    Impossible de charger les clients
                </h3>

                <p>
                    Une erreur est survenue lors
                    de la connexion à Firebase.
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
   11. FILTER CUSTOMERS
===================================================== */

function getFilteredCustomers() {

    const search =
        customerSearch
            ?.value
            ?.trim()
            ?.toLowerCase() || "";


    if (!search) {

        return [
            ...allCustomers
        ];

    }


    return allCustomers.filter(
        customer => {

            const searchableText =
                [

                    customer.name,

                    customer.phone,

                    customer.wilaya,

                    customer.commune,

                    customer.address

                ]
                    .join(" ")
                    .toLowerCase();


            return searchableText
                .includes(search);

        }
    );

}


/* =====================================================
   12. RENDER CUSTOMERS
===================================================== */

function renderCustomers() {

    if (!customersContainer) {

        return;

    }


    const customers =
        getFilteredCustomers();


    if (
        customers.length === 0
    ) {

        customersContainer.innerHTML = `

            <div class="empty-customers">

                <div class="empty-icon">
                    K
                </div>

                <h3>
                    Aucun client trouvé
                </h3>

                <p>
                    Aucun client ne correspond
                    à votre recherche.
                </p>

            </div>

        `;

        return;

    }


    customersContainer.innerHTML = "";


    customers.forEach(
        customer => {

            const card =
                createCustomerCard(
                    customer
                );


            customersContainer.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   13. CREATE CUSTOMER CARD
===================================================== */

function createCustomerCard(customer) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "customer-card";


    const customerName =
        escapeHTML(
            customer.name
        );


    const customerPhone =
        escapeHTML(
            customer.phone
        );


    const customerWilaya =
        escapeHTML(
            customer.wilaya
        );


    const customerCommune =
        escapeHTML(
            customer.commune
        );


    const customerAddress =
        escapeHTML(
            customer.address
        );


    const ordersLabel =
        customer.orders === 1
            ? "commande"
            : "commandes";


    const customerType =
        customer.orders > 1
            ? "CLIENT FIDÈLE"
            : "CLIENT";


    const phoneHref =
        String(
            customer.phone
        )
        .replace(
            /\s+/g,
            ""
        );


    card.innerHTML = `

        <!-- =================================================
             CUSTOMER HEADER
        ================================================== -->

        <div class="customer-header">

            <div class="customer-title">

                <span class="customer-label">
                    ${customerType}
                </span>

                <h2>
                    ${customerName}
                </h2>

            </div>


            <div class="customer-orders">

                <strong>
                    ${customer.orders}
                </strong>

                <span>
                    ${ordersLabel}
                </span>

            </div>

        </div>



        <!-- =================================================
             CUSTOMER BODY
        ================================================== -->

        <div class="customer-body">


            <!-- CONTACT -->

            <div class="customer-info-block">

                <span class="info-label">
                    CONTACT
                </span>

                <p>

                    ${
                        phoneHref
                        ?
                        `
                        <a
                            href="tel:${escapeHTML(
                                phoneHref
                            )}"
                            class="customer-phone"
                        >
                            ${customerPhone}
                        </a>
                        `
                        :
                        customerPhone
                    }

                </p>

            </div>



            <!-- LOCATION -->

            <div class="customer-info-block">

                <span class="info-label">
                    LIVRAISON
                </span>

                <p>
                    <strong>
                        ${customerWilaya}
                    </strong>
                </p>

                <p>
                    ${customerCommune}
                </p>

                <p>
                    ${customerAddress}
                </p>

            </div>



            <!-- SPENDING -->

            <div class="customer-info-block">

                <span class="info-label">
                    TOTAL ACHETÉ
                </span>

                <strong class="customer-total">
                    ${formatPrice(
                        customer.totalSpent
                    )}
                </strong>

            </div>



            <!-- LAST ORDER -->

            <div class="customer-info-block">

                <span class="info-label">
                    DERNIÈRE COMMANDE
                </span>

                <p>
                    ${formatDate(
                        customer.lastOrder
                    )}
                </p>

            </div>

        </div>

    `;


    return card;

}


/* =====================================================
   14. SEARCH EVENT
===================================================== */

if (customerSearch) {

    customerSearch.addEventListener(
        "input",
        function () {

            renderCustomers();

        }
    );

}


/* =====================================================
   15. REFRESH
===================================================== */

if (refreshCustomers) {

    refreshCustomers.addEventListener(
        "click",
        function () {

            loadCustomers();

        }
    );

}


/* =====================================================
   16. INITIALIZE
===================================================== */

loadCustomers();