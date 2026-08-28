/* KANA admin add/edit product — Firestore and compressed Data URL images. */
import {
    db,
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "./firebase.js";

const form = document.getElementById("addProductForm");
const nameInput = document.getElementById("productName");
const categoryInput = document.getElementById("productCategory");
const typeInput = document.getElementById("productType");
const brandInput = document.getElementById("productBrand");
const priceInput = document.getElementById("productPrice");
const stockInput = document.getElementById("productStock");
const imageInput = document.getElementById("productImage");
const descriptionInput = document.getElementById("productDescription");
const preview = document.getElementById("imagePreview");
const pageTitle = document.getElementById("pageTitle");
const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitProductButton");
const logoutButton = document.getElementById("logoutButton");
const editProductId = new URLSearchParams(window.location.search).get("edit");

const subcategories = {
    "refrigerateurs-congelateurs": [
        ["refrigerateurs", "Réfrigérateurs"],
        ["congelateurs", "Congélateurs"]
    ],
    cuisine: [
        ["machines-a-cafe", "Machines à café"],
        ["blender-hachoir-mixeur-batteur", "Hachoir - Mixeur - Batteur - Blender"],
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

const categoryAliases = {
    "maison-et-entretien": "maison-entretien",
    refrigerateur: "refrigerateurs-congelateurs",
    refrigerateurs: "refrigerateurs-congelateurs",
    congelateur: "refrigerateurs-congelateurs",
    congelateurs: "refrigerateurs-congelateurs",
    "refrigerateur-congelateur": "refrigerateurs-congelateurs",
    tv: "televisions",
    television: "televisions",
    "machine-a-laver": "machines-a-laver"
};

const typeAliases = {
    aspirateur: "aspirateurs", ventilateur: "ventilateurs",
    climatiseur: "climatisation", climatiseurs: "climatisation",
    chauffage: "chauffages", "chauffe-eaux": "chauffe-eau",
    refrigerateur: "refrigerateurs", congelateur: "congelateurs",
    television: "televisions", "machine-a-laver": "machines-a-laver",
    "machine-a-cafe": "machines-a-cafe", "air-fryers": "air-fryer",
    "micro-onde": "micro-ondes", four: "fours", cuisiniere: "cuisinieres"
};

let existingImage = "";
let selectedImage = "";
let imageProcessing = false;
let imageChangeNumber = 0;
let status;

function normalize(value) {
    return String(value || "").toLowerCase().trim().normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "").replace(/œ/g, "oe").replace(/æ/g, "ae")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function categoryKey(value) {
    const key = normalize(value);
    return categoryAliases[key] || key;
}

function typeKey(value) {
    const key = normalize(value);
    return typeAliases[key] || key;
}

function createStatus() {
    if (!form) return;
    status = document.createElement("p");
    status.className = "admin-form-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    form.appendChild(status);
}

function setStatus(message, isError) {
    if (!status) return;
    status.textContent = message || "";
    status.style.color = isError ? "#b42318" : "";
}

function showPreview(dataUrl, alt) {
    if (!preview) return;
    preview.replaceChildren();
    if (!dataUrl) {
        preview.appendChild(document.createTextNode("Aucune image sélectionnée"));
        return;
    }

    const image = document.createElement("img");
    image.src = dataUrl;
    image.alt = alt || "Aperçu du produit";
    image.onerror = function () {
        preview.replaceChildren(document.createTextNode("Image indisponible"));
    };
    preview.appendChild(image);
}

function updateTypes(selectedType) {
    if (!typeInput) return;
    const category = categoryKey(categoryInput ? categoryInput.value : "");
    const options = subcategories[category] || [];

    typeInput.replaceChildren();
    if (!options.length) {
        typeInput.disabled = true;
        typeInput.appendChild(new Option("Aucune sous-catégorie", ""));
        return;
    }

    typeInput.disabled = false;
    typeInput.appendChild(new Option("Sélectionner une sous-catégorie", ""));
    options.forEach(function (item) {
        typeInput.appendChild(new Option(item[1], item[0]));
    });
    typeInput.value = typeKey(selectedType);
}

function imageFromFile(file) {
    if ("createImageBitmap" in window) {
        return createImageBitmap(file, { imageOrientation: "from-image" }).catch(function () {
            return imageFromReader(file);
        });
    }
    return imageFromReader(file);
}

function imageFromReader(file) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        const image = new Image();
        reader.onerror = function () { reject(new Error("Impossible de lire le fichier image.")); };
        image.onerror = function () { reject(new Error("Le navigateur ne peut pas ouvrir cette image.")); };
        image.onload = function () { resolve(image); };
        reader.onload = function () { image.src = reader.result; };
        reader.readAsDataURL(file);
    });
}

