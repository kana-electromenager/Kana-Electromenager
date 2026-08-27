/* =====================================================
   KANA ADMIN — ADD / EDIT PRODUCT
   FIRESTORE VERSION
===================================================== */


/* =====================================================
   FIREBASE
===================================================== */

import {
    db,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    serverTimestamp
} from "../js/firebase.js";


/* =====================================================
   ELEMENTS
===================================================== */

const addProductForm =
    document.getElementById("addProductForm");

const productName =
    document.getElementById("productName");

const productCategory =
    document.getElementById("productCategory");

const productType =
    document.getElementById("productType");

const productBrand =
    document.getElementById("productBrand");

const productPrice =
    document.getElementById("productPrice");

const productStock =
    document.getElementById("productStock");

const productImage =
    document.getElementById("productImage");

const productDescription =
    document.getElementById("productDescription");

const imagePreview =
    document.getElementById("imagePreview");

const pageTitle =
    document.getElementById("pageTitle");

const formTitle =
    document.getElementById("formTitle");

const submitProductButton =
    document.getElementById("submitProductButton");


/* =====================================================
   EDIT MODE
===================================================== */

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const editProductId =
    urlParams.get("edit");


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

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .replace(
            /œ/g,
            "oe"
        )

        .replace(
            /æ/g,
            "ae"
        )

        .replace(
            /[^a-z0-9]+/g,
            "-"
        )

        .replace(
            /^-+|-+$/g,
            "");

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

    const normalized =
        normalizeText(value);

    return (
        categoryAliases[normalized] ||
        normalized
    );

}


/* =====================================================
   GET TYPE KEY
===================================================== */

function getTypeKey(value) {

    const normalized =
        normalizeText(value);

    return (
        typeAliases[normalized] ||
        normalized
    );

}


/* =====================================================
   UPDATE SUBCATEGORIES
===================================================== */

function updateSubcategories(
    selectedType = ""
) {

    if (
        !productType ||
        !productCategory
    ) {

        return;

    }


    const category =
        getCategoryKey(
            productCategory.value
        );


    productType.innerHTML = "";


    /* ---------------------------------------------
       NO SUBCATEGORY
    --------------------------------------------- */

    if (
        categoriesWithoutSubcategories
            .includes(category)
    ) {

        productType.disabled =
            true;

        productType.innerHTML = `

            <option value="">
                Aucune sous-catégorie
            </option>

        `;

        productType.value = "";

        return;

    }


    /* ---------------------------------------------
       NO CATEGORY
    --------------------------------------------- */

    if (!category) {

        productType.disabled =
            true;

        productType.innerHTML = `

            <option value="">
                Sélectionner d'abord une catégorie
            </option>

        `;

        return;

    }


    /* ---------------------------------------------
       GET OPTIONS
    --------------------------------------------- */

    const options =
        subcategories[category] || [];


    if (options.length === 0) {

        productType.disabled =
            true;

        productType.innerHTML = `

            <option value="">
                Aucune sous-catégorie
            </option>

        `;

        productType.value = "";

        return;

    }


    /* ---------------------------------------------
       DISPLAY OPTIONS
    --------------------------------------------- */

    productType.disabled =
        false;

    productType.innerHTML = `

        <option value="">
            Sélectionner une sous-catégorie
        </option>

    `;


    options.forEach(
        item => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                item.value;

            option.textContent =
                item.label;

            productType.appendChild(
                option
            );

        }
    );


    /* ---------------------------------------------
       EDIT VALUE
    --------------------------------------------- */

    if (selectedType) {

        const normalizedType =
            getTypeKey(
                selectedType
            );


        const exists =
            options.some(
                item =>
                    item.value ===
                    normalizedType
            );


        if (exists) {

            productType.value =
                normalizedType;

        }

    }

}


/* =====================================================
   CATEGORY CHANGE
===================================================== */

if (productCategory) {

    productCategory.addEventListener(
        "change",
        function () {

            updateSubcategories();

        }
    );

}


/* =====================================================
   IMAGE PREVIEW
===================================================== */

if (
    productImage &&
    imagePreview
) {

    productImage.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];


            if (!file) {

                imagePreview.innerHTML = `

                    <span>
                        Aucune image sélectionnée
                    </span>

                `;

                return;

            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Veuillez sélectionner une image."
                );

                this.value = "";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    imagePreview.innerHTML = `

                        <img
                            src="${event.target.result}"
                            alt="Aperçu"
                        >

                    `;

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =====================================================
   GET FIRESTORE PRODUCTS
===================================================== */

async function getFirestoreProducts() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "products"
                )
            );


        return snapshot.docs.map(
            document => ({

                id:
                    document.id,

                ...document.data()

            })
        );

    } catch (error) {

        console.error(
            "Erreur Firestore:",
            error
        );

        throw error;

    }

}


/* =====================================================
   LOAD PRODUCT FOR EDIT
===================================================== */

