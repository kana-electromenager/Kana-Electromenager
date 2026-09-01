/* =====================================================
   KANA ADMIN — EDIT PRODUCT
   FIRESTORE VERSION
===================================================== */

import {
    db,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "./firebase.js";


/* =====================================================
   ELEMENTS
===================================================== */

const form =
    document.getElementById("editProductForm");

const nameInput =
    document.getElementById("productName");

const categoryInput =
    document.getElementById("productCategory");

const typeInput =
    document.getElementById("productType");

const brandInput =
    document.getElementById("productBrand");

const priceInput =
    document.getElementById("productPrice");

const stockInput =
    document.getElementById("productStock");

const imageInput =
    document.getElementById("productImage");

const descriptionInput =
    document.getElementById("productDescription");

const preview =
    document.getElementById("imagePreview");

const pageTitle =
    document.getElementById("pageTitle");

const formTitle =
    document.getElementById("formTitle");

const submitButton =
    document.getElementById("submitProductButton");

const logoutButton =
    document.getElementById("logoutButton");

const characteristicsEditor =
    document.getElementById("characteristicsEditor");

const addCharacteristicButton =
    document.getElementById("addCharacteristic");

const promotionCheckbox =
    document.getElementById("productPromotion");

const promotionPriceGroup =
    document.getElementById("promotionPriceGroup");

const oldPriceInput =
    document.getElementById("productOldPrice");

 
function updatePromotionPriceField() {

    if (!promotionCheckbox || !promotionPriceGroup) {
        return;
    }

    if (promotionCheckbox.checked) {

        promotionPriceGroup.style.display = "";

        if (oldPriceInput) {
            oldPriceInput.required = true;
        }

    } else {

        promotionPriceGroup.style.display = "none";

        if (oldPriceInput) {
            oldPriceInput.required = false;
            oldPriceInput.value = "";
        }

    }

}


if (promotionCheckbox) {

    promotionCheckbox.addEventListener(
        "change",
        updatePromotionPriceField
    );

}
/* =====================================================
   PRODUCT ID
===================================================== */

const productId =
    new URLSearchParams(
        window.location.search
    ).get("id");


/* =====================================================
   SUBCATEGORIES
===================================================== */

const subcategories = {

    "refrigerateurs-congelateurs": [

        ["refrigerateurs", "Réfrigérateurs"],
        ["congelateurs", "Congélateurs"]

    ],

    cuisine: [

        ["machines-a-cafe", "Machines à café"],

        [
            "blender-hachoir-mixeur-batteur",
            "Hachoir - Mixeur - Batteur - Blender"
        ],

        ["micro-ondes", "Micro-ondes"],
        ["fours", "Fours"],
        ["cuisinieres", "Cuisinières"],
        ["air-fryer", "Air Fryer"],
        ["petran", "Petran"]

    ],

    "maison-entretien": [

        ["climatisation", "Climatisation"],
        ["ventilateurs", "Ventilateurs"],
        ["aspirateurs", "Aspirateurs"],
        ["chauffe-eau", "Chauffe-eau"],
        ["chauffages", "Chauffages"]

    ]

};


/* =====================================================
   CATEGORY ALIASES
===================================================== */

const categoryAliases = {

    "maison-et-entretien":
        "maison-entretien",

    refrigerateur:
        "refrigerateurs-congelateurs",

    refrigerateurs:
        "refrigerateurs-congelateurs",

    congelateur:
        "refrigerateurs-congelateurs",

    congelateurs:
        "refrigerateurs-congelateurs",

    "refrigerateur-congelateur":
        "refrigerateurs-congelateurs",

    tv:
        "televisions",

    television:
        "televisions",

    "machine-a-laver":
        "machines-a-laver"

};


/* =====================================================
   TYPE ALIASES
===================================================== */

const typeAliases = {

    aspirateur:
        "aspirateurs",

    ventilateur:
        "ventilateurs",

    climatiseur:
        "climatisation",

    climatiseurs:
        "climatisation",

    chauffage:
        "chauffages",

    "chauffe-eaux":
        "chauffe-eau",

    refrigerateur:
        "refrigerateurs",

    congelateur:
        "congelateurs",

    television:
        "televisions",

    "machine-a-laver":
        "machines-a-laver",

    "machine-a-cafe":
        "machines-a-cafe",

    "air-fryers":
        "air-fryer",

    "micro-onde":
        "micro-ondes",

    four:
        "fours",

    cuisiniere:
        "cuisinieres"

};


/* =====================================================
   VARIABLES
===================================================== */

let existingImage = "";
let selectedImage = "";
let imageProcessing = false;
let imageChangeNumber = 0;
let status;


/* =====================================================
   NORMALIZE
===================================================== */

function normalize(value) {

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
   CATEGORY KEY
===================================================== */

function categoryKey(value) {

    const key =
        normalize(value);

    return (
        categoryAliases[key] ||
        key
    );

}


/* =====================================================
   TYPE KEY
===================================================== */

function typeKey(value) {

    const key =
        normalize(value);

    return (
        typeAliases[key] ||
        key
    );

}


/* =====================================================
   STATUS
===================================================== */

function createStatus() {

    if (!form) return;

    status =
        document.createElement("p");

    status.className =
        "admin-form-status";

    status.setAttribute(
        "role",
        "status"
    );

    status.setAttribute(
        "aria-live",
        "polite"
    );

    form.appendChild(status);

}


function setStatus(
    message,
    isError = false
) {

    if (!status) return;

    status.textContent =
        message || "";

    status.style.color =
        isError
            ? "#b42318"
            : "";

}


/* =====================================================
   CHARACTERISTICS
===================================================== */

/*
   Supported Firestore formats:

   1.
   characteristics: {
       "Puissance": "2000 W",
       "Capacité": "500 L"
   }

   2.
   characteristics: [
       {
           name: "Puissance",
           value: "2000 W"
       },
       {
           name: "Capacité",
           value: "500 L"
       }
   ]
*/


function createCharacteristicRow(
    characteristicName = "",
    characteristicValue = ""
) {

    if (!characteristicsEditor) {
        return;
    }


    const row =
        document.createElement("div");

    row.className =
        "characteristic-editor-row";


    const name =
        document.createElement("input");

    name.type =
        "text";

    name.className =
        "characteristic-name";

    name.placeholder =
        "Ex : Puissance";

    name.value =
        characteristicName;


    const value =
        document.createElement("input");

    value.type =
        "text";

    value.className =
        "characteristic-value";

    value.placeholder =
        "Ex : 2000 W";

    value.value =
        characteristicValue;


    const remove =
        document.createElement("button");

    remove.type =
        "button";

    remove.className =
        "characteristic-remove";

    remove.textContent =
        "×";

    remove.title =
        "Supprimer";


    remove.addEventListener(
        "click",
        function () {

            row.remove();

        }
    );


    row.append(
        name,
        value,
        remove
    );


    characteristicsEditor.appendChild(
        row
    );

}


/* =====================================================
   DISPLAY CHARACTERISTICS
===================================================== */

function displayCharacteristics(
    characteristics
) {

    if (!characteristicsEditor) {
        return;
    }


    characteristicsEditor.replaceChildren();


    /*
       Nothing saved
    */

    if (!characteristics) {

        return;

    }


    /*
       FIRESTORE MAP / OBJECT

       {
          "Puissance": "2000 W",
          "Capacité": "500 L"
       }
    */

    if (
        typeof characteristics === "object" &&
        !Array.isArray(characteristics)
    ) {

        Object.entries(characteristics)
            .forEach(function (entry) {

                createCharacteristicRow(
                    entry[0],
                    entry[1]
                );

            });

        return;

    }


    /*
       ARRAY

       [
          {
             name: "...",
             value: "..."
          }
       ]
    */

    if (Array.isArray(characteristics)) {

        characteristics.forEach(
            function (item) {

                if (
                    item &&
                    typeof item === "object"
                ) {

                    createCharacteristicRow(
                        item.name ||
                        item.label ||
                        "",
                        item.value ||
                        ""
                    );

                }

            }
        );

    }

}


/* =====================================================
   COLLECT CHARACTERISTICS
===================================================== */

function collectCharacteristics() {

    const result = {};


    if (!characteristicsEditor) {
        return result;
    }


    const rows =
        characteristicsEditor.querySelectorAll(
            ".characteristic-editor-row"
        );


    rows.forEach(function (row) {

        const nameInput =
            row.querySelector(
                ".characteristic-name"
            );

        const valueInput =
            row.querySelector(
                ".characteristic-value"
            );


        const name =
            nameInput
                ? nameInput.value.trim()
                : "";

        const value =
            valueInput
                ? valueInput.value.trim()
                : "";


        /*
           Ignore completely empty rows
        */

        if (!name && !value) {
            return;
        }


        /*
           Only save rows with a name
        */

        if (name) {

            result[name] =
                value;

        }

    });


    return result;

}


/* =====================================================
   IMAGE PREVIEW
===================================================== */

function showPreview(
    dataUrl,
    alt
) {

    if (!preview) return;

    preview.replaceChildren();


    if (!dataUrl) {

        preview.appendChild(
            document.createTextNode(
                "Aucune image disponible"
            )
        );

        return;

    }


    const image =
        document.createElement("img");

    image.src =
        dataUrl;

    image.alt =
        alt ||
        "Aperçu du produit";


    image.onerror =
        function () {

            preview.replaceChildren(
                document.createTextNode(
                    "Image indisponible"
                )
            );

        };


    preview.appendChild(
        image
    );

}


/* =====================================================
   UPDATE SUBCATEGORIES
===================================================== */

function updateTypes(
    selectedType = ""
) {

    if (!typeInput) return;


    const category =
        categoryKey(
            categoryInput
                ? categoryInput.value
                : ""
        );


    const options =
        subcategories[category] ||
        [];


    typeInput.replaceChildren();


    if (!options.length) {

        typeInput.disabled =
            true;

        typeInput.required =
            false;

        typeInput.appendChild(
            new Option(
                "Aucune sous-catégorie",
                ""
            )
        );

        return;

    }


    typeInput.disabled =
        false;

    typeInput.required =
        true;


    typeInput.appendChild(
        new Option(
            "Sélectionner une sous-catégorie",
            ""
        )
    );


    options.forEach(function (item) {

        typeInput.appendChild(
            new Option(
                item[1],
                item[0]
            )
        );

    });


    const normalizedType =
        typeKey(selectedType);


    typeInput.value =
        normalizedType;


    if (
        selectedType &&
        typeInput.value !== normalizedType
    ) {

        typeInput.value =
            "";

    }

}


/* =====================================================
   IMAGE → BROWSER OBJECT
===================================================== */

function imageFromFile(file) {

    if ("createImageBitmap" in window) {

        return createImageBitmap(
            file,
            {
                imageOrientation:
                    "from-image"
            }
        )
        .catch(function () {

            return imageFromReader(file);

        });

    }


    return imageFromReader(file);

}


/* =====================================================
   FILE READER
===================================================== */

function imageFromReader(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();

            const image =
                new Image();


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Impossible de lire le fichier image."
                        )
                    );

                };


            image.onerror =
                function () {

                    reject(
                        new Error(
                            "Le navigateur ne peut pas ouvrir cette image."
                        )
                    );

                };


            image.onload =
                function () {

                    resolve(image);

                };


            reader.onload =
                function () {

                    image.src =
                        reader.result;

                };


            reader.readAsDataURL(file);

        }
    );

}


