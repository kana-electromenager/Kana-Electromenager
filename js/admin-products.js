/* =====================================================
   KANA ADMIN
   PRODUCTS MANAGEMENT
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const productsContainer =
    document.getElementById("productsContainer");

const productSearch =
    document.getElementById("productSearch");

const categoryFilter =
    document.getElementById("categoryFilter");

const brandFilter =
    document.getElementById("brandFilter");

const availabilityFilter =
    document.getElementById("availabilityFilter");

const productsCount =
    document.getElementById("productsCount");

const deleteModal =
    document.getElementById("deleteModal");

const deleteProductName =
    document.getElementById("deleteProductName");

const cancelDelete =
    document.getElementById("cancelDelete");

const confirmDelete =
    document.getElementById("confirmDelete");

const logoutButton =
    document.getElementById("logoutButton");


/* =====================================================
   DATA
===================================================== */

let products = [];

let originalProducts = [];

let productToDelete = null;


/* =====================================================
   LOAD PRODUCTS
===================================================== */

function loadProducts() {

    /*
        ORIGINAL PRODUCTS
        from products-data.js
    */

    originalProducts =
        typeof productsData !== "undefined" &&
        Array.isArray(productsData)
            ? [...productsData]
            : [];


    /*
        ADMIN PRODUCTS
        from localStorage
    */

    let adminProducts = [];


    try {

        const savedProducts =
            localStorage.getItem(
                "kanaProducts"
            );


        if (savedProducts) {

            const parsed =
                JSON.parse(
                    savedProducts
                );


            if (
                Array.isArray(parsed)
            ) {

                adminProducts =
                    parsed;

            }

        }

    } catch (error) {

        console.error(
            "Erreur lors du chargement des produits Admin.",
            error
        );

    }


    /*
        IMPORTANT:
        products-data.js + localStorage
    */

    products = [

        ...originalProducts,

        ...adminProducts

    ];

}


/* =====================================================
   INITIALIZATION
===================================================== */

function initializeProductsPage() {

    loadProducts();

    populateFilters();

    renderProducts();

    setupEvents();

}


/* =====================================================
   DOM READY
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeProductsPage
    );

} else {

    initializeProductsPage();

}


/* =====================================================
   FILTER OPTIONS
===================================================== */

function populateFilters() {

    if (categoryFilter) {

        /*
            Keep first option
        */

        categoryFilter.innerHTML = `

            <option value="">
                Toutes les catégories
            </option>

        `;


        const categories = [

            ...new Set(

                products

                    .map(
                        product =>
                            product.category
                    )

                    .filter(Boolean)

            )

        ].sort(
            (a, b) =>
                String(a).localeCompare(
                    String(b),
                    "fr"
                )
        );


        categories.forEach(
            category => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    category;


                option.textContent =
                    getCategoryDisplayName(
                        category
                    );


                categoryFilter.appendChild(
                    option
                );

            }
        );

    }


    if (brandFilter) {

        brandFilter.innerHTML = `

            <option value="">
                Toutes les marques
            </option>

        `;


        const brands = [

            ...new Set(

                products

                    .map(
                        product =>
                            product.brand
                    )

                    .filter(Boolean)

            )

        ].sort(
            (a, b) =>
                String(a).localeCompare(
                    String(b),
                    "fr"
                )
        );


        brands.forEach(
            brand => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    brand;


                option.textContent =
                    brand;


                brandFilter.appendChild(
                    option
                );

            }
        );

    }

}


/* =====================================================
   CATEGORY DISPLAY
===================================================== */

