// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIza5yAamBtZbo3mpZsCokgRmwqpx4wMqi5DZW8",
    authDomain: "falcon-furniture.firebaseapp.com",
    projectId: "falcon-furniture",
    storageBucket: "falcon-furniture.firebasestorage.app",
    messagingSenderId: "461692281804",
    appId: "1:461692281804:web:515Cde2a35m9278efDd8d",
    databaseURL: "https://falcon-furniture-default-rtdb.firebaseio.com",
    measurementId: "G-QRRMRFM4G0"
};

// Initialize Firebase
let app, auth, database, storage;

try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    database = firebase.database();
    storage = firebase.storage();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Export Firebase services
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDatabase = database;
window.firebaseStorage = storage;
