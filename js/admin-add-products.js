/* =====================================================
   KANA ADMIN — ADD / EDIT PRODUCT
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const addProductForm = document.getElementById("addProductForm");

const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productType = document.getElementById("productType");
const productBrand = document.getElementById("productBrand");
const productPrice = document.getElementById("productPrice");
const productStock = document.getElementById("productStock");
const productImage = document.getElementById("productImage");
const productDescription = document.getElementById("productDescription");

const imagePreview = document.getElementById("imagePreview");

const pageTitle = document.getElementById("pageTitle");
const formTitle = document.getElementById("formTitle");
const submitProductButton = document.getElementById("submitProductButton");


/* =====================================================
   EDIT MODE
===================================================== */

const urlParams = new URLSearchParams(window.location.search);

const editProductId = urlParams.get("edit");


/* =====================================================
   CATEGORIES + SUBCATEGORIES
===================================================== */

const subcategories = {

    "refrigerateurs-congelateurs": [
        {
            value: "refrigerateurs",
            label: "Réfrigérateurs"
        },
        {
            value: "congelateurs",
            label: "Congélateurs"
        }
    ],

    "cuisine": [
        {
            value: "machines-a-cafe",
            label: "Machines à café"
        },
        {
            value: "blender-hachoir-mixeur-batteur",
            label: "Hachoir - Mixeur - Batteur - Blender"
        },
        {
            value: "micro-ondes",
            label: "Micro-ondes"
        },
        {
            value: "fours",
            label: "Fours"
        },
        {
            value: "cuisinieres",
            label: "Cuisinières"
        },
        {
            value: "air-fryer",
            label: "Air Fryer"
        },
        {
            value: "petran",
            label: "Petran"
        }
    ],

    "maison-entretien": [
        {
            value: "climatisation",
            label: "Climatisation"
        },
        {
            value: "ventilateurs",
            label: "Ventilateurs"
        },
        {
            value: "aspirateurs",
            label: "Aspirateurs"
        },
        {
            value: "chauffe-eau",
            label: "Chauffe-eau"
        },
        {
            value: "chauffages",
            label: "Chauffages"
        }
    ]

};


/* =====================================================
   CATEGORIES WITHOUT SUBCATEGORIES
===================================================== */

const categoriesWithoutSubcategories = [
    "televisions",
    "machines-a-laver",
    "lave-vaisselle"
];


/* =====================================================
   NORMALIZE
===================================================== */

function normalizeText(value) {

    return String(value || "")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/œ/g, "oe")
        .replace(/æ/g, "ae")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

}


/* =====================================================
   CATEGORY ALIASES
===================================================== */

const categoryAliases = {

    "refrigerateur":
        "refrigerateurs-congelateurs",

    "refrigerateurs":
        "refrigerateurs-congelateurs",

    "congelateur":
        "refrigerateurs-congelateurs",

    "congelateurs":
        "refrigerateurs-congelateurs",

    "refrigerateur-congelateur":
        "refrigerateurs-congelateurs",

    "refrigerateurs-congelateurs":
        "refrigerateurs-congelateurs",

    "tv":
        "televisions",

    "television":
        "televisions",

    "televisions":
        "televisions",

    "machine-a-laver":
        "machines-a-laver",

    "machines-a-laver":
        "machines-a-laver",

    "lave-vaisselle":
        "lave-vaisselle",

    "maison-entretien":
        "maison-entretien",

    "maison-et-entretien":
        "maison-entretien",

    "cuisine":
        "cuisine"

};


/* =====================================================
   TYPE ALIASES
===================================================== */

const typeAliases = {

    "refrigerateur":
        "refrigerateurs",

    "refrigerateurs":
        "refrigerateurs",

    "congelateur":
        "congelateurs",

    "congelateurs":
        "congelateurs",

    "climatiseur":
        "climatisation",

    "climatiseurs":
        "climatisation",

    "climatisation":
        "climatisation",

    "ventilateur":
        "ventilateurs",

    "ventilateurs":
        "ventilateurs",

    "aspirateur":
        "aspirateurs",

    "aspirateurs":
        "aspirateurs",

    "chauffage":
        "chauffages",

    "chauffages":
        "chauffages",

    "chauffe-eau":
        "chauffe-eau",

    "chauffe-eaux":
        "chauffe-eau",

    "machine-a-cafe":
        "machines-a-cafe",

    "machines-a-cafe":
        "machines-a-cafe",

    "air-fryer":
        "air-fryer",

    "air-fryers":
        "air-fryer",

    "blender-hachoir-mixeur-batteur":
        "blender-hachoir-mixeur-batteur",

    "micro-onde":
        "micro-ondes",

    "micro-ondes":
        "micro-ondes",

    "four":
        "fours",

    "fours":
        "fours",

    "cuisiniere":
        "cuisinieres",

    "cuisinieres":
        "cuisinieres",

    "petran":
        "petran",

    "television":
        "televisions",

    "televisions":
        "televisions",

    "machine-a-laver":
        "machines-a-laver",

    "machines-a-laver":
        "machines-a-laver",

    "lave-vaisselle":
        "lave-vaisselle"

};


