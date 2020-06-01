const asset = require('express').Router();
const request = require('./AssetRequest');
const controller = require('./AssetController');
/**
 * This is the request that is made to verify site code in site master and asset master
 * and then it will return the asset details of that particular site
 */
asset.post('/verify-site-asset', async (req, res) => {
    //this method will check site code in site master and asset master 
    await request.GetAssetRequest(req).then(async function (results) {
        if (!results.result) {
            res.end(JSON.stringify(results));
        } else {
            //after checking and finding the site code it will return asset details 
            //of that particular site in the page AssetController
            await controller.GetAsset(req).then(function (results) {               
                res.end(JSON.stringify(results));
            });
        }
    })
});
/**
 * This is the event that will first verify if the user is having proper role
 * to make the scanning request
 * for example: if the tag is scanned at the ware house than that user will be provide its login
 * details made through web and wil have role id=2
 * This method is defined in AssetRequest page it will first check for the empty fields
 * then it will verify the role and again verify for the site code and in asset master
 * then it will check if the tag is already scanned for that asset
 * if not than it will call the method in AssetController to save the tag details in asset master
 * and other details in tagevent table
 */
asset.post('/tag-event-entry', async (req, res) => {
    //method in AssetRequest to check the role, site code and event in asset master
    //verify for the roleid=2 (this is fixed)
    //verify for tag_status=1 in asset master if the tag is scanned
    await request.EventAssetRequest(req).then(async function (results) {
        if (!results.result) {
            res.end(JSON.stringify(results));
        } else {
            //method in AssetController to save the details to tagevent table
            await controller.RegisterAssetEvent(req).then(function (results) {
                res.end(JSON.stringify(results));
            });
        }
    });
});
/**
 * This is the event that will verify empty fields, role (roleid=1 in field engineer)
 * and check for site code in asset master and verify for tag_status=2 if asset is already 
 * scanned in the field
 * then it will store data in tagtracking table
 */
asset.post('/tag-track-entry', async (req, res) => {
    //method in AssetRequest page to verify role ,site code,empty fields and tag_status=2,
    await request.TrackAssetRequest(req).then(async function (results) {
        if (!results.result) {
            res.end(JSON.stringify(results));
        } else {
            //method in AssetController page to save the details of the asset from the field
            await controller.RegisterAssetTracking(req).then(function (results) {
                res.end(JSON.stringify(results));
            });
        }
    });
});
/**
 * Not in use 
 * this path gets the details of asset
 */
asset.post('/get-asset-detail', async (req, res) => {
    await request.GetAssetDetailsRequest(req).then(async function (results) {
        if (!results.result) {
            res.end(results);
        } else {
            await controller.GetAssetAfterEvent(req).then(function (results) {
                res.end(results);
            });
        }
    })
});

module.exports = asset;