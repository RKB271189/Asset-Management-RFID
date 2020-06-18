const asset = require('express').Router();
const controller = require('./AssetController');
const request = require('./AssetRequest');
const siterequest = require('../site/SiteRequest')
const verify = require('./AssetVerification');

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


asset.post('/search', async (req, res) => {
    await siterequest.VerifySite(req).then(async function (results) {
        if (!results) {
            res.redirect('view');
        } else {
            await controller.GetAssetDetails(req).then(function (results) {
                if (!results) {
                    res.redirect('view');
                } else {
                    req.flash('asset', results);
                    res.redirect('view');
                }
            });
        }
    });
});
asset.get('/view', async (req, res) => {
    res.render('viewasset', { message: req.flash('error'), asset: req.flash('asset') });
});
asset.get('/edit-asset', async (req, res) => {
    await verify.VerifyAssetIfscanned(req).then(async function (results) {
        if (!results) {
            let sitecode = req.query.site;
            req.body["Site_Code"] = sitecode;
            await controller.GetAssetDetails(req).then(function (results) {
                req.flash('asset', results);
                res.render('viewasset', { message: req.flash('error'), asset: req.flash('asset') });
            });
        } else {
            await controller.GetAssetDetailsOnUpdate(req).then(async function (results) {
                if (!results) {
                    res.render('updateasset', {
                        message: req.flash('error'),
                        Asset_Code: '',
                        Asset_Id: '',
                        Model_Number: '',
                        Serial_Number: '',
                        Asset_Type: '',
                        Description: '',
                        type: '',
                        Responsible_Warehouse: ''
                    });
                } else {
                    let array_asset = req.flash('asset');
                    await controller.GetAssetType(req).then(async function (results) {
                        if (!results) {
                            res.render('updateasset', {
                                message: req.flash('error'),
                                Asset_Code: '',
                                Asset_Id: '',
                                Model_Number: '',
                                Serial_Number: '',
                                Asset_Type: '',
                                Description: '',
                                type: '',
                                Responsible_Warehouse: ''
                            });
                        } else {
                            res.render('updateasset', {
                                message: req.flash('error'),
                                Asset_Code: array_asset[0].Asset_Code,
                                Asset_Id: array_asset[0].Asset_Id,
                                Model_Number: array_asset[0].Model_Number,
                                Serial_Number: array_asset[0].Serial_Number,
                                Asset_Type: array_asset[0].Asset_Type,
                                Description: array_asset[0].Description,
                                Site_Code: array_asset[0].Site_Code,
                                Responsible_Warehouse: array_asset[0].Responsible_Warehouse,
                                type: results
                            });
                        }
                    });
                }
            });
        }
    });
});
asset.post('/update-asset', async (req, res) => {
    await request.CreateAssetRequest(req).then(async function (results) {
        if (!results) {
            res.redirect('edit-asset/?asset=' + req.body.Asset_Id + '&site=' + req.body.Site_Code);
        } else {
            await controller.UpdateAsset(req).then(function (results) {
                res.redirect('edit-asset/?asset=' + req.body.Asset_Id + '&site=' + req.body.Site_Code);
            });
        }
    });
});
asset.get('/delete-asset', async (req, res) => {
    await verify.VerifyAssetIfscanned(req).then(async function (results) {
        let sitecode = req.query.site;
        if (!results) {
            let sitecode = req.query.site;
            req.body["Site_Code"] = sitecode;
            await controller.GetAssetDetails(req).then(function (results) {
                req.flash('asset', results);
                res.render('viewasset', { message: req.flash('error'), asset: req.flash('asset') });
            });
        } else {
            await controller.DeleteAsset(req).then(async function (results) {
                req.body["Site_Code"] = sitecode;
                await controller.GetAssetDetails(req).then(function (results) {
                    req.flash('asset', results);
                    res.render('viewasset', { message: req.flash('error'), asset: req.flash('asset') });
                });
            });
        }
    });
});
/**
 * method to get event report
 */
asset.get('/event', async (req, res) => {
    //let startdate = await othermethod.GetCurrentOnlyDate();
    // let enddate = await othermethod.GetTommorowsDate();
    res.render('viewassetevent', { message: req.flash('error'), event: req.flash('event'), pagelink: req.flash('link') });
});
asset.post('/event-search', async (req, res) => {
    await request.GetAssetEventRequest(req).then(async function (results) {
        if (!results) {
            res.redirect('event');
        } else {
            await controller.GetAsssetEventDetails(req).then(function (results) {
                res.redirect('event');
            });
        }
    });
});
asset.get('/fetch-event-search/:page', async (req, res) => {
    let page = req.params.page;
    await controller.GetAsssetEventDetails(req, page).then(function (results) {
        res.render('viewassetevent', { message: req.flash('error'), event: req.flash('event'), pagelink: req.flash('link') });
    });
});
/**
 * method to get track report
 */
asset.get('/track', async (req, res) => {
    res.render('viewassettrack', { message: req.flash('error'), track: req.flash('track'), pagelink: req.flash('link') });
});
asset.post('/track-search', async (req, res) => {
    await request.GetAssetTrackRequest(req).then(async function (results) {
        if (!results) {
            res.redirect('track');
        } else {
            await controller.GetTrackDetails(req).then(function (results) {
                res.redirect('track');
            });
        }
    });
});
asset.get('/fetch-track-search/:page', async (req, res) => {
    let page = parseInt(req.params.page);
    await controller.GetTrackDetails(req, page).then(function (results) {
        res.render('viewassettrack', { message: req.flash('error'), track: req.flash('track'), pagelink: req.flash('link') });
    });
});

module.exports = asset;