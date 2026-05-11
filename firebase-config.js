// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAamBkZbo3mpZsCohg0mxqpx4wWqi5O2Wg",
    authDomain: "falcon-furniture.firebaseapp.com",
    projectId: "falcon-furniture",
    storageBucket: "falcon-furniture.firebasestorage.app",
    messagingSenderId: "461692201804",
    appId: "1:461692201804:web:515cde2a35d99270efbde9",
    databaseURL: "https://falcon-furniture-default-rtdb.firebaseio.com",
    measurementId: "G-6R0HRFM66Q"
};

// Initialize Firebase
let app, auth, database, storage;

try {
    app = firebase.initializeApp(firebaseConfig);
    
    // Only initialize auth if firebase.auth is available
    if (typeof firebase.auth === 'function') {
        auth = firebase.auth();
    }
    
    // Always initialize database
    database = firebase.database();
    
    // Only initialize storage if firebase.storage is available
    if (typeof firebase.storage === 'function') {
        storage = firebase.storage();
    }
    
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Export Firebase services
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDatabase = database;
window.firebaseStorage = storage;
