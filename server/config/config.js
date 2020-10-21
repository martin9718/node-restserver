// ==================
// Port
// ==================

process.env.PORT = process.env.PORT || 3000;

// ==================
// Environment
// ==================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==================
// Token expiration
// ==================
//60 seconds
//60 minutes
//24 hours
//30 days

process.env.EXPIRATION_TOKEN = '48h';


// ==================
// Autentication SEED
// ==================
process.env.SEED = process.env.SEED || 'seed-development';



// ==================
// Data base
// ==================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ==================
// Google clietn ID
// ==================
process.env.CLIENT_ID = process.env.CLIENT_ID || '425105353762-t436vdgvaiiak7l6gadn8u8ujned9urg.apps.googleusercontent.com';