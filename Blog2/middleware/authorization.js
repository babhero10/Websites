function authorized(req, res, next) {
    
    if (req.cookies.userData) {
        req.userData = req.cookies.userData;
        next();
    } else {
        res.redirect('/user/login');
    }
}

module.exports = authorized;