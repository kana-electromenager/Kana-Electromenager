console.log("CATEGORY JS IS WORKING"); 
/* =====================================================
   KANA ADMIN
   CATEGORIES MANAGEMENT
===================================================== */


/* =====================================================
   1. ELEMENTS
===================================================== */

const addCategoryButton =
    document.getElementById("addCategoryButton");

const categoryFormContainer =
    document.getElementById("categoryFormContainer");

const categoryForm =
    document.getElementById("categoryForm");

const categoryFormTitle =
    document.getElementById("categoryFormTitle");

const categoryName =
    document.getElementById("categoryName");

const cancelCategoryButton =
    document.getElementById("cancelCategoryButton");

const categoriesContainer =
    document.getElementById("categoriesContainer");

const categoriesCount =
    document.getElementById("categoriesCount");


/* =====================================================
   2. STORAGE
===================================================== */

const CATEGORIES_STORAGE_KEY = "kanaCategories_v2";


/* =====================================================
   3. DEFAULT CATEGORIES
===================================================== */

const defaultCategories = [

    {
        id: "refrigerateur-congelateur",

        name: "Réfrigérateurs et congélateurs",

        subcategories: [

            {
                id: "refrigerateurs",
                name: "Réfrigérateurs"
            },

            {
                id: "congelateurs",
                name: "Congélateurs"
            }

        ]
    },


    {
        id: "television",

        name: "Télévisions",

        
    },


    {
        id: "machine-a-laver",

        name: "Machine à laver",

    },


    {
        id: "lave-vaisselle",

        name: "Lave-vaisselle",

    },


    {
        id: "maison-entretien",

        name: "Maison - entretien",

        subcategories: [

            {
                id: "aspirateur",
                name: "Aspirateur"
            },

            {
                id: "ventilateur",
                name: "Ventilateur"
            },

            {
                id: "climatisation",
                name: "Climatisation"
            },

            {
                id: "chauffage",
                name: "Chauffage"
            },

            {
                id: "chauffe-eau",
                name: "Chauffe-eau"
            }

        ]
    },


    {
        id: "cuisine",

        name: "Cuisine",

        subcategories: [

            {
                id: "machine-a-cafe",
                name: "Machine à café"
            },

            {
                id: "hachoir-mixeur-batteur-blender",
                name: "Hachoir / Mixeur / Batteur / Blender"
            },

            {
                id: "air-fryer",
                name: "Air Fryer"
            },

            {
                id: "petrin",
                name: "Pétrin"
            },

            {
                id: "micro-ondes",
                name: "Micro-ondes"
            },

            {
                id: "fours",
                name: "Fours"
            },

            {
                id: "cuisiniere",
                name: "Cuisinière"
            }

        ]
    }

];


/* =====================================================
   4. CURRENT EDITING CATEGORY
===================================================== */

let editingCategoryId = null;


/* =====================================================
   5. CREATE ID
===================================================== */

function createCategoryId(name) {

    return String(name)
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

}


/* =====================================================
   6. NORMALIZE CATEGORY
===================================================== */

function normalizeCategory(category) {

    return {

        id: category.id,

        name: category.name,

        subcategories:
            Array.isArray(category.subcategories)
                ? category.subcategories
                : []

    };

}


/* =====================================================
   7. LOAD CATEGORIES
===================================================== */

function loadCategories() {

    try {

        const savedCategories =
            localStorage.getItem(
                CATEGORIES_STORAGE_KEY
            );


        if (savedCategories) {

            const parsedCategories =
                JSON.parse(savedCategories);


            if (Array.isArray(parsedCategories)) {

                return parsedCategories.map(
                    normalizeCategory
                );

            }

        }

    }

    catch (error) {

        console.error(
            "Erreur lors du chargement des catégories :",
            error
        );

    }


    const categories =
        defaultCategories.map(
            category =>
                normalizeCategory(
                    category
                )
        );


    saveCategories(categories);


    return categories;

}


/* =====================================================
   8. SAVE CATEGORIES
===================================================== */

function saveCategories(categories) {

    try {

        localStorage.setItem(

            CATEGORIES_STORAGE_KEY,

            JSON.stringify(categories)

        );

        return true;

    }

    catch (error) {

        console.error(
            "Erreur lors de la sauvegarde :",
            error
        );

        return false;

    }

}


/* =====================================================
   9. OPEN FORM
===================================================== */

