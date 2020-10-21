const express = require('express');

let { verifyToken, verifyAdmin_Role } = require('../middlewares/authentication');

let app = express();

let Category = require('../models/category');

// ====================
//Show all categories
// ====================
app.get('/category', verifyToken, (req, res) => {

    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categories
            });
        });

});

// ====================
//Show a category by ID
// ====================
app.get('/category/:id', verifyToken, (req, res) => {
    //Categoria.findById()

    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The id does not exist'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

// ====================
//Create a new category
// ====================
app.post('/category/', verifyToken, (req, res) => {
    //return the new category
    //req.user._id

    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });

    });
});

// ====================
//Update category
// ====================
app.put('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let desCategory = {
        description: body.description
    };

    Category.findByIdAndUpdate(id, desCategory, { new: true, runValidators: true }, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });

});

// ====================
//Delete category
// ====================
app.delete('/category/:id', [verifyToken, verifyAdmin_Role], (req, res) => {
    //Only the admin can delete the category

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDelete) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The id does not exist'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Category deleted'
        });
    });
});






module.exports = app;