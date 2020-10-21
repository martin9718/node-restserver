const express = require('express');

let { verifyToken } = require('../middlewares/authentication');

let app = express();
let Product = require('../models/product');


//=====================
//Get all products
//=====================
app.get('/products', verifyToken, (req, res) => {
    //Get all products
    //populate: user and category
    //paged

    let from = req.query.from || 0;
    from = Number(from);

    Product.find({ available: true })
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, products) => {

            if (err) {
                return res.status(500).json({
                    ok: true,
                    err
                })
            }

            res.json({
                ok: true,
                products
            });
        });
});

//=====================
//Get a product by ID
//=====================
app.get('/products/:id', verifyToken, (req, res) => {
    //populate: user and category

    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productDB) => {

            if (err) {
                return res.status(500).json({
                    ok: true,
                    err
                });
            }

            if (!productDB) {
                return res.status(400).json({
                    ok: true,
                    err: {
                        message: 'The ID does not exist'
                    }
                });
            }

            res.json({
                ok: true,
                product: productDB
            });
        });

});

//=====================
//Create a new product
//=====================
app.get('/products/search/:term', verifyToken, (req, res) => {

    let term = req.params.term;

    let regex = new RegExp(term, 'i');

    Product.find({ name: regex })
        .populate('category', 'name')
        .exec((err, products) => {

            if (err) {
                return res.status(500).json({
                    ok: true,
                    err
                });
            }

            res.json({
                ok: true,
                products
            })
        });
});


//=====================
//Create a new product
//=====================
app.post('/products', verifyToken, (req, res) => {
    //capture user
    // capture a category from the list

    let body = req.body;

    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        available: body.available,
        category: body.category,
        user: req.user._id
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                err
            })
        }

        res.status(201).json({
            ok: true,
            product: productDB
        })
    });

});

//=====================
//Update a product by ID
//=====================
app.put('/products/:id', verifyToken, (req, res) => {
    //capture user
    // capture a category from the list

    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'The ID does not exist'
                }
            });
        }

        productDB.name = body.name;
        productDB.unitPrice = body.unitPrice;
        productDB.category = body.category;
        productDB.available = body.available;
        productDB.description = body.description;

        productDB.save((err, savedProduct) => {

            if (err) {
                return res.status(500).json({
                    ok: true,
                    err
                });
            }

            res.json({
                ok: true,
                product: savedProduct
            });
        });
    });

});

//=====================
//Delete a product by ID
//=====================
app.delete('/products/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'The ID does not exist'
                }
            });
        }

        productDB.available = false;

        productDB.save((err, productoNotAvailable) => {

            if (err) {
                return res.status(500).json({
                    ok: true,
                    err
                });
            }

            res.json({
                ok: true,
                product: productoNotAvailable,
                message: 'Product not available'
            });
        });

    });
});








module.exports = app;