// ==================
// Port
// ==================

process.env.PORT = process.env.PORT || 3000;

// ==================
// Environment
// ==================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ==================
// Data base
// ==================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
} else {
    urlDB = 'mongodb+srv://strider:bd0gkPRontj0LT6I@cluster0.w4vga.mongodb.net/coffee?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;