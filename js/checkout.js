/* =====================================================
   KANA ÉLECTROMÉNAGER
   CHECKOUT
   Firebase Firestore
===================================================== */

import {
    db,
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc
} from "./firebase.js";

/* =====================================================
   1. GET PRODUCT ID
===================================================== */

const urlParams =
    new URLSearchParams(window.location.search);

const productId =
    urlParams.get("id");


/* =====================================================
   2. PAGE ELEMENTS
===================================================== */

const checkoutProduct =
    document.getElementById("checkoutProduct");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const checkoutForm =
    document.getElementById("checkoutForm");

const wilayaSelect =
    document.getElementById("wilaya");

const communeSelect =
    document.getElementById("commune");

const confirmOrder =
    document.getElementById("confirmOrder");


/* =====================================================
   3. WILAYAS
===================================================== */

const wilayas = {

    "01": {
        name: "Adrar",
        communes: [
            "Adrar",
            "Tamest",
            "Reggane",
            "In Zghmir",
            "Tit",
            "Tsabit",
            "Zaouiet Kounta"
        ]
    },

    "02": {
        name: "Chlef",
        communes: [
            "Chlef",
            "Ténès",
            "Boukadir",
            "Oued Fodda",
            "El Karimia",
            "Ouled Fares",
            "Abou El Hassan"
        ]
    },

    "03": {
        name: "Laghouat",
        communes: [
            "Laghouat",
            "Aflou",
            "Aïn Madhi",
            "El Assafia",
            "Hassi R'Mel",
            "Kheneg",
            "Tadjmout"
        ]
    },

    "04": {
        name: "Oum El Bouaghi",
        communes: [
            "Oum El Bouaghi",
            "Aïn Beïda",
            "Aïn M'lila",
            "Aïn Fakroun",
            "Aïn Kercha",
            "Sigus",
            "Meskiana"
        ]
    },

    "05": {
        name: "Batna",
        communes: [
            "Batna",
            "Barika",
            "Arris",
            "Merouana",
            "Aïn Touta",
            "Tazoult",
            "N'Gaous"
        ]
    },

    "06": {
        name: "Béjaïa",
        communes: [
            "Béjaïa",
            "Akbou",
            "Amizour",
            "El Kseur",
            "Seddouk",
            "Tichy",
            "Kherrata"
        ]
    },

    "07": {
        name: "Biskra",
        communes: [
            "Biskra",
            "Tolga",
            "El Kantara",
            "Sidi Okba",
            "Zeribet El Oued",
            "Ourlal",
            "Djemorah"
        ]
    },

    "08": {
        name: "Béchar",
        communes: [
            "Béchar",
            "Abadla",
            "Beni Ounif",
            "Kenadsa",
            "Taghit",
            "Igli"
        ]
    },

    "09": {
        name: "Blida",
        communes: [
            "Blida",
            "Boufarik",
            "Bougara",
            "El Affroun",
            "Mouzaïa",
            "Ouled Yaïch",
            "Chréa"
        ]
    },

    "10": {
        name: "Bouira",
        communes: [
            "Bouira",
            "Lakhdaria",
            "M'Chedallah",
            "Sour El Ghozlane",
            "Aïn Bessem",
            "Bechloul",
            "Bordj Okhriss"
        ]
    },

    "11": {
        name: "Tamanrasset",
        communes: [
            "Tamanrasset",
            "Abalessa",
            "Idlès",
            "Tazrouk",
            "In Ghar",
            "In Guezzam"
        ]
    },

    "12": {
        name: "Tébessa",
        communes: [
            "Tébessa",
            "Bir El Ater",
            "Cheria",
            "El Aouinet",
            "El Kouif",
            "Morsott",
            "Ouenza"
        ]
    },

    "13": {
        name: "Tlemcen",
        communes: [
            "Tlemcen",
            "Maghnia",
            "Nedroma",
            "Remchi",
            "Sebdou",
            "Ghazaouet",
            "Mansourah"
        ]
    },

    "14": {
        name: "Tiaret",
        communes: [
            "Tiaret",
            "Frenda",
            "Ksar Chellala",
            "Mahdia",
            "Sougueur",
            "Medroussa",
            "Rahouia"
        ]
    },

    "15": {
        name: "Tizi Ouzou",
        communes: [
            "Tizi Ouzou",
            "Azazga",
            "Draâ Ben Khedda",
            "Draâ El Mizan",
            "Boghni",
            "Ouaguenoun",
            "Aïn El Hammam",
            "Larbaâ Nath Irathen",
            "Tigzirt",
            "Bouzeguène",
            "Makouda",
            "Mekla"
        ]
    },

    "16": {
        name: "Alger",
        communes: [
            "Alger-Centre",
            "Bab El Oued",
            "Birkhadem",
            "Bir Mourad Raïs",
            "Bordj El Kiffan",
            "Dar El Beïda",
            "Draria",
            "El Harrach",
            "Hussein Dey",
            "Kouba",
            "Mohammadia",
            "Rouiba",
            "Zeralda"
        ]
    },

    "17": {
        name: "Djelfa",
        communes: [
            "Djelfa",
            "Aïn Oussera",
            "Hassi Bahbah",
            "Messaad",
            "Birine",
            "Charef"
        ]
    },

    "18": {
        name: "Jijel",
        communes: [
            "Jijel",
            "Taher",
            "El Milia",
            "Chekfa",
            "Sidi Maarouf",
            "Ziama Mansouriah"
        ]
    },

    "19": {
        name: "Sétif",
        communes: [
            "Sétif",
            "El Eulma",
            "Aïn Oulmene",
            "Aïn Arnat",
            "Bougaa",
            "Aïn Azel",
            "Djemila"
        ]
    },

    "20": {
        name: "Saïda",
        communes: [
            "Saïda",
            "Aïn El Hadjar",
            "Youb",
            "Hassasna",
            "Sidi Boubekeur"
        ]
    },

    "21": {
        name: "Skikda",
        communes: [
            "Skikda",
            "Azzaba",
            "Collo",
            "El Harrouch",
            "Ramdane Djamel",
            "Tamalous",
            "Ben Azzouz"
        ]
    },

    "22": {
        name: "Sidi Bel Abbès",
        communes: [
            "Sidi Bel Abbès",
            "Aïn El Berd",
            "Ben Badis",
            "Sfisef",
            "Telagh",
            "Tessala"
        ]
    },

    "23": {
        name: "Annaba",
        communes: [
            "Annaba",
            "El Bouni",
            "El Hadjar",
            "Berrahal",
            "Chetaïbi",
            "Seraïdi"
        ]
    },

    "24": {
        name: "Guelma",
        communes: [
            "Guelma",
            "Bouchegouf",
            "Héliopolis",
            "Oued Zenati",
            "Hammam Debagh",
            "Aïn Makhlouf"
        ]
    },

    "25": {
        name: "Constantine",
        communes: [
            "Constantine",
            "El Khroub",
            "Hamma Bouziane",
            "Aïn Smara",
            "Didouche Mourad",
            "Zighoud Youcef"
        ]
    },

    "26": {
        name: "Médéa",
        communes: [
            "Médéa",
            "Berrouaghia",
            "Ksar El Boukhari",
            "Tablat",
            "Béni Slimane",
            "Seghouane"
        ]
    },

    "27": {
        name: "Mostaganem",
        communes: [
            "Mostaganem",
            "Aïn Tédelès",
            "Hassi Mameche",
            "Mazagran",
            "Mesra",
            "Sidi Ali"
        ]
    },

    "28": {
        name: "M'Sila",
        communes: [
            "M'Sila",
            "Bou Saâda",
            "Sidi Aïssa",
            "Magra",
            "Aïn El Hadjel",
            "Hammam Dalaa"
        ]
    },

    "29": {
        name: "Mascara",
        communes: [
            "Mascara",
            "Bou Hanifia",
            "Ghriss",
            "Mohammadia",
            "Sig",
            "Tighennif"
        ]
    },

    "30": {
        name: "Ouargla",
        communes: [
            "Ouargla",
            "Hassi Messaoud",
            "Touggourt",
            "N'Goussa",
            "Hassi Ben Abdellah",
            "El Hadjira"
        ]
    },

    "31": {
        name: "Oran",
        communes: [
            "Oran",
            "Bir El Djir",
            "Es Senia",
            "Arzew",
            "Aïn El Turk",
            "Bethioua",
            "Mers El Kébir"
        ]
    },

    "32": {
        name: "El Bayadh",
        communes: [
            "El Bayadh",
            "Brezina",
            "Boualem",
            "Rogassa",
            "El Abiodh Sidi Cheikh"
        ]
    },

    "33": {
        name: "Illizi",
        communes: [
            "Illizi",
            "Djanet",
            "In Amenas",
            "Bordj Omar Driss"
        ]
    },

    "34": {
        name: "Bordj Bou Arréridj",
        communes: [
            "Bordj Bou Arréridj",
            "Bordj Ghedir",
            "Ras El Oued",
            "El Achir",
            "Mansoura"
        ]
    },

    "35": {
        name: "Boumerdès",
        communes: [
            "Boumerdès",
            "Bordj Menaïel",
            "Dellys",
            "Khemis El Khechna",
            "Thénia",
            "Boudouaou",
            "Isser",
            "Naciria"
        ]
    },

    "36": {
        name: "El Tarf",
        communes: [
            "El Tarf",
            "El Kala",
            "Ben M'Hidi",
            "Dréan",
            "Echatt",
            "Besbes"
        ]
    },

    "37": {
        name: "Tindouf",
        communes: [
            "Tindouf",
            "Oum El Assel"
        ]
    },

    "38": {
        name: "Tissemsilt",
        communes: [
            "Tissemsilt",
            "Bordj Bounaama",
            "Theniet El Had",
            "Lardjem",
            "Khemisti"
        ]
    },

    "39": {
        name: "El Oued",
        communes: [
            "El Oued",
            "Guemar",
            "Robbah",
            "Debila",
            "El Ogla",
            "Hassi Khalifa"
        ]
    },

    "40": {
        name: "Khenchela",
        communes: [
            "Khenchela",
            "Kais",
            "Chechar",
            "Babar",
            "El Hamma",
            "Ouled Rechache"
        ]
    },

    "41": {
        name: "Souk Ahras",
        communes: [
            "Souk Ahras",
            "Sedrata",
            "M'daourouch",
            "Taoura",
            "Oum El Adhaim"
        ]
    },

    "42": {
        name: "Tipaza",
        communes: [
            "Tipaza",
            "Cherchell",
            "Koléa",
            "Hadjout",
            "Bou Ismaïl",
            "Fouka",
            "Ahmer El Aïn"
        ]
    },

    "43": {
        name: "Mila",
        communes: [
            "Mila",
            "Ferdjioua",
            "Chelghoum Laïd",
            "Grarem Gouga",
            "Tadjenanet",
            "Oued Athmania"
        ]
    },

    "44": {
        name: "Aïn Defla",
        communes: [
            "Aïn Defla",
            "Khemis Miliana",
            "El Attaf",
            "Miliana",
            "Djendel",
            "Boumedfaâ"
        ]
    },

    "45": {
        name: "Naâma",
        communes: [
            "Naâma",
            "Mécheria",
            "Aïn Sefra",
            "Moghrar",
            "Sfissifa"
        ]
    },

    "46": {
        name: "Aïn Témouchent",
        communes: [
            "Aïn Témouchent",
            "Beni Saf",
            "El Malah",
            "Hammam Bou Hadjar",
            "El Amria"
        ]
    },

    "47": {
        name: "Ghardaïa",
        communes: [
            "Ghardaïa",
            "Berriane",
            "El Guerrara",
            "Metlili",
            "Bounoura",
            "Daya Ben Dahoua"
        ]
    },

    "48": {
        name: "Relizane",
        communes: [
            "Relizane",
            "Mazouna",
            "Mendes",
            "Oued Rhiou",
            "Yellel",
            "Zemmoura"
        ]
    },

    "49": {
        name: "Timimoun",
        communes: [
            "Timimoun",
            "Charouine",
            "Ouled Saïd",
            "Tinerkouk",
            "Aougrout"
        ]
    },

    "50": {
        name: "Bordj Badji Mokhtar",
        communes: [
            "Bordj Badji Mokhtar",
            "Timiaouine"
        ]
    },

    "51": {
        name: "Ouled Djellal",
        communes: [
            "Ouled Djellal",
            "Sidi Khaled",
            "Ras El Miad",
            "Besbes"
        ]
    },

    "52": {
        name: "Béni Abbès",
        communes: [
            "Béni Abbès",
            "El Ouata",
            "Kerzaz",
            "Ksabi",
            "Igli"
        ]
    },

    "53": {
        name: "In Salah",
        communes: [
            "In Salah",
            "Foggaret Ezzoua",
            "In Ghar"
        ]
    },

    "54": {
        name: "In Guezzam",
        communes: [
            "In Guezzam",
            "Tin Zaouatine"
        ]
    },

    "55": {
        name: "Touggourt",
        communes: [
            "Touggourt",
            "Nezla",
            "Tebesbest",
            "Zaouia El Abidia",
            "Temacine"
        ]
    },

    "56": {
        name: "Djanet",
        communes: [
            "Djanet",
            "Bordj El Haouas"
        ]
    },

    "57": {
        name: "El Meghaier",
        communes: [
            "El Meghaier",
            "Djamaa",
            "Oum Touyour",
            "Sidi Amrane"
        ]
    },

    "58": {
        name: "El Meniaa",
        communes: [
            "El Meniaa",
            "Hassi Gara",
            "Hassi Fehal"
        ]
    },

    "59": {
        name: "Aflou",
        communes: [
            "Aflou",
            "Aïn Sidi Ali",
            "Sebgag",
            "Oued Morra"
        ]
    },

    "60": {
        name: "Brézina",
        communes: [
            "Brézina",
            "Ghassoul",
            "Krakda"
        ]
    },

    "61": {
        name: "Bir El Ater",
        communes: [
            "Bir El Ater",
            "El Ogla El Malha",
            "El Kouif"
        ]
    },

    "62": {
        name: "Ksar Chellala",
        communes: [
            "Ksar Chellala",
            "Serghine",
            "Zmalet El Emir Abdelkader"
        ]
    },

    "63": {
        name: "Aïn Oussera",
        communes: [
            "Aïn Oussera",
            "Guernini",
            "Benhar"
        ]
    },

    "64": {
        name: "El Aricha",
        communes: [
            "El Aricha",
            "Bouihi",
            "Sidi Djillali"
        ]
    },

    "65": {
        name: "El Abiodh Sidi Cheikh",
        communes: [
            "El Abiodh Sidi Cheikh",
            "Arbaouat",
            "Brezina"
        ]
    },

    "66": {
        name: "El Hadjira",
        communes: [
            "El Hadjira",
            "El Alia",
            "Hassi Ben Abdellah"
        ]
    },

    "67": {
        name: "Bir Mourad Raïs",
        communes: [
            "Bir Mourad Raïs",
            "Birkhadem",
            "Dely Ibrahim",
            "Draria"
        ]
    },

    "68": {
        name: "Bordj El Kiffan",
        communes: [
            "Bordj El Kiffan",
            "Dar El Beïda",
            "Bab Ezzouar",
            "Mohammadia"
        ]
    },

    "69": {
        name: "El Harrach",
        communes: [
            "El Harrach",
            "Oued Smar",
            "Bourouba",
            "Baraki"
        ]
    }

};



