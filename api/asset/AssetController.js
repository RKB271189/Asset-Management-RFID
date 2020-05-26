const database = require('../../config/database/connection');
const othermethods = require('../../config/other/othermethods');
async function GetAsset(req) {
    let array_asset = [];
    let request = {
        result: false,
        error: '',
        details: array_asset
    };
    let sitecode = req.body.Site_Code;
    let query = "Select assetmaster.*,typemaster.Description as Type_Description from assetmaster left join typemaster on assetmaster.Asset_Type=typemaster.Type_Code where Site_Code='" + sitecode + "'";
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let records = results.records;

                let len = records.length;

                for (let i = 0; i < len; i++) {
                    let data = {
                        Asset_Id: records[i].Id,
                        Asset_Code: records[i].Asset_Code,
                        Asset_Type_Code: records[i].Asset_Type_Code,
                        Type_Description: records[i].Type_Description,
                        Description: records[i].Description,
                        Site_Code: records[i].Site_Code,
                        Tag_Id: records[i].Tag_Id,
                        Tag_Status: records[i].Tag_Status,
                        Serial_Number: records[i].Serial_Number,
                        Model_Number: records[i].Model_Number,
                        Create_Date: records[i].Create_Date,
                        Modify_Date: records[i].Modify_Date
                    }
                    array_asset.push(data);
                }
                request.result = true;
                request.details = array_asset;
                resolve(request);
            }
        });
    }).catch(function (error) {
        request.error = error;
        return request;
    });
}
async function RegisterAssetEvent(req) {
    let request = {
        result: false,
        error: '',
        details: []
    }
    let currentdatetime = await othermethods.GetCurrentDate();
    let post = {
        Asset_Id: req.body.Asset_Id,
        Tag_Id: req.body.Tag_Id,
        User_Id: req.body.User_Id,
        Generate_Time: currentdatetime,
        Modify_Time: currentdatetime,
        Site_Code: req.body.Site_Code,
        Longitude: req.body.Longitude,
        Latitude: req.body.Latitude
    }
    let query = "Inert into tagevent set ?";
    return new Promise(function (resolve, reject) {
        database.execute_data(query, post).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let data = [];
                data.push(post);
                request.result = true;
                request.details = data;
                resolve(request);
            }
        });
    }).catch(function (error) {
        request.error = error;
        return request;
    })
}
async function RegisterAssetTracking(req) {
    let request = {
        result: false,
        error: '',
        details: []
    }
    let currentdatetime = await othermethods.GetCurrentDate();
    let post = {
        Track_Time: currentdatetime,
        Site_Code: req.body.Site_Code,
        Asset_Id: req.body.Asset_Id,
        Asset_Code: req.body.Asset_Code,
        Tag_Id: req.body.Tag_Id,
        User_Id: req.body.User_Id,
        Longitude: req.body.Longitude,
        Latitude: req.body.Latitude
    }
    let query = "Insert into tagtracking set ?";
    return new Promise(function (resolve, reject) {
        database.execute_data(query, post).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let data = [];
                data.push(post);
                request.details = data;
                request.result = true;
                resolve(request);
            }
        })
    }).catch(function (error) {
        request.error = error;
        return request;
    });
}
module.exports = {
    GetAsset,
    RegisterAssetEvent,
    RegisterAssetTracking
};