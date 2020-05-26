const web = require('express').Router();
const user = require('../action/user');
const asset = require('../action/asset');
const site = require('../action/site');
web.use((req, res, next) => {
    let loginid = req.session["loginid"];
    if (!loginid || loginid == null || loginid == '' || typeof loginid == 'undefined') {
        let obturl = req.originalUrl;
        let verifypath = obturl.includes('/user/signin');
        if (verifypath) {
            next();
        } else {
            res.redirect('/');
        }
    } else {
        next();
    }
})
web.use('/user', user);
web.use('/asset', asset);
web.use('/site', site);
web.use('/asset', asset);
module.exports = web;