const othermethods = require('../../config/other/othermethods');
const database = require('../../config/database/connection');
async function CreateSite(req) {
    let currentdate = await othermethods.GetCurrentDate();
    let sitename = req.body.Site_Name;
    let zone = req.body.Zone;
    let region = req.body.Region;
    let district = req.body.District;
    let state = req.body.State;
    if (state) {
        state = state.toUpperCase();
    } else {
        state = "";
    }
    let city = req.body.City;
    if (city) {
        city = city.toUpperCase();
    } else {
        city = "";
    }
    let post = {
        Site_Code: req.body.Site_Code,
        Site_Name: sitename.toUpperCase(),
        Zone: zone.toUpperCase(),
        Region: region.toUpperCase(),
        District: district.toUpperCase(),
        State: state,
        City: city,
        Address1: req.body.Address1,
        Address2: req.body.Address2,
        Create_Date: currentdate,
        Modify_Date: currentdate
    };
    let qurey = "Insert into sitemaster set ?";
    return new Promise(function (resolve, reject) {
        database.execute_data(qurey, post).then(function (results) {
            if (!results.result) {
                reject(results.error);
            }
            req.flash('error', 'Site Created Successfully');
            resolve(true);
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function VerifySiteCode(Site_Code, req) {
    let qurey = "Select count(*) as SiteCount from sitemaster where Site_Code='" + Site_Code + "'"
    return new Promise(function (resolve, reject) {
        database.fetch_data(qurey).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let records = results.records;
                let count = records[0].SiteCount;
                if (count == 1) {
                    resolve(true);
                } else {
                    reject("Site Not Found");
                }

            }
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });

}
async function GetSiteList(req) {
    let qurey = "Select * from sitemaster";
    return new Promise(function (resolve, reject) {
        database.fetch_data(qurey).then(function (results) {
            if (!results.result) {
                reject(results.error)
            } else {
                let array_site = [];
                let records = results.records;
                let len = records.length;
                for (let i = 0; i < len; i++) {
                    let details = {
                        Site_Id: records[i].Id,
                        Site_Code: records[i].Site_Code,
                        Site_Name: records[i].Site_Name,
                        Zone:records[i].Zone,
                        Region:records[i].Region                        
                    };
                    array_site.push(details);
                }
                resolve(array_site);
            }
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function DeleteSite(siteid, req) {
    return new Promise(function (resolve, reject) {
        let qurey = "Delete from sitemaster where Id='" + siteid + "'";
        database.execute_data(qurey).then(function (results) {
            if (!results.result) {
                reject(results.error)
            } else {
                req.flash('error', 'Site Deleted Successfully');
                resolve(true);
            }
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
module.exports = {
    CreateSite,
    VerifySiteCode,
    GetSiteList,
    DeleteSite
}