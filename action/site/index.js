const site = require('express').Router();
const controller = require('../site/SiteController');
const requests = require('../site/SiteRequest');
site.post('/create-site', async (req, res) => {
    await requests.CreateSiteRequest(req).then(async function (results) {
        if (!results) {
            res.redirect('create');
        } else {
            await controller.CreateSite(req).then(function (results) {
                res.redirect('create');
            });
        }
    });
});
site.get('/create', async (req, res) => {
    res.render('createsite', { message: req.flash('error') });
});




site.get('/view', async (req, res) => {
    await controller.GetSiteList(req).then(function (results) {
        if (!results) {
            res.render('viewsite', { message: sitemessage, message: req.flash('error') });
        } else {
            res.render('viewsite', { site: results, message: req.flash('error') });
        }
    });
})
site.get('/delete', async function (req, res) {
    let sitecode = req.query.site_code;
    await controller.VerifySiteCode(sitecode, req).then(async function (results) {
        if (!results) {
            res.redirect('view');
        } else {
            let siteid = req.query.site_id;
            await controller.DeleteSite(siteid, req).then(function (results) {
                res.redirect('view');
            });
        }
    });
});
module.exports = site;