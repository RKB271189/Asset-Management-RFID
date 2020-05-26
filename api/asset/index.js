const asset = require('express').Router();
const request = require('./AssetRequest');
const controller = require('./AssetController');
asset.post('/verify-site-asset', async (req, res) => {  
    await request.GetAssetRequest(req).then(async function (results) {
        if (!results.result) {
            res.end(JSON.stringify(results));
        } else {
            await controller.GetAsset(req).then(function (results) {
                res.end(JSON.stringify(results));
            });
        }
    })
});
asset.post('/tag-event-entry', async (req, res) => {
    await request.EventAssetRequest(req).then(async function (results) {
        if (!results.result) {
            res.end(JSON.stringify(results));
        } else {
            await controller.RegisterAssetEvent(req).then(function (results) {
                res.end(JSON.stringify(results));
            });
        }
    });
});

asset.post('/tag-track-entry', async (req, res) => {
    await request.TrackAssetRequest(req).then(async function (results) {
        if (!results.result) {
            res.end(JSON.stringify(results));
        } else {
            await controller.RegisterAssetTracking(req).then(function (results) {
                res.end(JSON.stringify(results));
            });
        }
    });
});

module.exports = asset;