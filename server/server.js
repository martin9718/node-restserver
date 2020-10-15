require('./config/config');

const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

//Enable public folder
app.use(express.static(path.resolve(__dirname, '../public')));


//Global configuration routes
app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    (err, res) => {
        if (err) throw err;
        console.log('DataBase ONLINE');
    });

app.listen(process.env.PORT, () => {
    console.log('Listening to the port ', process.env.PORT);
})