async function loadProductForEdit() {

    if (!editProductId) {

        return;

    }


    try {

        const products =
            await getFirestoreProducts();


        const product =
            products.find(
                item =>
                    String(item.id) ===
                    String(editProductId)
            );


        if (!product) {

            alert(
                "Produit introuvable."
            );

            window.location.href =
                "products.html";

            return;

        }


        /* -----------------------------------------
           PAGE TITLES
        ----------------------------------------- */

        if (pageTitle) {

            pageTitle.textContent =
                "Modifier un produit";

        }


        if (formTitle) {

            formTitle.textContent =
                "Modification du produit";

        }


        if (submitProductButton) {

            submitProductButton.textContent =
                "ENREGISTRER LES MODIFICATIONS";

        }


        /* -----------------------------------------
           FIELDS
        ----------------------------------------- */

        if (productName) {

            productName.value =
                product.name || "";

        }


        if (productCategory) {

            productCategory.value =
                getCategoryKey(
                    product.category
                );

        }


        updateSubcategories(
            product.type || ""
        );


        if (productBrand) {

            productBrand.value =
                product.brand || "";

        }


        if (productPrice) {

            productPrice.value =
                product.price ?? "";

        }


        if (productStock) {

            productStock.value =
                product.stock ?? "";

        }


        if (productDescription) {

            productDescription.value =
                product.description || "";

        }


        /* -----------------------------------------
           EXISTING IMAGE
        ----------------------------------------- */

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

    } catch (error) {

        console.error(
            "Erreur lors du chargement du produit:",
            error
        );

        alert(
            "Impossible de charger le produit."
        );

    }

}


/* =====================================================
   SUBMIT
===================================================== */

if (addProductForm) {

    addProductForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* -----------------------------------------
               VALUES
            ----------------------------------------- */

            const name =
                productName?.value.trim() ||
                "";


            const category =
                getCategoryKey(
                    productCategory?.value ||
                    ""
                );


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
                productBrand?.value.trim() ||
                "";


            const price =
                Number(
                    productPrice?.value ||
                    0
                );


            const stock =
                Number(
                    productStock?.value ||
                    0
                );


            const description =
                productDescription?.value.trim() ||
                "";


            const imageFile =
                productImage?.files?.[0] ||
                null;


            /* -----------------------------------------
               VALIDATION
            ----------------------------------------- */

            if (
                !name ||
                !category ||
                !brand
            ) {

                alert(
                    "Veuillez remplir les champs obligatoires."
                );

                return;

            }


            const requiresType =
                !categoriesWithoutSubcategories
                    .includes(category) &&

                Array.isArray(
                    subcategories[category]
                ) &&

                subcategories[category]
                    .length > 0;


            if (
                requiresType &&
                !type
            ) {

                alert(
                    "Veuillez sélectionner une sous-catégorie."
                );

                return;

            }


            if (
                Number.isNaN(price) ||
                price < 0
            ) {

                alert(
                    "Prix invalide."
                );

                return;

            }


            if (
                Number.isNaN(stock) ||
                stock < 0
            ) {

                alert(
                    "Stock invalide."
                );

                return;

            }


            /* -----------------------------------------
               BUTTON
            ----------------------------------------- */

            if (submitProductButton) {

                submitProductButton.disabled =
                    true;

                submitProductButton.textContent =
                    editProductId
                        ? "ENREGISTREMENT..."
                        : "AJOUT EN COURS...";

            }


            try {

                /* =====================================
                   IMAGE

                   IMPORTANT:
                   We are NOT using Firebase Storage.

                   For now:
                   - New product without hosted image
                     → image = ""

                   - Existing product
                     → keep existing image

                   The image hosting solution will
                   be connected separately.
                ===================================== */

                let imageURL = "";


                /* -------------------------------------
                   EDIT
                ------------------------------------- */

                if (editProductId) {

                    const productRef =
                        doc(
                            db,
                            "products",
                            editProductId
                        );


                    /*
                       Keep current image if
                       no new image is selected.
                    */

                    const existingProducts =
                        await getFirestoreProducts();


                    const existingProduct =
                        existingProducts.find(
                            item =>
                                String(item.id) ===
                                String(editProductId)
                        );


                    if (
                        existingProduct &&
                        existingProduct.image
                    ) {

                        imageURL =
                            existingProduct.image;

                    }


                    /*
                       NOTE:
                       The selected new image is
                       currently only previewed.
                    */


                    await updateDoc(
                        productRef,
                        {

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
                                imageURL,

                            updatedAt:
                                serverTimestamp()

                        }
                    );


                    alert(
                        "Produit modifié avec succès !"
                    );


                    window.location.href =
                        "products.html";

                    return;

                }


                /* -------------------------------------
                   ADD NEW PRODUCT
                ------------------------------------- */

                await addDoc(
                    collection(
                        db,
                        "products"
                    ),
                    {

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
                            imageURL,

                        createdAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()

                    }
                );


                alert(
                    "Produit ajouté avec succès !"
                );


                window.location.href =
                    "products.html";


            } catch (error) {

                console.error(
                    "Erreur lors de l'enregistrement:",
                    error
                );


                alert(
                    "Erreur Firebase : " +
                    error.message
                );


                if (
                    submitProductButton
                ) {

                    submitProductButton.disabled =
                        false;

                    submitProductButton.textContent =
                        editProductId
                            ? "ENREGISTRER LES MODIFICATIONS"
                            : "AJOUTER LE PRODUIT";

                }

            }

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


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeForm
    );

} else {

    initializeForm();

}
