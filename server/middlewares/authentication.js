const jwt = require('jsonwebtoken');

//=================
//Verify token
//================

let verifyToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        }


        req.user = decoded.user;


        next();
    });

};

//=================
//Verify AdminRole
//================

let verifyAdmin_Role = (req, res, next) => {

    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'User is not adminitrator'
            }
        });
    }
}

//=================
//Verify token for image
//================

let verifyTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        }


        req.user = decoded.user;


        next();
    });

}


module.exports = {
    verifyToken,
    verifyAdmin_Role,
    verifyTokenImg
}