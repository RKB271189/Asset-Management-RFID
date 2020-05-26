const siterequest = require('../site/SiteRequest');
const verify = require('./AssetVerification');
const authenticate = require('../../auth/authenticate');
async function GetAssetRequest(req, authheader) {
    let request = {
        result: false,
        error: '',
        details: []
    }

    return new Promise(function (resolve, reject) {
        let sitecode = req.body.Site_Code;
        if (!sitecode) {
            reject("Please provide Site Code");
        } else {
            siterequest.SiteBeginRequest(req).then(async function (results) {
                if (!results.result) {
                    reject(results.error);
                } else {
                    verify.GetPresenceSiteInAsset(sitecode).then(function (results) {
                        if (results == true) {
                            request.result = true;
                            resolve(request);
                        } else {
                            reject(results);
                        }
                    });
                }
            });
        }
    }).catch(function (error) {
        request.error = error;
        return request
    });
}

async function EventAssetRequest(req) {
    let request = {
        result: false,
        error: '',
        details: []
    }
    let assetid = req.body.Asset_Id;
    let tagid = req.body.Tag_Id;
    let userid = req.body.User_Id;
    let sitecode = req.body.Site_Code;
    let longitude = req.body.Longitude;
    let latitude = req.body.Latitude;

    return new Promise(function (resolve, reject) {
        if (!assetid) {
            reject("Provide Asset Id");
        } else if (!tagid) {
            reject("Provide Tag Id");
        } else if (!userid) {
            reject("Provide User Id");
        } else if (!longitude) {
            reject("Provide Longitude");
        } else if (!latitude) {
            reject("Provide Latitude");
        } else {
            verify.GetPresenceSiteInAsset(sitecode).then(function (results) {
                if (!results) {
                    reject(results);
                } else {
                    request.result = true;
                    resolve(request);
                }
            });
        }
    }).catch(function (error) {
        request.error = error;
        return request;
    });
}
async function TrackAssetRequest(req) {
    let request = {
        result: false,
        error: '',
        details: []
    }
    let assetid = req.body.Asset_Id;
    let sitecode = req.body.Site_Code;
    let assetcode = req.body.Asset_Code;
    let tagid = req.body.Tag_Id;
    let userid = req.body.User_Id;
    let latitude = req.body.Latitude;
    let longitude = req.body.longitude;
    return new Promise(function (resolve, reject) {
        if (!assetid) {
            reject("Provide Asset Id");
        } else if (!assetcode) {
            reject("Provide Asset Code");
        } else if (!tagid) {
            reject("Provide Tag Id");
        } else if (!sitecode) {
            reject("Provide Site Code");
        } else if (userid) {
            reject("Provide User Id");
        } else if (latitude) {
            reject("Provide Latitude");
        } else if (longitude) {
            reject("Provide Longitude");
        } else {
            verify.GetPresenceSiteInAsset(sitecode).then(function (results) {
                if (!results) {
                    reject(results);
                } else {
                    request.result = true;
                    resolve(request);
                }
            });
        }
    }).catch(function (error) {
        request.error = error;
        return false;
    });

}
module.exports = {
    GetAssetRequest,
    EventAssetRequest,
    TrackAssetRequest
}