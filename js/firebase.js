/* =====================================================
   KANA ÉLECTROMÉNAGER
   FIREBASE CONFIGURATION
===================================================== */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =====================================================
   FIREBASE CONFIG
===================================================== */

const firebaseConfig = {

    apiKey: "AIzaSyDWvc1mpzDaJ7gp7MC0U4EnBODzauIS9zw",

    authDomain: "kana-electromenager.firebaseapp.com",

    projectId: "kana-electromenager",

    storageBucket: "kana-electromenager.firebasestorage.app",

    messagingSenderId: "1049889275160",

    appId: "1:1049889275160:web:b83cd78f1b41e323dab26d"

};


/* =====================================================
   INITIALIZE FIREBASE
===================================================== */

const app =
    initializeApp(firebaseConfig);


/* =====================================================
   FIREBASE AUTHENTICATION
===================================================== */

const auth =
    getAuth(app);


/* =====================================================
   FIRESTORE
===================================================== */

const db =
    getFirestore(app);


/* =====================================================
   EXPORT
===================================================== */

export {

    app,

    auth,

    db,

    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,

    query,
    where,
    orderBy,
    serverTimestamp

};