/* =====================================================
   4. GET PRODUCT FROM FIRESTORE
===================================================== */

async function getProduct() {

    if (!productId) {
        return null;
    }

    try {

        const productRef =
            doc(
                db,
                "products",
                productId
            );

        const snapshot =
            await getDoc(productRef);

        if (!snapshot.exists()) {

            console.error(
                "Produit introuvable dans Firestore :",
                productId
            );

            return null;
        }

        return {
            id: snapshot.id,
            ...snapshot.data()
        };

    } catch (error) {

        console.error(
            "Erreur lors de la récupération du produit Firestore :",
            error
        );

        return null;
    }
}

/* =====================================================
   6. FORMAT PRICE
===================================================== */

function formatPrice(price) {

    const number =
        Number(price);

    if (Number.isNaN(number)) {
        return "Prix sur demande";
    }

    return `${number.toLocaleString("fr-FR")} DA`;
}


/* =====================================================
   7. DISPLAY PRODUCT
===================================================== */

function displayCheckoutProduct(product) {

    if (!checkoutProduct) {
        return;
    }

    if (!product) {

        checkoutProduct.innerHTML = `
            <div class="checkout-error">
                Le produit demandé
                n'existe pas ou n'est plus disponible.
            </div>
        `;

        if (checkoutTotal) {
            checkoutTotal.innerHTML = "";
        }

        if (confirmOrder) {
            confirmOrder.disabled = true;
        }

        return;
    }

    checkoutProduct.innerHTML = `

        <div class="checkout-product-card">

            <div class="checkout-product-image">

                <img
                    src="${product.image || ""}"
                    alt="${product.name || "Produit"}"
                >

            </div>

            <div class="checkout-product-info">

                <span class="product-brand">
                    ${product.brand || "KANA"}
                </span>

                <h3>
                    ${product.name || "Produit"}
                </h3>

                <span class="product-price">
                    ${formatPrice(product.price)}
                </span>

            </div>

        </div>

    `;

    if (checkoutTotal) {

        checkoutTotal.innerHTML = `

            <div class="checkout-total-content">

                <span class="checkout-total-label">
                    TOTAL
                </span>

                <strong class="checkout-total-price">
                    ${formatPrice(product.price)}
                </strong>

            </div>

        `;
    }

    document.title =
        `Commander | ${product.name || "KANA"}`;
}


