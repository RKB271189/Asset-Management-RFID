async function CreateAssetRequest(req) {
    return new Promise(function (resolve, reject) {
        let assetcode = req.body.Asset_Code;
        let assettype = req.body.Asset_Type;
        let description = req.body.Description;
        let sitecode = req.body.Site_Code;
        let tagid = req.body.Tag_Id;

        if (!assetcode) {
            reject("Asset Code is mandatory");
        } else if (!assettype) {
            reject("Asset Type is mandatory")
        } else if (!description) {
            reject("Description is mandatory");
        } else if (!sitecode) {
            reject("Site Code is mandatory");
        } else if (!tagid) {
            reject("Tag Id is mandatory");
        } else {
            resolve(true);
        }
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function CreateAssetTypeRequest(req) {
    return new Promise(function (resolve, reject) {
        let typecode = req.body.Type_Code;
        let description = req.body.Description;
        if (!typecode) {
            reject("Type Code is mandatory");
        } else if (!description) {
            reject("Description is mandatory");
        } else {
            resolve(true);
        }
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
module.exports = {
    CreateAssetRequest,
    CreateAssetTypeRequest
}