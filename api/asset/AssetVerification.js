const database = require('../../config/database/connection');

/**
 * method to verify site code in asset master
 * @param {*} Site_Code 
 */
async function GetPresenceSiteInAsset(Site_Code) {
    let query = "Select count(*) as SiteCount from assetmaster where Site_Code='" + Site_Code + "'";
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let records = results.records;
                let count = records[0].SiteCount;
                if (count === 0 || typeof count == 'undefined') {
                    reject("Site Code is not present in the asset system: contact admin");
                } else {
                    resolve(true);
                }
            }
        });
    }).catch(function (error) {
        return error;
    });

}
/**
 * method to verify tag_status=1 in asset master for already scanned by roleid=2 (at ware house)
 * with asset id and site code
 * @param {*} req 
 */
async function GetAssetEventVerifiaction(req) {
    let assetid = req.body.Asset_Id;
    let sitecode = req.body.Site_Code;
    let query = "select count(*) as EventCount from assetmaster where Tag_Status=1 and Id='" + assetid + "' and Site_Code='" + sitecode + "' limit 1";
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.result);
            } else {
                let records = results.records;
                let count = records[0].EventCount;
                if (count === 0) {
                    resolve(true);
                } else {
                    reject("The tag for asset is already scanned and written");
                }
            }
        });
    }).catch(function (error) {
        return error;
    });
}
/**
 * method to check if asset is already scanned at the outlet with tag_status=2 in asset master
 * and roleid=1 (in the field or by field engineer)
 * @param {*} req 
 */
async function GetAssetTrackVerification(req) {
    let assetid = req.body.Asset_Id;
    let sitecode = req.body.Site_Code;
    let query = "select count(*) as TrackCount from assetmaster where Tag_Status=2 and Id='" + assetid + "' and Site_Code='" + sitecode + "' limit 1";
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.result);
            } else {
                let records = results.records;
                let count = records[0].TrackCount;
                if (count === 0) {
                    resolve(true);
                } else {
                    resolve(true);
                }
            }
        });
    }).catch(function (error) {
        return error;
    });
}
/**
 * Verifying the presence of asset id in asset master
 * @param {*} assetid 
 */
async function GetVerifyAssetInMaster(assetid) {
    let query = "select count(*) as AssetCount from assetmaster where Id=" + assetid + "";
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.result);
            } else {
                let records = results.records;
                let count = records[0].AssetCount;
                if (count == 0) {
                    reject("Asset Code not available contact:admin");
                } else {
                    resolve(true);
                }
            }
        });
    }).catch(function (error) {
        return error;
    });
}
module.exports = {
    GetPresenceSiteInAsset,
    GetAssetEventVerifiaction,
    GetAssetTrackVerification,
    GetVerifyAssetInMaster
}