async function compressImage(file) {
    const maxSourceBytes = 10 * 1024 * 1024;
    const maxDataUrlLength = 600000;

    if (!file || !file.size) throw new Error("Veuillez sélectionner une image valide.");
    if (!file.type || !file.type.startsWith("image/")) throw new Error("Le fichier doit être une image.");
    if (file.size > maxSourceBytes) throw new Error("L'image est trop volumineuse. La limite est de 10 Mo.");

    const source = await imageFromFile(file);
    try {
        if (!source.width || !source.height) throw new Error("Les dimensions de l'image sont invalides.");
        const ratio = Math.min(1, 1600 / Math.max(source.width, source.height));

        for (let attempt = 0; attempt < 10; attempt += 1) {
            const scale = ratio * Math.pow(0.8, attempt);
            const width = Math.max(1, Math.round(source.width * scale));
            const height = Math.max(1, Math.round(source.height * scale));
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            if (!context) throw new Error("La compression de l'image n'est pas disponible.");

            canvas.width = width;
            canvas.height = height;
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, width, height);
            context.drawImage(source, 0, 0, width, height);

            const quality = Math.max(0.42, 0.82 - attempt * 0.05);
            const dataUrl = canvas.toDataURL("image/jpeg", quality);
            if (dataUrl.length <= maxDataUrlLength) return dataUrl;
        }
    } finally {
        if (typeof source.close === "function") source.close();
    }

    throw new Error("Cette image reste trop grande après compression. Choisissez une image plus petite.");
}

async function handleImageChange() {
    const file = imageInput && imageInput.files ? imageInput.files[0] : null;
    if (!file) return;

    const changeNumber = ++imageChangeNumber;
    imageProcessing = true;
    selectedImage = "";
    setStatus("Compression de l'image...");

    try {
        const compressedImage = await compressImage(file);
        if (changeNumber !== imageChangeNumber) return;
        selectedImage = compressedImage;
        showPreview(selectedImage, "Aperçu de l'image compressée");
        setStatus("Image compressée et prête à être enregistrée.");
    } catch (error) {
        if (changeNumber !== imageChangeNumber) return;
        if (imageInput) imageInput.value = "";
        showPreview(existingImage, existingImage ? "Image actuelle" : "");
        setStatus(error.message || "Impossible de préparer cette image.", true);
    } finally {
        if (changeNumber === imageChangeNumber) imageProcessing = false;
    }
}

function setSubmitting(isSubmitting) {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    if (isSubmitting) {
        submitButton.textContent = editProductId ? "ENREGISTREMENT..." : "AJOUT EN COURS...";
    } else {
        submitButton.textContent = editProductId ? "ENREGISTRER LES MODIFICATIONS" : "AJOUTER LE PRODUIT";
    }
}

