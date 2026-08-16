/* =====================================================
   KANA ÉLECTROMÉNAGER
   CART
===================================================== */


/* =====================================================
   1. GET CART
===================================================== */

function getCart() {

    try {

        const savedCart =
            localStorage.getItem("kanaCart");

        if (!savedCart) {

            return [];

        }

        const cart =
            JSON.parse(savedCart);

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        console.error(
            "Erreur lors du chargement du panier :",
            error
        );

        return [];

    }

}


/* =====================================================
   2. SAVE CART
===================================================== */

function saveCart(cart) {

    localStorage.setItem(
        "kanaCart",
        JSON.stringify(cart)
    );

}


/* =====================================================
   3. FORMAT PRICE
===================================================== */

function formatPrice(price) {

    const number = Number(price);

    if (Number.isNaN(number)) {

        return "Prix sur demande";

    }

    return `${number.toLocaleString("fr-FR")} DA`;

}


/* =====================================================
   4. DISPLAY CART
===================================================== */

function displayCart() {

    const cartContainer =
        document.getElementById("cartContainer");

    const cartSummary =
        document.getElementById("cartSummary");

    const cart =
        getCart();


    if (!cart.length) {

        cartContainer.innerHTML = `

            <div class="empty-cart">

                <h2>
                    Votre panier est vide
                </h2>

                <p>
                    Vous n'avez encore ajouté aucun produit.
                </p>

                <a href="products.html">
                    VOIR LES PRODUITS
                </a>

            </div>

        `;

        cartSummary.innerHTML = "";

        return;

    }


    cartContainer.innerHTML = "";


    let total = 0;


    cart.forEach((product, index) => {

        const price =
            Number(product.price) || 0;

        const quantity =
            Number(product.quantity) || 1;

        const subtotal =
            price * quantity;

        total += subtotal;


        const item =
            document.createElement("div");

        item.className =
            "cart-item";


        item.innerHTML = `

            <div class="cart-product-image">

                <img
                    src="${product.image || ""}"
                    alt="${product.name || "Produit"}"
                >

            </div>


            <div class="cart-product-info">

                <h3>
                    ${product.name || "Produit"}
                </h3>

                <p>
                    ${formatPrice(price)}
                </p>


                <div class="cart-quantity">

                    <button
                        type="button"
                        onclick="changeQuantity(${index}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${quantity}
                    </span>

                    <button
                        type="button"
                        onclick="changeQuantity(${index}, 1)"
                    >
                        +
                    </button>

                </div>


                <strong>
                    Sous-total :
                    ${formatPrice(subtotal)}
                </strong>


                <button
                    type="button"
                    onclick="removeFromCart(${index})"
                >
                    SUPPRIMER
                </button>

            </div>

        `;


        cartContainer.appendChild(item);

    });


    cartSummary.innerHTML = `

        <div class="cart-total">

            <h2>
                TOTAL
            </h2>

            <strong>
                ${formatPrice(total)}
            </strong>

            <a href="checkout.html">
                PASSER LA COMMANDE
            </a>

        </div>

    `;

}


/* =====================================================
   5. CHANGE QUANTITY
===================================================== */

function changeQuantity(index, change) {

    const cart =
        getCart();


    if (!cart[index]) {

        return;

    }


    cart[index].quantity =
        (Number(cart[index].quantity) || 1)
        + change;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart(cart);

    displayCart();

}


/* =====================================================
   6. REMOVE PRODUCT
===================================================== */

function removeFromCart(index) {

    const cart =
        getCart();


    cart.splice(index, 1);

    saveCart(cart);

    displayCart();

}


/* =====================================================
   7. INITIALIZE
===================================================== */

displayCart();