/* =====================================================
   8. LOAD WILAYAS
===================================================== */

function loadWilayas() {

    if (!wilayaSelect) {
        return;
    }

    /*
       IMPORTANT:
       Clear the select first.
       This prevents duplicate options.
    */

    wilayaSelect.innerHTML = `
        <option value="">
            Choisir une wilaya
        </option>
    `;


    /*
       Object.keys() is explicitly sorted numerically.
       Therefore:
       01
       02
       03
       ...
       69
    */

    const codes =
        Object.keys(wilayas).sort(
            (a, b) =>
                Number(a) - Number(b)
        );


    codes.forEach(code => {

        const option =
            document.createElement("option");

        option.value =
            code;

        option.textContent =
            `${code} - ${wilayas[code].name}`;

        wilayaSelect.appendChild(option);

    });

}


/* =====================================================
   9. LOAD COMMUNES
===================================================== */

function loadCommunes(wilayaCode) {

    if (!communeSelect) {
        return;
    }

    communeSelect.innerHTML = `
        <option value="">
            Choisir une commune
        </option>
    `;

    communeSelect.disabled = true;


    if (
        !wilayaCode ||
        !wilayas[wilayaCode]
    ) {
        return;
    }


    const communes =
        wilayas[wilayaCode].communes;


    communes.forEach(commune => {

        const option =
            document.createElement("option");

        option.value =
            commune;

        option.textContent =
            commune;

        communeSelect.appendChild(option);

    });


    communeSelect.disabled = false;

}