function getCategoryDisplayName(
    category
) {

    const names = {

        "maison-entretien":
            "Maison & Entretien",

        "maison-et-entretien":
            "Maison & Entretien",

        "refrigerateur":
            "Réfrigérateurs - Congélateurs",

        "refrigerateurs":
            "Réfrigérateurs - Congélateurs",

        "congelateur":
            "Réfrigérateurs - Congélateurs",

        "congelateurs":
            "Réfrigérateurs - Congélateurs",

        "refrigerateurs-congelateurs":
            "Réfrigérateurs - Congélateurs",

        "television":
            "Télévisions",

        "televisions":
            "Télévisions",

        "tv":
            "Télévisions",

        "machine-a-laver":
            "Machines à laver",

        "machines-a-laver":
            "Machines à laver",

        "lave-vaisselle":
            "Lave-vaisselle",

        "cuisine":
            "Cuisine"

    };


    return (
        names[
            String(category)
                .toLowerCase()
        ] ||
        category
    );

}


/* =====================================================
   TYPE DISPLAY
===================================================== */

function getTypeDisplayName(
    type
) {

    const names = {

        "aspirateur":
            "Aspirateurs",

        "aspirateurs":
            "Aspirateurs",

        "ventilateur":
            "Ventilateurs",

        "ventilateurs":
            "Ventilateurs",

        "climatisation":
            "Climatisation",

        "climatiseur":
            "Climatisation",

        "chauffage":
            "Chauffages",

        "chauffages":
            "Chauffages",

        "chauffe-eau":
            "Chauffe-eau",

        "refrigerateur":
            "Réfrigérateurs",

        "refrigerateurs":
            "Réfrigérateurs",

        "congelateur":
            "Congélateurs",

        "congelateurs":
            "Congélateurs",

        "television":
            "Télévisions",

        "televisions":
            "Télévisions",

        "machine-a-laver":
            "Machines à laver",

        "machines-a-laver":
            "Machines à laver",

        "lave-vaisselle":
            "Lave-vaisselle",

        "machines-a-cafe":
            "Machines à café",

        "machine-a-cafe":
            "Machines à café",

        "air-fryer":
            "Air Fryer",

        "blender-hachoir-mixeur-batteur":
            "Blender - Hachoir - Mixeur - Batteur",

        "micro-ondes":
            "Micro-ondes",

        "fours":
            "Fours",

        "cuisinieres":
            "Cuisinières",

        "petran":
            "Petran"

    };


    return (
        names[
            String(type)
                .toLowerCase()
        ] ||
        type
    );

}


/* =====================================================
   FILTER PRODUCTS
===================================================== */

