/* =====================================================
   KANA ADMIN LOGIN
   FIREBASE AUTHENTICATION
===================================================== */

import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


const loginForm =
    document.getElementById("loginForm");

const loginError =
    document.getElementById("loginError");


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


        // Hide previous error
        loginError.hidden = true;


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            // Login successful
            window.location.href =
                "index.html";


        } catch (error) {

            console.error(
                "Firebase Login Error:",
                error
            );


            loginError.hidden = false;

        }

    }
);