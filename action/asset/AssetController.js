const othermethods = require('../../config/other/othermethods');
const database = require('../../config/database/connection');
async function ViewAsset() {

}
async function CreateAsset(req) {
    let currentdate = await othermethods.GetCurrentDate();

    let post = {
        Asset_Code: req.body.Asset_Code,
        Asset_Type: req.body.Asset_Type,
        Description: req.body.Description,
        Site_Code: req.body.Site_Code,
        Tag_Id: req.body.Tag_Id,
        Tag_Status: 0,
        Serial_Number: req.body.Serial_Number,
        Model_Number: req.body.Model_Number,
        Create_Date: currentdate,
        Modify_Date: currentdate
    };
    let query = "Insert into assetmaster set ?";
    return new Promise(function (resolve, reject) {
        database.execute_data(query, post).then(function (results) {
            if (!results.result) {
                reject(results.error);
            }
            req.flash('error', "Asset created successfully");
            resolve(true);
        });
    }).catch(function (error) {
        req.flash('error', error);
        return true;
    });
}
async function CreateAssetType(req) {
    let post = {
        Type_Code: req.body.Type_Code,
        Description: req.body.Description
    };
    let query = "Insert into typemaster set ?";
    return new Promise(function (resolve, reject) {
        database.execute_data(query, post).then(function (results) {
            if (!results.result) {
                reject(results.error);
            }
            req.flash('error', "Asset Type created successfully");
            resolve(true);
        });
    }).catch(function (error) {
        req.flash('error', error);
        return true;
    });
}
async function GetAssetType(req) {
    let typerecord = {
        Id: '',
        Type_Code: '',
        Description: ''
    }
    let arraytype = [];
    let query = "Select * from typemaster";
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let records = results.records;
                for (i = 0; i < records.length; i++) {
                    typerecord = {
                        Id: records[i].Id,
                        Type_Code: records[i].Type_Code,
                        Description: records[i].Description,
                    }
                    arraytype.push(typerecord);
                }
                resolve(arraytype);
            }
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
module.exports = {
    ViewAsset,
    CreateAsset,
    CreateAssetType,
    GetAssetType
};