function getFilteredProducts() {

    const search =
        productSearch
            ? productSearch.value
                .trim()
                .toLowerCase()
            : "";


    const category =
        categoryFilter
            ? categoryFilter.value
            : "";


    const brand =
        brandFilter
            ? brandFilter.value
            : "";


    const availability =
        availabilityFilter
            ? availabilityFilter.value
            : "";


    return products.filter(
        product => {


            const searchableText = [

                product.name,

                product.brand,

                product.category,

                product.type,

                product.description

            ]

                .filter(Boolean)

                .join(" ")

                .toLowerCase();


            const matchesSearch =
                !search ||
                searchableText.includes(
                    search
                );


            const matchesCategory =
                !category ||
                String(
                    product.category
                ) ===
                String(category);


            const matchesBrand =
                !brand ||
                String(
                    product.brand
                ) ===
                String(brand);


            const matchesAvailability =
                !availability ||
                String(
                    product.availability
                ) ===
                String(availability);


            return (

                matchesSearch &&

                matchesCategory &&

                matchesBrand &&

                matchesAvailability

            );

        }
    );

}


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts() {

    if (!productsContainer) {

        return;

    }


    const filteredProducts =
        getFilteredProducts();


    productsContainer.innerHTML =
        "";


    updateProductsCount(
        filteredProducts.length
    );


    if (
        filteredProducts.length ===
        0
    ) {

        renderEmptyState();

        return;

    }


    filteredProducts.forEach(
        product => {

            const card =
                createProductCard(
                    product
                );


            productsContainer.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   PRODUCT CARD
===================================================== */

function createProductCard(
    product
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "admin-product-card";


    const availabilityClass =
        product.availability ===
        "Disponible"
            ? "available"
            : "unavailable";


    /* IMAGE */

    let imageHTML = `

        <div class="product-no-image">
            NO IMAGE
        </div>

    `;


    if (product.image) {

        let imageSource =
            String(product.image);


        /*
            Base64 image
        */

        if (
            !imageSource.startsWith(
                "data:image/"
            )
        ) {

            /*
                Project image path
            */

            if (
                imageSource.startsWith(
                    "../"
                )
            ) {

                imageSource =
                    imageSource;

            } else {

                imageSource =
                    `../${imageSource}`;

            }

        }


        imageHTML = `

            <img
                src="${escapeHTML(
                    imageSource
                )}"
                alt="${escapeHTML(
                    product.name ||
                    "Produit"
                )}"
                loading="lazy"
                onerror="
                    this.style.display='none';
                "
            >

        `;

    }


    /* CARD */

    card.innerHTML = `

        <div class="admin-product-image">

            ${imageHTML}

        </div>


        <div class="admin-product-info">


            <p class="admin-product-category">

                ${escapeHTML(
                    getCategoryDisplayName(
                        product.category ||
                        "Sans catégorie"
                    )
                )}

            </p>


            <h3>

                ${escapeHTML(
                    product.name ||
                    "Produit sans nom"
                )}

            </h3>


            <div class="admin-product-meta">


                ${
                    product.brand
                        ? `
                            <span>
                                ${escapeHTML(
                                    product.brand
                                )}
                            </span>
                        `
                        : ""
                }


                ${
                    product.type
                        ? `
                            <span>
                                ${escapeHTML(
                                    getTypeDisplayName(
                                        product.type
                                    )
                                )}
                            </span>
                        `
                        : ""
                }


            </div>


            <div class="admin-product-bottom">


                <strong>

                    ${formatPrice(
                        product.price
                    )}

                </strong>


                <span
                    class="product-availability ${availabilityClass}"
                >

                    ${escapeHTML(
                        product.availability ||
                        "Indisponible"
                    )}

                </span>


            </div>


            <div class="admin-product-actions">


                <button
                    type="button"
                    class="product-edit-button"
                >
                    Modifier
                </button>


                <button
                    type="button"
                    class="product-delete-button"
                >
                    Supprimer
                </button>


            </div>


        </div>

    `;


    const editButton =
        card.querySelector(
            ".product-edit-button"
        );


    const deleteButton =
        card.querySelector(
            ".product-delete-button"
        );


    if (editButton) {

        editButton.addEventListener(
            "click",
            function () {

                editProduct(
                    product.id
                );

            }
        );

    }


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            function () {

                openDeleteModal(
                    product
                );

            }
        );

    }


    return card;

}


/* =====================================================
   EDIT PRODUCT
===================================================== */

function editProduct(
    id
) {

    /*
        Only products saved by Admin
        can be edited.
    */

    let adminProducts = [];


    try {

        const saved =
            localStorage.getItem(
                "kanaProducts"
            );


        if (saved) {

            const parsed =
                JSON.parse(saved);


            if (
                Array.isArray(parsed)
            ) {

                adminProducts =
                    parsed;

            }

        }

    } catch (error) {

        console.error(error);

    }


    const exists =
        adminProducts.some(
            product =>
                String(product.id) ===
                String(id)
        );


    if (!exists) {

        alert(
            "Ce produit fait partie du catalogue original et ne peut pas être modifié depuis l'Admin."
        );

        return;

    }


    window.location.href =
        `add-products.html?edit=${encodeURIComponent(
            id
        )}`;

}


/* =====================================================
   DELETE MODAL
===================================================== */

function openDeleteModal(
    product
) {

    if (!deleteModal) {

        return;

    }


    productToDelete =
        product;


    if (deleteProductName) {

        deleteProductName.textContent =
            `Vous êtes sur le point de supprimer « ${
                product.name ||
                "ce produit"
            } ».`;

    }


    deleteModal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );

}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeDeleteModal() {

    if (deleteModal) {

        deleteModal.hidden =
            true;

    }


    productToDelete =
        null;


    document.body.classList.remove(
        "modal-open"
    );

}


/* =====================================================
   DELETE PRODUCT
===================================================== */

