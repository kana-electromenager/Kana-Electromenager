/* =====================================================
   KANA ÉLECTROMÉNAGER
   HOME.JS
===================================================== */


/* =====================================================
   HERO SLIDER
===================================================== */

const heroSlides = [

    {
        image: "images/hero/hero-1.jpg",


        title: "L'électroménager, élevé au rang d'art.",

        text: "Des pièces d'exception, une livraison irréprochable et un service à la hauteur de votre intérieur..",

        features: "QUALITÉ • PERFORMANCE • DESIGN",

        button: "DÉCOUVRIR"
    },


    {
        image: "images/hero/hero-2.jpg",



        title: "L'image cinéma, chez vous.",

        text: "OLED, QLED, Neo QLED — les plus grandes marques signées Kana..",

        features: "STYLE • PERFORMANCE",

        button: "DÉCOUVRIR"
    },


    {
        image: "images/hero/hero-3.jpg",


        title: "Fraîcheur signature, silence maîtrisé..",

        text: "Réfrigérateurs multi-portes, side-by-side et French Door..",

        features: "TECHNOLOGIE • EFFICACITÉ • CONFORT",

        button: "DÉCOUVRIR"
    },


    {
        image: "images/hero/hero-4.jpg",

        title: "L'art culinaire, réinventé..",

        text: "Robots, machines à café et équipements d'exception pour sublimer votre cuisine..",

        features: "STYLE • PERFORMANCE.",

        button: "DÉCOUVRIR"
    }

];



/* =====================================================
   HERO ELEMENTS
===================================================== */

const heroImage = document.getElementById("heroImage");

const heroLabel = document.getElementById("heroLabel");

const heroTitle = document.getElementById("heroTitle");

const heroText = document.getElementById("heroText");

const heroFeatures = document.getElementById("heroFeatures");

const heroButton = document.getElementById("heroButton");

const prevSlideButton = document.getElementById("prevSlide");

const nextSlideButton = document.getElementById("nextSlide");

const sliderDots = document.getElementById("sliderDots");



/* =====================================================
   CURRENT SLIDE
===================================================== */

let currentSlide = 0;

let autoSlide;



/* =====================================================
   DISPLAY SLIDE
===================================================== */

function showSlide(index) {

    if (!heroSlides.length) {
        return;
    }


    /*
        Revenir au premier slide
        si on dépasse la fin.
    */

    if (index >= heroSlides.length) {

        currentSlide = 0;

    }

    /*
        Aller au dernier slide
        si on revient avant le premier.
    */

    else if (index < 0) {

        currentSlide = heroSlides.length - 1;

    }

    else {

        currentSlide = index;

    }


    const slide = heroSlides[currentSlide];



    /* =================================================
       IMAGE
    ================================================= */

    heroImage.style.opacity = "0";


    setTimeout(() => {

        heroImage.src = slide.image;

        heroImage.alt = slide.title;

        heroImage.style.opacity = "1";

    }, 250);



    /* =================================================
       TEXT
    ================================================= */

    heroLabel.textContent = slide.label;

    heroTitle.textContent = slide.title;

    heroText.textContent = slide.text;

    heroFeatures.textContent = slide.features;

    heroButton.textContent = slide.button;



    /* =================================================
       BUTTON LINK
    ================================================= */

    heroButton.href = "#categories";



    /* =================================================
       DOTS
    ================================================= */

    updateDots();

}



/* =====================================================
   NEXT SLIDE
===================================================== */

function nextSlide() {

    showSlide(currentSlide + 1);

    restartAutoSlide();

}



/* =====================================================
   PREVIOUS SLIDE
===================================================== */

function previousSlide() {

    showSlide(currentSlide - 1);

    restartAutoSlide();

}



/* =====================================================
   SLIDER DOTS
===================================================== */