/* =====================================================
   10. WILAYA CHANGE
===================================================== */

if (wilayaSelect) {

    wilayaSelect.addEventListener(
        "change",
        event => {

            loadCommunes(
                event.target.value
            );

        }
    );

}


/* =====================================================
   11. VALIDATE PHONE
===================================================== */

function isValidPhone(phone) {

    /*
       Accept:
       05 XX XX XX XX
       06 XX XX XX XX
       07 XX XX XX XX

       Spaces are optional.
    */

    const cleaned =
        phone.replace(/\s+/g, "");

    return /^0[567]\d{8}$/.test(
        cleaned
    );

}


/* =====================================================
   12. CREATE FIREBASE ORDER
===================================================== */

async function createOrder(product) {

    const customerName =
        document
            .getElementById("customerName")
            ?.value
            .trim();


    const customerPhone =
        document
            .getElementById("customerPhone")
            ?.value
            .trim();


    const wilayaCode =
        wilayaSelect?.value || "";


    const commune =
        communeSelect?.value || "";


    const address =
        document
            .getElementById("address")
            ?.value
            .trim();


    const notes =
        document
            .getElementById("notes")
            ?.value
            .trim();


    /* -------------------------------------------------
       VALIDATION
    ------------------------------------------------- */

    if (
        !customerName ||
        !customerPhone ||
        !wilayaCode ||
        !commune ||
        !address
    ) {

        alert(
            "Veuillez remplir tous les champs obligatoires."
        );

        return;

    }


    if (!isValidPhone(customerPhone)) {

        alert(
            "Veuillez entrer un numéro de téléphone algérien valide."
        );

        return;

    }


    /* -------------------------------------------------
       ORDER OBJECT
    ------------------------------------------------- */

    const order = {

        orderId:
            "KANA-" + Date.now(),

        product: {

            id:
                String(product.id),

            name:
                product.name || "",

            brand:
                product.brand || "KANA",

            image:
                product.image || "",

            price:
                Number(product.price) || 0

        },

        customer: {

            name:
                customerName,

            phone:
                customerPhone,

            wilayaCode:
                wilayaCode,

            wilaya:
                wilayas[wilayaCode].name,

            commune:
                commune,

            address:
                address,

            notes:
                notes || ""

        },

        status:
            "Nouvelle",

        paymentMethod:
            "Paiement à la livraison",

        createdAt:
            serverTimestamp()

    };


    /* -------------------------------------------------
       SEND TO FIRESTORE
    ------------------------------------------------- */

    try {

        if (confirmOrder) {

            confirmOrder.disabled = true;

            confirmOrder.textContent =
                "ENREGISTREMENT...";
        }


        console.log(
            "Envoi de la commande vers Firebase...",
            order
        );


        const orderRef =
            await addDoc(
                collection(
                    db,
                    "orders"
                ),
                order
            );


        console.log(
            "Commande Firebase créée :",
            orderRef.id
        );


        alert(
            "Votre commande a été enregistrée avec succès."
        );


        /*
           Redirect after successful Firebase save.
        */

        window.location.href =
            "index.html";


    } catch (error) {

        console.error(
            "ERREUR FIREBASE COMMANDE :",
            error
        );


        alert(
            "Impossible d'enregistrer la commande. Vérifiez votre connexion et réessayez."
        );


        if (confirmOrder) {

            confirmOrder.disabled = false;

            confirmOrder.textContent =
                "CONFIRMER LA COMMANDE";

        }

    }

}


/* =====================================================
   13. FORM SUBMIT
===================================================== */

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const product =
                await getProduct();

            if (!product) {

                alert(
                    "Le produit est introuvable."
                );

                return;
            }

            await createOrder(product);

        }
    );

}

/* =====================================================
   14. INITIALIZE
===================================================== */

async function initCheckout() {

    console.log(
        "KANA Checkout initialisation..."
    );

    const product =
        await getProduct();

    displayCheckoutProduct(
        product
    );

    loadWilayas();

    if (communeSelect) {

        communeSelect.disabled = true;

    }

    console.log(
        "Checkout prêt."
    );

}

initCheckout();