/* =====================================================
   GET CATEGORY KEY
===================================================== */

function getCategoryKey(value) {

    const normalized = normalizeText(value);

    return categoryAliases[normalized] || normalized;

}


/* =====================================================
   GET TYPE KEY
===================================================== */

function getTypeKey(value) {

    const normalized = normalizeText(value);

    return typeAliases[normalized] || normalized;

}


/* =====================================================
   UPDATE SUBCATEGORY
===================================================== */

function updateSubcategories(selectedType = "") {

    if (!productType || !productCategory) {
        return;
    }

    const category = getCategoryKey(productCategory.value);

    productType.innerHTML = "";

    /*
       TV / MACHINE À LAVER / LAVE-VAISSELLE
       DO NOT require a subcategory.
    */

    if (categoriesWithoutSubcategories.includes(category)) {

        productType.disabled = true;

        productType.innerHTML = `
            <option value="">
                Aucune sous-catégorie
            </option>
        `;

        productType.value = "";

        return;
    }


    /*
       No category selected
    */

    if (!category) {

        productType.disabled = true;

        productType.innerHTML = `
            <option value="">
                Sélectionner d'abord une catégorie
            </option>
        `;

        return;
    }


    /*
       Get subcategories
    */

    const options = subcategories[category] || [];


    /*
       Category without subcategories
    */

    if (options.length === 0) {

        productType.disabled = true;

        productType.innerHTML = `
            <option value="">
                Aucune sous-catégorie
            </option>
        `;

        productType.value = "";

        return;
    }


    /*
       Category with subcategories
    */

    productType.disabled = false;

    productType.innerHTML = `
        <option value="">
            Sélectionner une sous-catégorie
        </option>
    `;


    options.forEach(item => {

        const option = document.createElement("option");

        option.value = item.value;
        option.textContent = item.label;

        productType.appendChild(option);

    });


    if (selectedType) {

        const normalizedType = getTypeKey(selectedType);

        const exists = options.some(
            item => item.value === normalizedType
        );

        if (exists) {
            productType.value = normalizedType;
        }

    }

}


/* =====================================================
   CATEGORY CHANGE
===================================================== */

if (productCategory) {

    productCategory.addEventListener("change", () => {

        updateSubcategories();

    });

}


/* =====================================================
   IMAGE PREVIEW
===================================================== */

if (productImage && imagePreview) {

    productImage.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {

            imagePreview.innerHTML = `
                <span>
                    Aucune image sélectionnée
                </span>
            `;

            return;
        }


        if (!file.type.startsWith("image/")) {

            alert("Veuillez sélectionner une image.");

            this.value = "";

            return;
        }


        const reader = new FileReader();

        reader.onload = function (event) {

            imagePreview.innerHTML = `
                <img
                    src="${event.target.result}"
                    alt="Aperçu"
                >
            `;

        };

        reader.readAsDataURL(file);

    });

}


/* =====================================================
   GET SAVED PRODUCTS
===================================================== */

function getSavedProducts() {

    try {

        const saved =
            localStorage.getItem("kanaProducts");

        if (!saved) {
            return [];
        }

        const products = JSON.parse(saved);

        return Array.isArray(products)
            ? products
            : [];

    } catch (error) {

        console.error(
            "Erreur kanaProducts:",
            error
        );

        return [];

    }

}


/* =====================================================
   SAVE PRODUCTS
===================================================== */

function saveProducts(products) {

    localStorage.setItem(
        "kanaProducts",
        JSON.stringify(products)
    );

}


/* =====================================================
   LOAD PRODUCT FOR EDIT
===================================================== */

function loadProductForEdit() {

    if (!editProductId) {
        return;
    }


    const products = getSavedProducts();

    const product = products.find(
        item =>
            String(item.id) ===
            String(editProductId)
    );


    if (!product) {

        alert("Produit introuvable.");

        window.location.href = "products.html";

        return;
    }


    if (pageTitle) {
        pageTitle.textContent = "Modifier un produit";
    }

    if (formTitle) {
        formTitle.textContent = "Modification du produit";
    }

    if (submitProductButton) {
        submitProductButton.textContent =
            "ENREGISTRER LES MODIFICATIONS";
    }


    if (productName) {
        productName.value = product.name || "";
    }


    if (productCategory) {

        productCategory.value =
            getCategoryKey(product.category);

    }


    updateSubcategories(product.type || "");


    if (productBrand) {
        productBrand.value = product.brand || "";
    }


    if (productPrice) {
        productPrice.value = product.price ?? "";
    }


    if (productStock) {
        productStock.value = product.stock ?? "";
    }


    if (productDescription) {
        productDescription.value =
            product.description || "";
    }


    if (
        product.image &&
        imagePreview
    ) {

        imagePreview.innerHTML = `
            <img
                src="${product.image}"
                alt="Image actuelle"
            >
        `;

    }

}


