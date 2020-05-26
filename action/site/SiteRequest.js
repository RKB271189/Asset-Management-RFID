async function CreateSiteRequest(req) {
    return new Promise(function (resolve, reject) {
        let sitecode = req.body.Site_Code;
        let sitename = req.body.Site_Name;
        let zone = req.body.Zone;
        let region = req.body.Region;
        let district = req.body.District;
        if (!sitecode) {
            reject("Site Code is mandatory");
        } else if (!sitename) {
            reject("Site Name is mandatory");
        } else if (!zone) {
            reject("Zone is mandatory");
        } else if (!region) {
            reject("Region is mandatory");
        } else if (!district) {
            reject("District is mandatory");
        } else {
            resolve(true);
        }
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}

module.exports = {
    CreateSiteRequest,
}