/* =====================================================
   COMPRESS IMAGE
===================================================== */

async function compressImage(file) {

    const maxSourceBytes =
        10 * 1024 * 1024;

    const maxDataUrlLength =
        600000;


    if (!file || !file.size) {

        throw new Error(
            "Veuillez sélectionner une image valide."
        );

    }


    if (
        !file.type ||
        !file.type.startsWith("image/")
    ) {

        throw new Error(
            "Le fichier doit être une image."
        );

    }


    if (
        file.size >
        maxSourceBytes
    ) {

        throw new Error(
            "L'image est trop volumineuse. La limite est de 10 Mo."
        );

    }


    const source =
        await imageFromFile(file);


    try {

        if (
            !source.width ||
            !source.height
        ) {

            throw new Error(
                "Les dimensions de l'image sont invalides."
            );

        }


        const ratio =
            Math.min(
                1,
                1600 /
                Math.max(
                    source.width,
                    source.height
                )
            );


        for (
            let attempt = 0;
            attempt < 10;
            attempt += 1
        ) {

            const scale =
                ratio *
                Math.pow(
                    0.8,
                    attempt
                );


            const width =
                Math.max(
                    1,
                    Math.round(
                        source.width *
                        scale
                    )
                );


            const height =
                Math.max(
                    1,
                    Math.round(
                        source.height *
                        scale
                    )
                );


            const canvas =
                document.createElement(
                    "canvas"
                );


            const context =
                canvas.getContext("2d");


            if (!context) {

                throw new Error(
                    "La compression de l'image n'est pas disponible."
                );

            }


            canvas.width =
                width;

            canvas.height =
                height;


            context.fillStyle =
                "#ffffff";

            context.fillRect(
                0,
                0,
                width,
                height
            );


            context.drawImage(
                source,
                0,
                0,
                width,
                height
            );


            const quality =
                Math.max(
                    0.42,
                    0.82 -
                    attempt * 0.05
                );


            const dataUrl =
                canvas.toDataURL(
                    "image/jpeg",
                    quality
                );


            if (
                dataUrl.length <=
                maxDataUrlLength
            ) {

                return dataUrl;

            }

        }

    } finally {

        if (
            typeof source.close ===
            "function"
        ) {

            source.close();

        }

    }


    throw new Error(
        "Cette image reste trop grande après compression. Choisissez une image plus petite."
    );

}


