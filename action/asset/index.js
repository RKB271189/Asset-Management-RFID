const asset = require('express').Router();
const controller = require('./AssetController');
const request = require('./AssetRequest');


asset.post('/create-asset', async (req, res) => {
    let site_code = req.body.Site_Code;
    await request.CreateAssetRequest(req).then(async function (results) {
        if (!results) {
            res.redirect('create/?site_code=' + site_code);
        } else {
            await controller.CreateAsset(req).then(function (results) {
                res.redirect('create/?site_code=' + site_code);
            });
        }
    });
});
asset.get('/create', async (req, res) => {
    let site_code = req.query.site_code;
    await controller.GetAssetType(req).then(function (results) {
        if (!results) {
            res.render('createasset', { message: req.flash('error'), site_code: site_code });
        } else {
            let typerecord = results;
            res.render('createasset', { type: typerecord, site_code: site_code, message: req.flash('error') });
        }
    });
});

asset.post('/create-type', async (req, res) => {
    await request.CreateAssetTypeRequest(req).then(async function (results) {
        if (!results) {
            res.redirect('type');
        } else {
            await controller.CreateAssetType(req).then(function (results) {
                res.redirect('type');
            });
        }
    });
});
asset.get('/type', async (req, res) => {
    res.render('createassettype', { message: req.flash('error') });
});

module.exports = asset;