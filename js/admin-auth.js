/* =====================================================
   KANA ADMIN AUTH GUARD
===================================================== */

import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

    }

});

/* =====================================================
   KANA ADMIN AUTH
   AUTH GUARD + LOGOUT
===================================================== */

import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* =====================================================
   AUTH GUARD
===================================================== */

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

    }

});


/* =====================================================
   LOGOUT
===================================================== */

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                window.location.href =
                    "login.html";

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}