/* =====================================================
   SUBMIT
===================================================== */

if (addProductForm) {

    addProductForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                productName?.value.trim() || "";

            const category =
                getCategoryKey(
                    productCategory?.value || ""
                );

            /*
               IMPORTANT:
               type can be EMPTY for:
               TV
               Machine à laver
               Lave-vaisselle
            */

            let type = "";

            if (
                productType &&
                !productType.disabled
            ) {

                type =
                    getTypeKey(
                        productType.value
                    );

            }


            const brand =
                productBrand?.value.trim() || "";


            const price =
                Number(
                    productPrice?.value || 0
                );


            const stock =
                Number(
                    productStock?.value || 0
                );


            const description =
                productDescription?.value.trim() || "";


            const imageFile =
                productImage?.files?.[0] || null;


            /* =========================================
               VALIDATION
            ========================================= */

            if (!name || !category || !brand) {

                alert(
                    "Veuillez remplir les champs obligatoires."
                );

                return;
            }


            /*
               Only categories WITH subcategories
               require type.
            */

            const requiresType =
                !categoriesWithoutSubcategories.includes(
                    category
                ) &&
                Array.isArray(
                    subcategories[category]
                ) &&
                subcategories[category].length > 0;


            if (requiresType && !type) {

                alert(
                    "Veuillez sélectionner une sous-catégorie."
                );

                return;
            }


            if (
                Number.isNaN(price) ||
                price < 0
            ) {

                alert("Prix invalide.");

                return;
            }


            if (
                Number.isNaN(stock) ||
                stock < 0
            ) {

                alert("Stock invalide.");

                return;
            }


            /* =========================================
               GET PRODUCTS
            ========================================= */

            const products =
                getSavedProducts();


            /* =========================================
               EDIT
            ========================================= */

            if (editProductId) {

                const index =
                    products.findIndex(
                        item =>
                            String(item.id) ===
                            String(editProductId)
                    );


                if (index === -1) {

                    alert("Produit introuvable.");

                    return;
                }


                const updatedProduct = {

                    ...products[index],

                    name,

                    category,

                    type,

                    brand,

                    price,

                    stock,

                    availability:
                        stock > 0
                            ? "Disponible"
                            : "Indisponible",

                    description

                };


                /*
                   New image
                */

                if (imageFile) {

                    const reader =
                        new FileReader();


                    reader.onload = function (event) {

                        updatedProduct.image =
                            event.target.result;

                        products[index] =
                            updatedProduct;

                        saveProducts(products);

                        alert(
                            "Produit modifié avec succès !"
                        );

                        window.location.href =
                            "products.html";

                    };


                    reader.readAsDataURL(imageFile);

                    return;
                }


                /*
                   Keep old image
                */

                products[index] =
                    updatedProduct;

                saveProducts(products);

                alert(
                    "Produit modifié avec succès !"
                );

                window.location.href =
                    "products.html";

                return;
            }


            /* =========================================
               ADD
            ========================================= */

            if (!imageFile) {

                alert(
                    "Veuillez sélectionner une image."
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload = function (event) {

                const newProduct = {

                    id:
                        Date.now().toString(),

                    name,

                    category,

                    type,

                    brand,

                    price,

                    stock,

                    availability:
                        stock > 0
                            ? "Disponible"
                            : "Indisponible",

                    description,

                    image:
                        event.target.result

                };


                products.push(newProduct);

                saveProducts(products);


                console.log(
                    "Produit sauvegardé:",
                    newProduct
                );

                console.log(
                    "Tous les produits:",
                    products
                );


                alert(
                    "Produit ajouté avec succès !"
                );


                window.location.href =
                    "products.html";

            };


            reader.onerror = function () {

                alert(
                    "Impossible de lire l'image."
                );

            };


            reader.readAsDataURL(imageFile);

        }
    );

}


/* =====================================================
   INITIALIZATION
===================================================== */

function initializeForm() {

    updateSubcategories();

    if (editProductId) {
        loadProductForEdit();
    }

}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeForm
    );

} else {

    initializeForm();

}