/* =====================================================
   KANA ÉLECTROMÉNAGER
   ADMIN LOGIN
   Firebase Authentication
===================================================== */

import {
    auth
} from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* =====================================================
   ELEMENTS
===================================================== */

const loginForm =
    document.getElementById("loginForm");

const loginError =
    document.getElementById("loginError");


/* =====================================================
   LOGIN
===================================================== */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            if (loginError) {

                loginError.hidden = true;

            }


            try {

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                console.log(
                    "KANA — Login successful:",
                    userCredential.user.email
                );


                window.location.href =
                    "index.html";


            } catch (error) {

                console.error(
                    "KANA — Login Error:",
                    error
                );


                if (loginError) {

                    loginError.hidden = false;

                    loginError.textContent =
                        "Adresse e-mail ou mot de passe incorrect.";

                }

            }

        }
    );

}