/* =====================================================
   HANDLE NEW IMAGE
===================================================== */

async function handleImageChange() {

    const file =
        imageInput &&
        imageInput.files
            ? imageInput.files[0]
            : null;


    if (!file) return;


    const changeNumber =
        ++imageChangeNumber;


    imageProcessing =
        true;

    selectedImage =
        "";


    setStatus(
        "Compression de l'image..."
    );


    try {

        const compressedImage =
            await compressImage(file);


        if (
            changeNumber !==
            imageChangeNumber
        ) {

            return;

        }


        selectedImage =
            compressedImage;


        showPreview(
            selectedImage,
            "Nouvelle image du produit"
        );


        setStatus(
            "Nouvelle image prête à être enregistrée."
        );


    } catch (error) {

        if (
            changeNumber !==
            imageChangeNumber
        ) {

            return;

        }


        if (imageInput) {
            imageInput.value = "";
        }


        showPreview(
            existingImage,
            "Image actuelle"
        );


        setStatus(
            error.message ||
            "Impossible de préparer cette image.",
            true
        );


    } finally {

        if (
            changeNumber ===
            imageChangeNumber
        ) {

            imageProcessing =
                false;

        }

    }

}


/* =====================================================
   LOAD PRODUCT
===================================================== */

async function loadProduct() {

    if (
        !productId ||
        productId.includes("/")
    ) {

        throw new Error(
            "Identifiant du produit invalide."
        );

    }


    setStatus(
        "Chargement du produit..."
    );


    const productRef =
        doc(
            db,
            "products",
            productId
        );


    const snapshot =
        await getDoc(productRef);


    if (!snapshot.exists()) {

        throw new Error(
            "Produit introuvable."
        );

    }


    return {

        id:
            snapshot.id,

        ...snapshot.data()

    };

}


