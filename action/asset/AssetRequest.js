async function CreateAssetRequest(req) {
    return new Promise(function (resolve, reject) {
        let assetcode = req.body.Asset_Code;
        let assettype = req.body.Asset_Type;
        let description = req.body.Description;
        let sitecode = req.body.Site_Code;
        // let tagid = req.body.Tag_Id;
        let responsiblewarehouse = req.body.Responsible_Warehouse;

        if (!assetcode) {
            reject("Asset Code is mandatory");
        } else if (!assettype) {
            reject("Asset Type is mandatory")
        } else if (!description) {
            reject("Description is mandatory");
        } else if (!sitecode) {
            reject("Site Code is mandatory");
        } else if (!responsiblewarehouse) {
            reject("Responsible warehouse is mandatory");
        }else {
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

async function GetAssetEventRequest(req) {
    let assetcode = req.body.Asset_Code;
    let startdate = req.body.Start_Date;
    let enddate = req.body.End_Date;
    let sitecode = req.body.Site_Code;
    let ifonefill = false;
    return new Promise(function (resolve, reject) {
        if (assetcode) {
            ifonefill = true;
        } else if (startdate) {
            ifonefill = true;
        } else if (enddate) {
            if (!startdate) {
                ifonefill = false;
                reject("Please select Start Date");
            } else {
                ifonefill = true;
            }
        } else if (sitecode) {
            ifonefill = true;
        }
        if (!ifonefill) {
            reject("Please provide atleast one filter");
        } else {
            resolve(true);
        }
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function GetAssetTrackRequest(req) {
    return new Promise(function (resolve, reject) {
        let assetcode = req.body.Asset_Code;
        let startdate = req.body.Start_Date;
        let enddate = req.body.End_Date;
        let sitecode = req.body.Site_Code;
        let ifonefill = false;
        if (assetcode) {
            ifonefill = true;
        } else if (startdate) {
            ifonefill = true;
        } else if (enddate) {
            if (!startdate) {
                ifonefill = false;
                reject("Please provide Start Date");
            } else {
                ifonefill = true;
            }
        } else if (sitecode) {
            ifonefill = true
        }
        if (!ifonefill) {
            reject("Please provide atleast one detail");
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
    CreateAssetTypeRequest,
    GetAssetEventRequest,
    GetAssetTrackRequest
}