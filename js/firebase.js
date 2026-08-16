/* =====================================================
   KANA ÉLECTROMÉNAGER
   FIREBASE CONFIGURATION
===================================================== */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


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


import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* =====================================================
   FIREBASE CONFIG
===================================================== */

const firebaseConfig = {

    apiKey: "AIzaSyCv34mIllggc415xCCt3LiiPj1LTLdlJkQ",

    authDomain: "kana-electromenager.firebaseapp.com",

    projectId: "kana-electromenager",

    storageBucket: "kana-electromenager.firebasestorage.app",

    messagingSenderId: "1049889275160",

    appId: "1:1049889275160:web:b83cd78f1b41e323dab26d"

};


/* =====================================================
   INITIALIZE FIREBASE
===================================================== */

const app = initializeApp(firebaseConfig);


/* =====================================================
   FIRESTORE
===================================================== */

const db = getFirestore(app);


/* =====================================================
   AUTHENTICATION
===================================================== */

const auth = getAuth(app);


/* =====================================================
   EXPORT
===================================================== */

export {

    app,

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
    serverTimestamp,

    auth

};     