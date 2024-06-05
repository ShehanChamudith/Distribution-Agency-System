const { verify } = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const accessToken = req.header('accessToken');

    if (!accessToken) return res.json({ error: 'User not logged in!' });

    try {
        const validToken = verify(accessToken, 'jwtSecretToken');

        if (validToken) {
            req.user = validToken;
            return next();
        }
    } catch (err) {
        return res.json({ error: 'Invalid Token' });
    }
};

const checkRole = (roles) => {
    return (req, res, next) => {
        const user = req.user;

        if (roles.includes(user.usertype)) {
            next();
        } else {
            res.status(403).json({ error: 'Access denied: Insufficient permissions' });
        }
    };
};

module.exports = { validateToken, checkRole };
