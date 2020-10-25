const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

//default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', function(req, res) {

    let type = req.params.type;
    let id = req.params.id;


    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No file has been selected'
                }
            });
    }

    //Validate type
    let validTypes = ['products', 'users'];

    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'The type is not allowed, use the following: ' + validTypes.join(', ')
            }
        })
    }


    let file = req.files.file;
    let cutName = file.name.split('.');
    let extension = cutName[cutName.length - 1];


    //Allowed extensions
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extension is not allowed, use the following: ' + validExtensions.join(', '),
                ext: extension
            }
        })
    }

    //Rename file
    let fileName = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;


    // Use the mv() method to place the file somewhere on your server
    file.mv(`uploads/${type}/${fileName}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //So far the image is uploaded
        if (type === 'users') {
            userImage(id, res, fileName);
        } else {
            productImage(id, res, fileName);
        }


    });
});

function userImage(id, res, fileName) {

    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(fileName, 'users');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            deleteFile(fileName, 'users');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The user doesn\'t exist'
                }
            });
        }

        deleteFile(userDB.img, 'users');

        userDB.img = fileName;

        userDB.save((err, userSaved) => {

            res.json({
                ok: true,
                user: userSaved,
                img: fileName
            });
        });
    });
}

function productImage(id, res, fileName) {

    Product.findById(id, (err, productDB) => {

        if (err) {
            deleteFile(fileName, 'products');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            deleteFile(fileName, 'products');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The product doesn\'t exist'
                }
            });
        }

        deleteFile(productDB.img, 'products');

        productDB.img = fileName;

        productDB.save((err, productSaved) => {

            res.json({
                ok: true,
                product: productSaved,
                img: fileName
            });
        });
    });

}

function deleteFile(imageName, type) {

    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${ imageName }`);
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}




module.exports = app;