function openCategoryForm(category = null) {

    if (
        !categoryFormContainer ||
        !categoryName
    ) {

        return;

    }


    categoryFormContainer.hidden = false;


    if (category) {

        editingCategoryId =
            category.id;


        if (categoryFormTitle) {

            categoryFormTitle.textContent =
                "Modifier la catégorie";

        }


        categoryName.value =
            category.name || "";

    }

    else {

        editingCategoryId = null;


        if (categoryFormTitle) {

            categoryFormTitle.textContent =
                "Nouvelle catégorie";

        }


        categoryName.value = "";

    }


    categoryName.focus();

}


/* =====================================================
   10. CLOSE FORM
===================================================== */

function closeCategoryForm() {

    if (!categoryFormContainer) {

        return;

    }


    categoryFormContainer.hidden = true;


    editingCategoryId = null;


    if (categoryForm) {

        categoryForm.reset();

    }


    if (categoryFormTitle) {

        categoryFormTitle.textContent =
            "Nouvelle catégorie";

    }

}


/* =====================================================
   11. CREATE CATEGORY CARD
===================================================== */

function createCategoryCard(category) {

    const card =
        document.createElement("article");


    card.className =
        "admin-category-card";


    card.dataset.categoryId =
        category.id;


    const subcategories =
        Array.isArray(
            category.subcategories
        )
            ? category.subcategories
            : [];


    let subcategoriesHTML = "";


    if (subcategories.length > 0) {

        subcategoriesHTML = `

            <div class="admin-subcategories">

                <p>
                    SOUS-CATÉGORIES
                </p>

                <div class="admin-subcategory-list">

                    ${subcategories
                        .map(
                            subcategory => `
                                <span class="admin-subcategory">
                                    ${subcategory.name}
                                </span>
                            `
                        )
                        .join("")
                    }

                </div>

            </div>

        `;

    }


    card.innerHTML = `

        <div class="admin-category-icon">
            ◇
        </div>


        <div class="admin-category-info">

            <p>
                CATÉGORIE
            </p>

            <h3>
                ${category.name}
            </h3>

            ${subcategoriesHTML}

        </div>


        <div class="admin-category-actions">

            <button
                type="button"
                class="category-edit-button"
                data-id="${category.id}"
            >
                MODIFIER
            </button>


            <button
                type="button"
                class="category-delete-button"
                data-id="${category.id}"
            >
                SUPPRIMER
            </button>

        </div>

    `;


    return card;

}


/* =====================================================
   12. DISPLAY CATEGORIES
===================================================== */

function displayCategories() {

    if (!categoriesContainer) {

        return;

    }


    const categories =
        loadCategories();


    categoriesContainer.innerHTML = "";


    if (categories.length === 0) {

        categoriesContainer.innerHTML = `

            <div class="admin-categories-empty">

                <div class="admin-categories-empty-icon">
                    ◇
                </div>

                <h3>
                    Aucune catégorie
                </h3>

                <p>
                    Commencez par ajouter une catégorie
                    à votre catalogue.
                </p>

                <button
                    type="button"
                    id="emptyAddCategoryButton"
                >
                    + AJOUTER UNE CATÉGORIE
                </button>

            </div>

        `;


        const emptyAddButton =
            document.getElementById(
                "emptyAddCategoryButton"
            );


        if (emptyAddButton) {

            emptyAddButton.addEventListener(
                "click",
                function () {

                    openCategoryForm();

                }
            );

        }


        updateCategoriesCount(
            categories
        );


        return;

    }


    categories.forEach(
        category => {

            const card =
                createCategoryCard(
                    category
                );


            categoriesContainer.appendChild(
                card
            );

        }
    );


    updateCategoriesCount(
        categories
    );

}


/* =====================================================
   13. UPDATE COUNT
===================================================== */

function updateCategoriesCount(
    categories
) {

    if (!categoriesCount) {

        return;

    }


    const count =
        categories.length;


    categoriesCount.textContent =
        `${count} catégorie${
            count > 1
                ? "s"
                : ""
        }`;

}


/* =====================================================
   14. ADD CATEGORY
===================================================== */

function addCategory(name) {

    const categories =
        loadCategories();


    const cleanName =
        name.trim();


    if (!cleanName) {

        return false;

    }


    const alreadyExists =
        categories.some(
            category =>
                String(category.name)
                    .trim()
                    .toLowerCase() ===
                cleanName.toLowerCase()
        );


    if (alreadyExists) {

        alert(
            "Cette catégorie existe déjà."
        );

        return false;

    }


    const newCategory = {

        id:
            createCategoryId(
                cleanName
            ) +
            "-" +
            Date.now(),

        name:
            cleanName,

        subcategories: []

    };


    categories.push(
        newCategory
    );


    return saveCategories(
        categories
    );

}


