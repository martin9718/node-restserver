const express = require('express');

const bcrypt = require('bcryptjs');
const _ = require('underscore');

const User = require('../models/user');
const { verifyToken, verifyAdmin_Role } = require('../middlewares/authentication');

const app = express();



app.get('/user', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 0;
    limit = Number(limit);

    User.find({ status: true }, 'name email role status google img')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.countDocuments({ status: true }, (err, count) => {

                res.json({
                    ok: true,
                    users,
                    quantity: count
                });
            });


        })
});

app.post('/user', [verifyToken, verifyAdmin_Role], function(req, res) {

    let body = req.body;

    let salt = bcrypt.genSaltSync(10);

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, salt),
        role: body.role
    });

    user.save((err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            user: userDB
        });

    });

});

app.put('/user/:id', [verifyToken, verifyAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB

        });
    });


});

app.delete('/user/:id', [verifyToken, verifyAdmin_Role], function(req, res) {

    let id = req.params.id;

    //User.findByIdAndRemove(id, (err, userDelete) => {

    let changeStatus = {
        status: false
    };

    User.findByIdAndUpdate(id, changeStatus, {
        new: true
    }, (err, userDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not exist'
                }
            });
        }

        res.json({
            ok: true,
            user: userDelete
        });

    });

});

module.exports = app;