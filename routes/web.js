const web = require('express').Router();
const user = require('../action/user');
const asset = require('../action/asset');
const site = require('../action/site');
const authenticate = require('../auth/authenticate');
web.use((req, res, next) => {
    let loginid = req.session["loginid"];
    if (loginid == null || loginid == '' || typeof loginid == 'undefined') {
        let obturl = req.originalUrl;
        let verifypath = obturl.includes('/user/signin');
        if (verifypath) {
            next();
        } else {
            res.redirect('/');
        }
    } else {
        authenticate.AccessAuthenticate(req).then(function (results) {
            if (!results) {
                res.render('noaccess', { message: req.flash('error'), path: req.session["oldurl"] });
            } else {
                req.session["oldurl"] = req.originalUrl;
                next();
            }
        });
    }
});

web.use('/user', user);
web.use('/asset', asset);
web.use('/site', site);
web.use('/asset', asset);
module.exports = web;