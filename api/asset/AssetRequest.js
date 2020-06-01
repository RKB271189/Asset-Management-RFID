const siterequest = require('../site/SiteRequest');
const verify = require('./AssetVerification');
const verifyuser = require('../user/UserVerification');
/**
 * validating when user enters site code and clicks on go
 * this will first check for the site code in sitemaster
 * and then it will check for site code in asset master
 * @param {*} req 
 * @param {*} authheader 
 * @returns json array with result=true or false
 * error=string if any empty details array if there is error
 */
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
            //checking if site code is present in sitemaster
            //it will call the method define in the site folder siteRequest page
            //from their it will go into siteVerification page and check in database
            siterequest.SiteBeginRequest(req).then(async function (results) {
                if (!results.result) {
                    reject(results.error);
                } else {
                    //checking if the site code is present in the asset master
                    //this method is define in AssetVerification page and will look 
                    //for site code in asset master
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
/**
 * This method will check for the empty fields
 * also for Role roleid=2
 * also for site code in asset master
 * and tag_staus=1 in asset master
 * @param {*} req 
 */
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
    let assetcode = req.body.Asset_Code;
    let generatetime = req.body.Generate_Time;

    return new Promise(function (resolve, reject) {
        if (!assetid) {
            reject("Provide Asset Id");
        } else if (!assetcode) {
            reject("Provide Asset Code");
        } else if (!tagid) {
            reject("Provide Tag Id");
        } else if (!userid) {
            reject("Provide User Id");
        } else if (!longitude) {
            reject("Provide Longitude");
        } else if (!latitude) {
            reject("Provide Latitude");
        } else if (!generatetime) {
            reject("Provide Generate Time");
        } else {
            //this method is in folder user UserVerification check for the user if it is having roleid=2
            verifyuser.VerifyRole(req).then(function (results) {
                if (results !== true) {
                    reject(results);
                } else {
                    //this method will check for site code in asset master
                    verify.GetPresenceSiteInAsset(sitecode).then(function (results) {
                        if (results !== true) {
                            reject(results);
                        } else {
                            //this method is to verify the presence of asset master
                            verify.GetVerifyAssetInMaster(assetid).then(function (results) {
                                if (results !== true) {
                                    reject(results);
                                } else {
                                    //this method in AssetVerification check for Tag_Status=1 in asset master
                                    //if tag_status=1 then asset is already asssigned tag
                                    verify.GetAssetEventVerifiaction(req).then(function (results) {
                                        if (results !== true) {
                                            reject(results);
                                        } else {
                                            request.result = true;
                                            resolve(request);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }).catch(function (error) {
        request.error = error;
        return request;
    });
}
/**
 * This method will check for emptyfields, role (roleid=1),site code in asset master 
 * and tag_status=2 in asset master if already scanned
 * @param {*} req 
 */
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
    let longitude = req.body.Longitude;
    let tracktime = req.body.Track_Time;
    return new Promise(function (resolve, reject) {
        if (!assetid) {
            reject("Provide Asset Id");
        } else if (!assetcode) {
            reject("Provide Asset Code");
        } else if (!tagid) {
            reject("Provide Tag Id");
        } else if (!sitecode) {
            reject("Provide Site Code");
        } else if (!userid) {
            reject("Provide User Id");
        } else if (!latitude) {
            reject("Provide Latitude");
        } else if (!longitude) {
            reject("Provide Longitude");
        } else if (!tracktime) {
            reject("Provide Track Time");
        } else {
            //method to verify role in page UserVerification it will allow if roleid=1
            verifyuser.VerifyRole(req).then(function (results) {
                if (results !== true) {
                    reject(results);
                } else {
                    //method to verify site code in asset master page AssetVerification
                    verify.GetPresenceSiteInAsset(sitecode).then(function (results) {
                        if (results !== true) {
                            reject(results);
                        } else {
                            //verifying if asset is created in master by admin
                            verify.GetVerifyAssetInMaster(assetid).then(function (results) {
                                if (results !== true) {
                                    reject(results);
                                } else {
                                    //method to check the tag_status=2 in assetmaster for already scanned
                                    //in the field
                                    verify.GetAssetTrackVerification(req).then(function (results) {
                                        if (results !== true) {
                                            reject(results);
                                        } else {
                                            request.result = true;
                                            resolve(request);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }).catch(function (error) {
        request.error = error;
        return request;
    });
}
/**
 * currently not in use
 * @param {*} req 
 */
async function GetAssetDetailsRequest(req) {
    let request = {
        result: false,
        error: '',
        details: []
    };
    return new Promise(function (resolve, reject) {
        let userid = req.body.User_Id;
        let sitecode = req.body.Site_Code;
        if (!sitecode) {
            reject("Please Provide Site Code");
        } else if (!userid) {
            reject("Please Provide User Id");
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
module.exports = {
    GetAssetRequest,
    EventAssetRequest,
    TrackAssetRequest,
    GetAssetDetailsRequest
}