/* =====================================================
   15. EDIT CATEGORY
===================================================== */

function editCategory(
    categoryId,
    newName
) {

    const categories =
        loadCategories();


    const categoryIndex =
        categories.findIndex(
            category =>
                category.id ===
                categoryId
        );


    if (categoryIndex === -1) {

        alert(
            "Catégorie introuvable."
        );

        return false;

    }


    const cleanName =
        newName.trim();


    const duplicate =
        categories.some(
            (category, index) =>

                index !== categoryIndex &&

                String(category.name)
                    .trim()
                    .toLowerCase() ===
                cleanName.toLowerCase()

        );


    if (duplicate) {

        alert(
            "Cette catégorie existe déjà."
        );

        return false;

    }


    /*
        IMPORTANT :

        On change seulement le nom.

        Les sous-catégories restent
        exactement comme elles sont.
    */

    categories[categoryIndex].name =
        cleanName;


    if (
        !Array.isArray(
            categories[categoryIndex]
                .subcategories
        )
    ) {

        categories[categoryIndex]
            .subcategories = [];

    }


    return saveCategories(
        categories
    );

}


/* =====================================================
   16. DELETE CATEGORY
===================================================== */

function deleteCategory(
    categoryId
) {

    const categories =
        loadCategories();


    const category =
        categories.find(
            item =>
                item.id ===
                categoryId
        );


    if (!category) {

        alert(
            "Catégorie introuvable."
        );

        return;

    }


    const confirmed =
        confirm(
            `Voulez-vous vraiment supprimer la catégorie "${category.name}" ?`
        );


    if (!confirmed) {

        return;

    }


    const updatedCategories =
        categories.filter(
            item =>
                item.id !==
                categoryId
        );


    const saved =
        saveCategories(
            updatedCategories
        );


    if (!saved) {

        alert(
            "Impossible de supprimer la catégorie."
        );

        return;

    }


    displayCategories();


    alert(
        "Catégorie supprimée avec succès."
    );

}


/* =====================================================
   17. ADD BUTTON
===================================================== */

if (addCategoryButton) {

    addCategoryButton.addEventListener(
        "click",
        function () {

            openCategoryForm();

        }
    );

}


/* =====================================================
   18. CANCEL BUTTON
===================================================== */

if (cancelCategoryButton) {

    cancelCategoryButton.addEventListener(
        "click",
        function () {

            closeCategoryForm();

        }
    );

}


/* =====================================================
   19. FORM SUBMIT
===================================================== */

if (categoryForm) {

    categoryForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (!categoryName) {

                return;

            }


            const name =
                categoryName.value.trim();


            if (!name) {

                alert(
                    "Veuillez saisir le nom de la catégorie."
                );

                categoryName.focus();

                return;

            }


            /* ===============================
               EDIT
            =============================== */

            if (editingCategoryId) {

                const updated =
                    editCategory(
                        editingCategoryId,
                        name
                    );


                if (!updated) {

                    return;

                }


                alert(
                    "Catégorie modifiée avec succès."
                );

            }


            /* ===============================
               ADD
            =============================== */

            else {

                const added =
                    addCategory(
                        name
                    );


                if (!added) {

                    return;

                }


                alert(
                    "Catégorie ajoutée avec succès."
                );

            }


            closeCategoryForm();


            displayCategories();

        }
    );

}


/* =====================================================
   20. CATEGORY ACTIONS
===================================================== */

if (categoriesContainer) {

    categoriesContainer.addEventListener(
        "click",
        function (event) {

            const editButton =
                event.target.closest(
                    ".category-edit-button"
                );


            const deleteButton =
                event.target.closest(
                    ".category-delete-button"
                );


            /* ===============================
               EDIT
            =============================== */

            if (editButton) {

                const categoryId =
                    editButton.dataset.id;


                const categories =
                    loadCategories();


                const category =
                    categories.find(
                        item =>
                            item.id ===
                            categoryId
                    );


                if (category) {

                    openCategoryForm(
                        category
                    );

                }


                return;

            }


            /* ===============================
               DELETE
            =============================== */

            if (deleteButton) {

                const categoryId =
                    deleteButton.dataset.id;


                deleteCategory(
                    categoryId
                );

            }

        }
    );

}


/* =====================================================
   21. INITIALIZE
===================================================== */

function initCategoriesPage() {

    displayCategories();

}


initCategoriesPage();