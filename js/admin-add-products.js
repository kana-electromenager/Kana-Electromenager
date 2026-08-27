/* =====================================================
   KANA ADMIN — ADD / EDIT PRODUCT
   FIRESTORE + IMAGE DATA URL
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
    new URLSearchParams(window.location.search);

const editProductId =
    urlParams.get("edit");


/* =====================================================
   SUBCATEGORIES
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


const categoriesWithoutSubcategories = [

    "televisions",

    "machines-a-laver",

    "lave-vaisselle"

];


/* =====================================================
   NORMALIZE TEXT
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
   CATEGORY KEY
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
   TYPE KEY
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

function updateSubcategories(selectedType = "") {

    if (
        !productType ||
        !productCategory
    ) {
        return;
    }


    const category =
        getCategoryKey(productCategory.value);


    productType.innerHTML = "";


    if (
        categoriesWithoutSubcategories.includes(
            category
        )
    ) {

        productType.disabled = true;

        productType.innerHTML = `
            <option value="">
                Aucune sous-catégorie
            </option>
        `;

        productType.value = "";

        return;
    }


    if (!category) {

        productType.disabled = true;

        productType.innerHTML = `
            <option value="">
                Sélectionner d'abord une catégorie
            </option>
        `;

        return;
    }


    const options =
        subcategories[category] || [];


    if (!options.length) {

        productType.disabled = true;

        productType.innerHTML = `
            <option value="">
                Aucune sous-catégorie
            </option>
        `;

        productType.value = "";

        return;
    }


    productType.disabled = false;

    productType.innerHTML = `
        <option value="">
            Sélectionner une sous-catégorie
        </option>
    `;


    options.forEach(item => {

        const option =
            document.createElement("option");

        option.value =
            item.value;

        option.textContent =
            item.label;

        productType.appendChild(option);

    });


    if (selectedType) {

        const normalizedType =
            getTypeKey(selectedType);

        const exists =
            options.some(
                item =>
                    item.value === normalizedType
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
        () => {

            updateSubcategories();

        }
    );

}


/* =====================================================
   IMAGE → COMPRESSED DATA URL
===================================================== */

function compressImage(file) {

    return new Promise((resolve, reject) => {

        if (!file) {

            reject(
                new Error("Aucune image.")
            );

            return;
        }


        if (!file.type.startsWith("image/")) {

            reject(
                new Error(
                    "Le fichier sélectionné n'est pas une image."
                )
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload = event => {

            const img =
                new Image();


            img.onload = () => {

                /*
                 * Image volontairement réduite.
                 * Cela permet de limiter la taille
                 * du document Firestore.
                 */

                const maxSize = 800;

                let width =
                    img.width;

                let height =
                    img.height;


                if (
                    width > maxSize ||
                    height > maxSize
                ) {

                    if (width > height) {

                        height =
                            Math.round(
                                height *
                                maxSize /
                                width
                            );

                        width =
                            maxSize;

                    } else {

                        width =
                            Math.round(
                                width *
                                maxSize /
                                height
                            );

                        height =
                            maxSize;

                    }

                }


                const canvas =
                    document.createElement("canvas");

                canvas.width =
                    width;

                canvas.height =
                    height;


                const context =
                    canvas.getContext("2d");


                context.drawImage(
                    img,
                    0,
                    0,
                    width,
                    height
                );


                /*
                 * JPEG compressé.
                 */

                const dataURL =
                    canvas.toDataURL(
                        "image/jpeg",
                        0.70
                    );


                resolve(dataURL);

            };


            img.onerror = () => {

                reject(
                    new Error(
                        "Impossible de lire l'image."
                    )
                );

            };


            img.src =
                event.target.result;

        };


        reader.onerror = () => {

            reject(
                new Error(
                    "Impossible de lire le fichier."
                )
            );

        };


        reader.readAsDataURL(file);

    });

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
        async function () {

            const file =
                this.files[0];


            if (!file) {

                return;

            }


            if (!file.type.startsWith("image/")) {

                alert(
                    "Veuillez sélectionner une image."
                );

                this.value = "";

                return;

            }


            try {

                const imageURL =
                    await compressImage(file);


                imagePreview.innerHTML = `
                    <img
                        src="${imageURL}"
                        alt="Aperçu"
                    >
                `;

            } catch (error) {

                console.error(error);

                alert(
                    error.message
                );

            }

        }
    );

}


/* =====================================================
   GET PRODUCTS
===================================================== */

async function getFirestoreProducts() {

    const snapshot =
        await getDocs(
            collection(db, "products")
        );


    return snapshot.docs.map(
        productDocument => ({

            id:
                productDocument.id,

            ...productDocument.data()

        })
    );

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


        /*
         * Afficher l'image déjà enregistrée.
         */

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


            const name =
                productName?.value.trim() || "";


            const category =
                getCategoryKey(
                    productCategory?.value || ""
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
                productDescription?.value.trim() ||
                "";


            const imageFile =
                productImage?.files?.[0] ||
                null;


            /* =================================================
               VALIDATION
            ================================================= */

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
                !categoriesWithoutSubcategories.includes(
                    category
                ) &&
                Array.isArray(
                    subcategories[category]
                ) &&
                subcategories[category].length > 0;


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


            if (submitProductButton) {

                submitProductButton.disabled =
                    true;

                submitProductButton.textContent =
                    editProductId
                        ? "ENREGISTREMENT..."
                        : "AJOUT EN COURS...";

            }


            try {

                /* =================================================
                   IMAGE
                ================================================= */

                let imageURL = "";


                /* =================================================
                   EDIT EXISTING PRODUCT
                ================================================= */

                if (editProductId) {

                    const products =
                        await getFirestoreProducts();


                    const existingProduct =
                        products.find(
                            item =>
                                String(item.id) ===
                                String(editProductId)
                        );


                    /*
                     * IMPORTANT :
                     * Si aucune nouvelle image n'est choisie,
                     * on conserve l'ancienne image.
                     */

                    if (
                        existingProduct &&
                        existingProduct.image
                    ) {

                        imageURL =
                            existingProduct.image;

                    }


                    /*
                     * Si une nouvelle image est choisie,
                     * elle remplace l'ancienne.
                     */

                    if (imageFile) {

                        imageURL =
                            await compressImage(
                                imageFile
                            );

                    }


                    const productRef =
                        doc(
                            db,
                            "products",
                            editProductId
                        );


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


                /* =================================================
                   ADD NEW PRODUCT
                ================================================= */

                if (imageFile) {

                    imageURL =
                        await compressImage(
                            imageFile
                        );

                }


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

                        /*
                         * L'image est stockée directement
                         * dans Firestore sous forme Data URL.
                         */

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


                if (submitProductButton) {

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