/* =====================================================
   DISPLAY PRODUCT
===================================================== */

function displayProduct(product) {

    if (!product) {

        throw new Error(
            "Produit introuvable."
        );

    }


    /* NAME */

    if (nameInput) {

        nameInput.value =
            product.name || "";

    }


    /* CATEGORY */

    if (categoryInput) {

        categoryInput.value =
            categoryKey(
                product.category
            );

    }


    /* TYPE */

    updateTypes(
        product.type || ""
    );


    /* BRAND */

    if (brandInput) {

        brandInput.value =
            product.brand || "";

    }


    /* PRICE */

    if (priceInput) {

        priceInput.value =
            product.price ?? "";

    }


    /* STOCK */

    if (stockInput) {

        stockInput.value =
            product.stock ?? "";

    }


    /* DESCRIPTION */

    if (descriptionInput) {

        descriptionInput.value =
            product.description || "";

    }


    /* CHARACTERISTICS */

    displayCharacteristics(
        product.characteristics
    );


    /* IMAGE */

    existingImage =
        product.image || "";

    selectedImage =
        "";


    showPreview(
        existingImage,
        "Image actuelle du produit"
    );


    /* TITLES */

    if (pageTitle) {

        pageTitle.textContent =
            "Modifier un produit";

    }


    if (formTitle) {

        formTitle.textContent =
            product.name
                ? product.name
                : "Modification du produit";

    }


    document.title =
        (
            product.name ||
            "Modifier un produit"
        ) +
        " | KANA Admin";


    setStatus("");

}


/* =====================================================
   COLLECT PRODUCT
===================================================== */

function productValues() {

    const category =
        categoryKey(
            categoryInput
                ? categoryInput.value
                : ""
        );


    const type =
        typeInput &&
        !typeInput.disabled
            ? typeKey(
                typeInput.value
            )
            : "";


    const price =
        Number(
            priceInput
                ? priceInput.value
                : NaN
        );


    const stock =
        Number(
            stockInput
                ? stockInput.value
                : NaN
        );


    return {

        name:
            nameInput
                ? nameInput.value.trim()
                : "",


        category:
            category,


        type:
            type,


        brand:
            brandInput
                ? brandInput.value.trim()
                : "",


        price:
            price,


        stock:
            stock,


        availability:
            stock > 0
                ? "Disponible"
                : "Indisponible",


        description:
            descriptionInput
                ? descriptionInput.value.trim()
                : "",


        /*
           CHARACTERISTICS
        */

        characteristics:
            collectCharacteristics(),


        /*
           IMAGE
        */

        image:
            selectedImage ||
            existingImage ||
            ""

    };

}


