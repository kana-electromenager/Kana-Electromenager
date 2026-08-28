/* KANA public catalogue — Firestore is the only product source. */
import { db, collection, getDocs } from "./firebase.js";

const params = new URLSearchParams(window.location.search);
const requestedCategory = params.get("category");
const requestedType = params.get("type");
const container = document.getElementById("productsContainer");
const emptyState = document.getElementById("emptyProducts");
const count = document.getElementById("productsCount");
const sortSelect = document.getElementById("sortProducts");

const categoryInfo = {
    "maison-entretien": ["MAISON & ENTRETIEN", "Maison & Entretien", "Découvrez notre sélection de produits pour la maison et l'entretien."],
    "refrigerateurs-congelateurs": ["RÉFRIGÉRATEURS - CONGÉLATEURS", "Réfrigérateurs - Congélateurs", "Découvrez notre sélection de réfrigérateurs et de congélateurs."],
    televisions: ["TÉLÉVISIONS", "Télévisions", "Découvrez notre sélection de télévisions et Smart TV."],
    "machines-a-laver": ["MACHINES À LAVER", "Machines à laver", "Découvrez notre sélection de machines à laver."],
    "lave-vaisselle": ["LAVE-VAISSELLE", "Lave-vaisselle", "Découvrez notre sélection de lave-vaisselle."],
    cuisine: ["CUISINE", "Cuisine", "Découvrez notre sélection d'appareils pour la cuisine."]
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

const typeNames = {
    aspirateurs: "Aspirateurs", ventilateurs: "Ventilateurs", climatisation: "Climatisation",
    chauffages: "Chauffages", "chauffe-eau": "Chauffe-eau", refrigerateurs: "Réfrigérateurs",
    congelateurs: "Congélateurs", televisions: "Télévisions", "machines-a-laver": "Machines à laver",
    "lave-vaisselle": "Lave-vaisselle", "machines-a-cafe": "Machines à café", "air-fryer": "Air Fryer",
    "blender-hachoir-mixeur-batteur": "Hachoir - Mixeur - Batteur - Blender",
    "micro-ondes": "Micro-ondes", fours: "Fours", cuisinieres: "Cuisinières", petran: "Petran"
};

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

function setPageInformation() {
    const info = categoryInfo[categoryKey(requestedCategory)] ||
        ["KANA ÉLECTROMÉNAGER", "Nos produits", "Découvrez notre sélection de produits."];
    const type = typeNames[typeKey(requestedType)] || "Produits";
    const setText = function (id, text) {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    };
    setText("productsCategoryLabel", info[0]);
    setText("productsCategoryTitle", info[1]);
    setText("productsCategoryDescription", info[2]);
    setText("productsTitle", requestedType ? type : info[1]);
    document.title = info[1] + " | KANA";
}

function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function productPrice(product) {
    const wrapper = element("div", "product-price");
    const amount = element("strong");
    const price = Number(product.price);
    if (product.price === "" || product.price === null || product.price === undefined || !Number.isFinite(price)) {
        amount.textContent = "Prix sur demande";
        wrapper.appendChild(amount);
    } else {
        amount.textContent = price.toLocaleString("fr-FR");
        wrapper.append(amount, element("span", "", "DA"));
    }
    return wrapper;
}

function productCard(product) {
    const card = element("article", "product-card");
    const link = document.createElement("a");
    link.href = "product.html?id=" + encodeURIComponent(product.id);
    const imageBox = element("div", "product-image-container");

    if (product.image) {
        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name || "Produit";
        image.loading = "lazy";
        image.onerror = function () {
            imageBox.classList.add("no-image");
            imageBox.replaceChildren(element("span", "", "Image indisponible"));
        };
        imageBox.appendChild(image);
    } else {
        imageBox.classList.add("no-image");
        imageBox.appendChild(element("span", "", "Pas d'image"));
    }

    const info = element("div", "product-info");
    info.appendChild(element("h3", "product-name", product.name || "Produit"));
    if (product.brand) info.appendChild(element("span", "product-brand", product.brand));
    info.appendChild(productPrice(product));
    info.appendChild(element("div", "product-button", "VOIR LE PRODUIT"));
    link.append(imageBox, info);
    card.appendChild(link);
    return card;
}

function display(products, message) {
    if (!container) return;
    container.replaceChildren();

    if (!products.length) {
        container.style.display = "none";
        if (emptyState) emptyState.hidden = false;
        if (count) count.textContent = message || "Aucun produit disponible.";
        return;
    }

    container.style.display = "";
    if (emptyState) emptyState.hidden = true;
    if (count) count.textContent = products.length + (products.length > 1 ? " produits" : " produit");
    products.forEach(function (product) { container.appendChild(productCard(product)); });
}

function sortProducts(products) {
    const result = products.slice();
    const price = function (item) {
        const value = Number(item.price);
        return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
    };

    if (sortSelect && sortSelect.value === "price-asc") result.sort(function (a, b) { return price(a) - price(b); });
    if (sortSelect && sortSelect.value === "price-desc") result.sort(function (a, b) { return price(b) - price(a); });
    if (sortSelect && sortSelect.value === "name") {
        result.sort(function (a, b) { return String(a.name || "").localeCompare(String(b.name || ""), "fr"); });
    }
    return result;
}

async function loadCatalogue() {
    const snapshot = await getDocs(collection(db, "products"));
    return snapshot.docs.map(function (item) { return { id: item.id, ...item.data() }; });
}

async function initialize() {
    setPageInformation();
    if (container) container.replaceChildren(element("p", "products-loading", "Chargement des produits..."));

    try {
        const category = categoryKey(requestedCategory);
        const type = typeKey(requestedType);
        const filtered = (await loadCatalogue()).filter(function (product) {
            return (!category || categoryKey(product.category) === category) &&
                (!type || typeKey(product.type) === type);
        });
        const render = function () { display(sortProducts(filtered)); };
        if (sortSelect) sortSelect.addEventListener("change", render);
        render();
    } catch (error) {
        console.error("Erreur Firestore lors du chargement des produits :", error);
        display([], "Impossible de charger les produits.");
    }
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
else initialize();