function createDots() {

    sliderDots.innerHTML = "";


    heroSlides.forEach((slide, index) => {

        const dot = document.createElement("button");

        dot.classList.add("slider-dot");

        dot.type = "button";

        dot.setAttribute(
            "aria-label",
            `Aller au slide ${index + 1}`
        );


        dot.addEventListener("click", () => {

            showSlide(index);

            restartAutoSlide();

        });


        sliderDots.appendChild(dot);

    });


    updateDots();

}



/* =====================================================
   UPDATE DOTS
===================================================== */

function updateDots() {

    const dots =
        sliderDots.querySelectorAll(".slider-dot");


    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === currentSlide
        );

    });

}



/* =====================================================
   AUTO SLIDER
===================================================== */

function startAutoSlide() {

    autoSlide = setInterval(() => {

        showSlide(currentSlide + 1);

    }, 5000);

}



/* =====================================================
   RESTART AUTO SLIDER
===================================================== */

function restartAutoSlide() {

    clearInterval(autoSlide);

    startAutoSlide();

}



/* =====================================================
   ARROWS
===================================================== */

if (nextSlideButton) {

    nextSlideButton.addEventListener(
        "click",
        nextSlide
    );

}


if (prevSlideButton) {

    prevSlideButton.addEventListener(
        "click",
        previousSlide
    );

}



/* =====================================================
   PAUSE SLIDER WHEN MOUSE IS OVER IT
===================================================== */

const hero = document.querySelector(".hero");


if (hero) {

    hero.addEventListener("mouseenter", () => {

        clearInterval(autoSlide);

    });


    hero.addEventListener("mouseleave", () => {

        startAutoSlide();

    });

}



/* =====================================================
   CATEGORIES
===================================================== */

const categories = [

    {
        name: "Maison & Entretien",

        image: "images/categories/maison-entretien.jpg",

        description:
            "Des appareils pour faciliter votre quotidien.",

        link: "category.html?category=maison-entretien"
    },


    {
        name: "Cuisine",

        image: "images/categories/cuisine.jpg",

        description:
            "Tout pour une cuisine pratique et moderne.",

        link: "category.html?category=cuisine"
    },


    {
        name: "Réfrigérateur - Congélateur",

        image:
            "images/categories/refrigerateur-congelateur.jpg",

        description:
            "Conservation, fraîcheur et performance.",

        link:
            "category.html?category=refrigerateur-congelateur"
    },


    {
        name: "Télévisions",

        image:
            "images/categories/televisions.jpg",

        description:
            "Une expérience audiovisuelle nouvelle génération.",

        link:
            "category.html?category=televisions"
    },


    {
        name: "Machines à laver",

        image:
            "images/categories/machines-a-laver.jpg",

        description:
            "Des solutions efficaces pour votre linge.",

        link:
            "category.html?category=machines-a-laver"
    },


    {
        name: "Lave-vaisselle",

        image:
            "images/categories/lave-vaisselle.jpg",

        description:
            "Plus de confort et moins de contraintes.",

        link:
            "category.html?category=lave-vaisselle"
    }

];



/* =====================================================
   CATEGORIES CONTAINER
===================================================== */

const categoriesContainer =
    document.getElementById(
        "categoriesContainer"
    );



/* =====================================================
   DISPLAY CATEGORIES
===================================================== */

function displayCategories() {

    if (!categoriesContainer) {
        return;
    }


    categoriesContainer.innerHTML = "";


    categories.forEach((category, index) => {

        const card =
            document.createElement("a");


        card.className = "category-card";

        card.href = category.link;


        card.innerHTML = `

            <img
                src="${category.image}"
                alt="${category.name}"
                loading="lazy"
            >

            <div class="category-content">

                <span class="category-number">
                    0${index + 1}
                </span>

                <h3>
                    ${category.name}
                </h3>

                <p>
                    ${category.description}
                </p>

            </div>

            <span class="category-arrow">
                →
            </span>

        `;


        categoriesContainer.appendChild(card);

    });

}



/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        createDots();

        showSlide(0);

        displayCategories();

        startAutoSlide();

    }
);