/* =====================================================
   VALIDATE PRODUCT
===================================================== */

function validateProduct(product) {

    if (
        !product.name ||
        !product.category ||
        !product.brand
    ) {

        return (
            "Veuillez remplir le nom, " +
            "la catégorie et la marque."
        );

    }


    if (
        subcategories[product.category] &&
        !product.type
    ) {

        return (
            "Veuillez sélectionner une sous-catégorie."
        );

    }


    if (
        !Number.isFinite(product.price) ||
        product.price < 0 ||
        !Number.isInteger(product.price)
    ) {

        return (
            "Le prix doit être un nombre entier positif."
        );

    }


    if (
        !Number.isFinite(product.stock) ||
        product.stock < 0 ||
        !Number.isInteger(product.stock)
    ) {

        return (
            "Le stock doit être un nombre entier positif."
        );

    }


    return "";

}


/* =====================================================
   SUBMIT BUTTON
===================================================== */

function setSubmitting(
    isSubmitting
) {

    if (!submitButton) return;


    submitButton.disabled =
        isSubmitting;


    submitButton.textContent =
        isSubmitting
            ? "ENREGISTREMENT..."
            : "ENREGISTRER LES MODIFICATIONS";

}


/* =====================================================
   SAVE CHANGES
===================================================== */

async function submit(event) {

    event.preventDefault();


    if (!form) return;


    if (!form.reportValidity()) {

        return;

    }


    if (imageProcessing) {

        setStatus(
            "Veuillez attendre la fin de la compression de l'image.",
            true
        );

        return;

    }


    if (
        !productId ||
        productId.includes("/")
    ) {

        setStatus(
            "Identifiant du produit invalide.",
            true
        );

        return;

    }


    const product =
        productValues();


    const validationError =
        validateProduct(product);


    if (validationError) {

        setStatus(
            validationError,
            true
        );

        return;

    }


    setSubmitting(true);

    setStatus("");


    try {

        await updateDoc(

            doc(
                db,
                "products",
                productId
            ),

            {

                ...product,

                updatedAt:
                    serverTimestamp()

            }

        );


        setStatus(
            "Produit modifié avec succès."
        );


        window.setTimeout(
            function () {

                window.location.href =
                    "products.html";

            },
            700
        );


    } catch (error) {

        console.error(
            "Erreur Firestore lors de la modification :",
            error
        );


        setStatus(
            "Impossible de modifier le produit. Vérifiez votre connexion et les règles Firestore.",
            true
        );


        setSubmitting(false);

    }

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    sessionStorage.removeItem(
        "kanaAdminLoggedIn"
    );


    window.location.href =
        "login.html";

}


/* =====================================================
   INITIALIZE
===================================================== */

async function initialize() {

    createStatus();


    if (!productId) {

        setStatus(
            "Aucun produit à modifier.",
            true
        );


        window.setTimeout(
            function () {

                window.location.href =
                    "products.html";

            },
            1200
        );


        return;

    }


    /* CATEGORY */

    if (categoryInput) {

        categoryInput.addEventListener(
            "change",
            function () {

                updateTypes();

            }
        );

    }


    /* IMAGE */

    if (imageInput) {

        imageInput.addEventListener(
            "change",
            handleImageChange
        );

    }


    /* ADD CHARACTERISTIC */

    if (addCharacteristicButton) {

        addCharacteristicButton.addEventListener(
            "click",
            function () {

                createCharacteristicRow();

            }
        );

    }


    /* SUBMIT */

    if (form) {

        form.addEventListener(
            "submit",
            submit
        );

    }


    /* LOGOUT */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }


    /* LOAD */

    try {

        const product =
            await loadProduct();


        displayProduct(
            product
        );


    } catch (error) {

        console.error(
            "Erreur lors du chargement du produit :",
            error
        );


        setStatus(
            error.message ||
            "Impossible de charger le produit.",
            true
        );


        window.setTimeout(
            function () {

                window.location.href =
                    "products.html";

            },
            1500
        );

    }

}


/* =====================================================
   START
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );

} else {

    initialize();

}