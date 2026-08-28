/* KANA product detail — reads the Firestore document named in ?id=. */
import { db, doc, getDoc } from "./firebase.js";

const productId = new URLSearchParams(window.location.search).get("id");
const image = document.getElementById("productImage");
const brand = document.getElementById("productBrand");
const name = document.getElementById("productName");
const description = document.getElementById("productDescription");
const price = document.getElementById("productPrice");
const availability = document.getElementById("productAvailability");
const breadcrumb = document.getElementById("breadcrumbProduct");
const whatsapp = document.getElementById("whatsappProduct");
const order = document.getElementById("orderProduct");
const addToCart = document.getElementById("addToCartProduct");
const installmentButtons = document.querySelectorAll(".installment-options button");
const installmentPrice = document.getElementById("installmentPrice");

async function loadProduct() {
    if (!productId || productId.includes("/")) return null;
    const snapshot = await getDoc(doc(db, "products", productId));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
}

function formatPrice(value) {
    const number = Number(value);
    if (value === "" || value === null || value === undefined || !Number.isFinite(number)) {
        return "Prix sur demande";
    }
    return number.toLocaleString("fr-FR") + " DA";
}

function getAvailability(product) {
    if (product.availability === "Disponible" || product.availability === "Indisponible") {
        return product.availability;
    }
    return Number(product.stock) > 0 ? "Disponible" : "Indisponible";
}

function configureInstallments(product) {
    const amount = Number(product.price);
    const enabled = Number.isFinite(amount) && amount > 0;
    if (installmentPrice) installmentPrice.textContent = "—";

    installmentButtons.forEach(function (button) {
        button.disabled = !enabled;
        button.classList.remove("active");
        button.onclick = null;
        if (!enabled) return;

        button.onclick = function () {
            const months = Number(button.dataset.months);
            if (!Number.isFinite(months) || months <= 0) return;
            installmentButtons.forEach(function (item) { item.classList.remove("active"); });
            button.classList.add("active");
            if (installmentPrice) {
                installmentPrice.textContent =
                    (amount / months).toLocaleString("fr-FR", { maximumFractionDigits: 0 }) +
                    " DA / mois";
            }
        };
    });
}

function addProductToCart(product) {
    let cart = [];
    try {
        const saved = localStorage.getItem("kanaCart");
        const parsed = saved ? JSON.parse(saved) : [];
        if (Array.isArray(parsed)) cart = parsed;
    } catch (error) {
        console.error("Erreur de lecture du panier :", error);
    }

    const existing = cart.find(function (item) { return String(item.id) === String(product.id); });
    if (existing) {
        existing.quantity = Number(existing.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name || "Produit",
            price: product.price ?? 0,
            image: product.image || "",
            brand: product.brand || "KANA",
            category: product.category || "",
            type: product.type || "",
            quantity: 1
        });
    }
    localStorage.setItem("kanaCart", JSON.stringify(cart));
}

function configureActions(product) {
    if (whatsapp) {
        const message = "Bonjour, je suis intéressé(e) par le produit : " + (product.name || "");
        whatsapp.href = "https://wa.me/213799846032?text=" + encodeURIComponent(message);
    }
    if (order) order.href = "checkout.html?id=" + encodeURIComponent(product.id);
    if (addToCart) {
        addToCart.onclick = function () {
            try {
                addProductToCart(product);
                const original = addToCart.dataset.originalText || addToCart.textContent;
                addToCart.dataset.originalText = original;
                addToCart.textContent = "AJOUTÉ AU PANIER ✓";
                window.setTimeout(function () { addToCart.textContent = original; }, 1500);
            } catch (error) {
                console.error("Erreur d'enregistrement du panier :", error);
            }
        };
    }
}

function showNotFound() {
    if (image) image.style.display = "none";
    if (brand) brand.textContent = "KANA";
    if (name) name.textContent = "Produit introuvable";
    if (description) description.textContent = "Ce produit n'existe pas ou n'est plus disponible.";
    if (price) price.textContent = "";
    if (availability) availability.textContent = "Indisponible";
    if (breadcrumb) breadcrumb.textContent = "PRODUIT";
    if (installmentPrice) installmentPrice.textContent = "—";
    installmentButtons.forEach(function (button) {
        button.disabled = true;
        button.classList.remove("active");
    });
    [whatsapp, order, addToCart].forEach(function (element) {
        if (element) element.style.display = "none";
    });
}

function displayProduct(product) {
    if (!product) {
        showNotFound();
        return;
    }

    if (image) {
        image.alt = product.name || "Produit";
        if (product.image) {
            image.src = product.image;
            image.style.display = "block";
            image.onerror = function () { image.style.display = "none"; };
        } else {
            image.removeAttribute("src");
            image.style.display = "none";
        }
    }
    if (brand) brand.textContent = product.brand || "KANA";
    if (name) name.textContent = product.name || "Produit";
    if (description) description.textContent = product.description || "Découvrez notre produit.";
    if (price) price.textContent = formatPrice(product.price);
    if (availability) availability.textContent = getAvailability(product);
    if (breadcrumb) breadcrumb.textContent = product.name || "PRODUIT";

    document.title = (product.name || "Produit") + " | KANA";
    configureInstallments(product);
    configureActions(product);
}

async function initialize() {
    try {
        displayProduct(await loadProduct());
    } catch (error) {
        console.error("Erreur Firestore lors du chargement du produit :", error);
        showNotFound();
    }
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
else initialize();