function productValues() {
    const category = categoryKey(categoryInput ? categoryInput.value : "");
    const type = typeInput && !typeInput.disabled ? typeKey(typeInput.value) : "";
    const price = Number(priceInput ? priceInput.value : NaN);
    const stock = Number(stockInput ? stockInput.value : NaN);
    return {
        name: nameInput ? nameInput.value.trim() : "",
        category: category,
        type: type,
        brand: brandInput ? brandInput.value.trim() : "",
        price: price,
        stock: stock,
        availability: stock > 0 ? "Disponible" : "Indisponible",
        description: descriptionInput ? descriptionInput.value.trim() : "",
        image: selectedImage || existingImage || ""
    };
}

function validateProduct(product) {
    if (!product.name || !product.category || !product.brand) {
        return "Veuillez remplir le nom, la catégorie et la marque.";
    }
    if (subcategories[product.category] && !product.type) {
        return "Veuillez sélectionner une sous-catégorie.";
    }
    if (!Number.isFinite(product.price) || product.price < 0 || !Number.isInteger(product.price)) {
        return "Le prix doit être un nombre entier positif.";
    }
    if (!Number.isFinite(product.stock) || product.stock < 0 || !Number.isInteger(product.stock)) {
        return "Le stock doit être un nombre entier positif.";
    }
    return "";
}

async function loadForEdit() {
    if (!editProductId || editProductId.includes("/")) return;
    setStatus("Chargement du produit...");

    try {
        const snapshot = await getDoc(doc(db, "products", editProductId));
        if (!snapshot.exists()) {
            setStatus("Produit introuvable.", true);
            window.setTimeout(function () { window.location.href = "products.html"; }, 1200);
            return;
        }

        const product = snapshot.data();
        if (pageTitle) pageTitle.textContent = "Modifier un produit";
        if (formTitle) formTitle.textContent = "Modification du produit";
        if (nameInput) nameInput.value = product.name || "";
        if (categoryInput) categoryInput.value = categoryKey(product.category);
        updateTypes(product.type);
        if (brandInput) brandInput.value = product.brand || "";
        if (priceInput) priceInput.value = product.price ?? "";
        if (stockInput) stockInput.value = product.stock ?? "";
        if (descriptionInput) descriptionInput.value = product.description || "";
        existingImage = product.image || "";
        showPreview(existingImage, "Image actuelle");
        setStatus("");
    } catch (error) {
        console.error("Erreur Firestore lors du chargement :", error);
        setStatus("Impossible de charger ce produit. Vérifiez votre connexion et vos autorisations.", true);
    }
}

async function submit(event) {
    event.preventDefault();
    if (!form || !form.reportValidity()) return;
    if (imageProcessing) {
        setStatus("Veuillez attendre la fin de la compression de l'image.", true);
        return;
    }

    const product = productValues();
    const validationError = validateProduct(product);
    if (validationError) {
        setStatus(validationError, true);
        return;
    }

    setSubmitting(true);
    setStatus("");
    try {
        if (editProductId) {
            if (editProductId.includes("/")) throw new Error("Identifiant de produit invalide.");
            await updateDoc(doc(db, "products", editProductId), {
                ...product,
                updatedAt: serverTimestamp()
            });
            setStatus("Produit modifié avec succès.");
        } else {
            await addDoc(collection(db, "products"), {
                ...product,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            setStatus("Produit ajouté avec succès.");
        }
        window.setTimeout(function () { window.location.href = "products.html"; }, 700);
    } catch (error) {
        console.error("Erreur Firestore lors de l'enregistrement :", error);
        setStatus("Impossible d'enregistrer le produit. Vérifiez votre connexion et les règles Firestore.", true);
        setSubmitting(false);
    }
}

function initialize() {
    createStatus();
    updateTypes();
    if (categoryInput) categoryInput.addEventListener("change", function () { updateTypes(); });
    if (imageInput) imageInput.addEventListener("change", handleImageChange);
    if (form) form.addEventListener("submit", submit);
    if (logoutButton) logoutButton.addEventListener("click", function () {
        sessionStorage.removeItem("kanaAdminLoggedIn");
        window.location.href = "login.html";
    });
    if (editProductId) loadForEdit();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
else initialize();