function deleteProduct() {

    if (!productToDelete) {

        return;

    }


    const productId =
        productToDelete.id;


    let adminProducts = [];


    try {

        const saved =
            localStorage.getItem(
                "kanaProducts"
            );


        if (saved) {

            const parsed =
                JSON.parse(saved);


            if (
                Array.isArray(parsed)
            ) {

                adminProducts =
                    parsed;

            }

        }

    } catch (error) {

        console.error(
            "Erreur lors du chargement.",
            error
        );

        return;

    }


    const exists =
        adminProducts.some(
            product =>
                String(product.id) ===
                String(productId)
        );


    if (!exists) {

        alert(
            "Ce produit original ne peut pas être supprimé depuis l'Admin."
        );

        closeDeleteModal();

        return;

    }


    adminProducts =
        adminProducts.filter(
            product =>
                String(product.id) !==
                String(productId)
        );


    localStorage.setItem(
        "kanaProducts",
        JSON.stringify(
            adminProducts
        )
    );


    closeDeleteModal();


    /*
        Reload everything
    */

    loadProducts();

    populateFilters();

    renderProducts();

}


/* =====================================================
   SAVE PRODUCTS
===================================================== */

function saveProducts() {

    /*
        This function is kept for compatibility.
        Admin products are stored separately.
    */

    try {

        localStorage.setItem(
            "kanaProducts",
            JSON.stringify(
                products
            )
        );

    } catch (error) {

        console.error(
            error
        );

    }

}


/* =====================================================
   COUNT
===================================================== */

function updateProductsCount(
    count
) {

    if (!productsCount) {

        return;

    }


    productsCount.textContent =
        count === 1
            ? "1 produit"
            : `${count} produits`;

}


/* =====================================================
   EMPTY STATE
===================================================== */

function renderEmptyState() {

    if (!productsContainer) {

        return;

    }


    productsContainer.innerHTML = `

        <div class="admin-products-empty">


            <div class="admin-products-empty-icon">
                ▣
            </div>


            <h3>
                Aucun produit trouvé
            </h3>


            <p>
                Aucun produit ne correspond
                à votre recherche ou vos filtres.
            </p>


            <button
                type="button"
                id="resetProductFilters"
            >
                Réinitialiser les filtres
            </button>


        </div>

    `;


    const resetButton =
        document.getElementById(
            "resetProductFilters"
        );


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetFilters
        );

    }

}


/* =====================================================
   RESET FILTERS
===================================================== */

function resetFilters() {

    if (productSearch) {

        productSearch.value =
            "";

    }


    if (categoryFilter) {

        categoryFilter.value =
            "";

    }


    if (brandFilter) {

        brandFilter.value =
            "";

    }


    if (availabilityFilter) {

        availabilityFilter.value =
            "";

    }


    renderProducts();

}


/* =====================================================
   EVENTS
===================================================== */

function setupEvents() {


    if (productSearch) {

        productSearch.addEventListener(
            "input",
            renderProducts
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            renderProducts
        );

    }


    if (brandFilter) {

        brandFilter.addEventListener(
            "change",
            renderProducts
        );

    }


    if (availabilityFilter) {

        availabilityFilter.addEventListener(
            "change",
            renderProducts
        );

    }


    if (cancelDelete) {

        cancelDelete.addEventListener(
            "click",
            closeDeleteModal
        );

    }


    if (confirmDelete) {

        confirmDelete.addEventListener(
            "click",
            deleteProduct
        );

    }


    if (deleteModal) {

        deleteModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    deleteModal
                ) {

                    closeDeleteModal();

                }

            }
        );

    }


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

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =====================================================
   FORMAT PRICE
===================================================== */

function formatPrice(
    price
) {

    if (
        price === undefined ||
        price === null ||
        price === ""
    ) {

        return "Prix non défini";

    }


    const number =
        Number(price);


    if (
        Number.isNaN(number)
    ) {

        return "Prix non défini";

    }


    return (
        new Intl.NumberFormat(
            "fr-DZ"
        ).format(number)
        + " DA"
    );

}