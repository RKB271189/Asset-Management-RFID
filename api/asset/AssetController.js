const database = require('../../config/database/connection');
const othermethods = require('../../config/other/othermethods');
/**
 * method to fetch asset details but according to login
 * if login is with roleid=2 then it is at ware house
 * if login is with roleid=1 then it is at outlet
 * if login is with roleid=101 then it is developer
 * @param {*} req 
 */
async function GetAsset(req) {
    let array_asset = [];
    let request = {
        result: false,
        error: '',
        details: array_asset
    };
    let sitecode = req.body.Site_Code;
    let userid = req.body.User_Id;
    return new Promise(function (resolve, reject) {
        //checking the role of the user
        let query = "Select Role_Id,rolelist.Role_Name from usermaster inner join rolelist on usermaster.Role_Id=rolelist.Role_Code where usermaster.User_Id='" + userid + "' limit 1";
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let records = results.records;
                let roleid = records[0].Role_Id;
                //getting asset details according to user role
                query = "";
                if (roleid === 1) {
                    query = "Select assetmaster.*,typemaster.Description as Type_Description from assetmaster left join typemaster on assetmaster.Asset_Type=typemaster.Type_Code where Site_Code='" + sitecode + "' and (Tag_Status is null or Tag_Status = 0)";
                } else if (roleid === 2) {
                    query = "Select assetmaster.*,typemaster.Description as Type_Description from assetmaster left join typemaster on assetmaster.Asset_Type=typemaster.Type_Code where Site_Code='" + sitecode + "' and Tag_Status=1";
                } else if (roleid === 101) {
                    query = "Select assetmaster.*,typemaster.Description as Type_Description from assetmaster left join typemaster on assetmaster.Asset_Type=typemaster.Type_Code where Site_Code='" + sitecode + "' and (Tag_Status is null or Tag_Status = 0)";
                }
                //if the role is assign for outlet or warehouse or developer
                if (roleid === 1 || roleid === 101 || roleid === 2) {
                    database.fetch_data(query).then(async function (results) {
                        if (!results.result) {
                            reject(results.error);
                        } else {
                            let records = results.records;

                            let len = records.length;

                            let crtdate = '';
                            let moddate = '';
                            for (let i = 0; i < len; i++) {
                                crtdate = records[i].Create_Date;
                                if (!crtdate || crtdate == null)
                                    crtdate = ''
                                else
                                    crtdate = await othermethods.AppFormatDate(crtdate);

                                moddate = records[i].Modify_Date;
                                if (!moddate || moddate == null)
                                    moddate = '';
                                else
                                    moddate = await othermethods.AppFormatDate(moddate);
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
                                    Create_Date: crtdate,
                                    Modify_Date: moddate,
                                    Responsible_Warehouse: records[i].Responsible_Warehouse
                                };
                                array_asset.push(data);
                            }
                            request.result = true;
                            request.details = array_asset;
                            resolve(request);
                        }
                    });
                } else {
                    reject("You are not authorize to view this details");
                }
            }
        });
    }).catch(function (error) {
        request.error = error;
        return request;
    });
}
/**
 * method to save the details of the asset when scanned at warehouse
 * @param {*} req 
 */
async function RegisterAssetEvent(req) {
    let request = {
        result: false,
        error: '',
        details: []
    }
    let currentdatetime = await othermethods.GetCurrentDate();
    let gentime = await othermethods.AppFormatDate(req.body.Generate_Time);
    let post = {
        Asset_Id: req.body.Asset_Id,
        Asset_Code: req.body.Asset_Code,
        Tag_Id: req.body.Tag_Id,
        User_Id: req.body.User_Id,
        Generate_Time: gentime,
        Modify_Time: currentdatetime,
        Site_Code: req.body.Site_Code,
        Longitude: req.body.Longitude,
        Latitude: req.body.Latitude
    }
    //inseritng details into tagevent table
    let query = "Insert into tagevent set ?";
    return new Promise(function (resolve, reject) {
        database.execute_data(query, post).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                //updating asset master for the first scan or scanned at ware house
                query = "update assetmaster set Tag_Status=1,Tag_Id='" + post.Tag_Id + "' where Site_Code='" + post.Site_Code + "' and Id='" + post.Asset_Id + "'";
                database.update_data(query).then(function (results) {
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
            }
        });
    }).catch(function (error) {
        request.error = error;
        return request;
    })
}
/**
 * method to save details of asset tracked at outlet
 * with taking care of the user role and asset already scanned
 * @param {*} req 
 */
async function RegisterAssetTracking(req) {
    let request = {
        result: false,
        error: '',
        details: []
    }
    //let currentdatetime = await othermethods.GetCurrentDate();
    let tracktime = await othermethods.AppFormatDate(req.body.Track_Time);
    let post = {
        Track_Time: tracktime,
        Site_Code: req.body.Site_Code,
        Asset_Id: req.body.Asset_Id,
        Asset_Code: req.body.Asset_Code,
        Tag_Id: req.body.Tag_Id,
        User_Id: req.body.User_Id,
        Longitude: req.body.Longitude,
        Latitude: req.body.Latitude
    }
    //insert asset details in tagtracking table
    let query = "Insert into tagtracking set ?";
    return new Promise(function (resolve, reject) {
        database.execute_data(query, post).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                //update assetmaster with tag_status=2 if is scanned at outlet and 
                //by roleid=1 scanned at outlet
                query = "update assetmaster set Tag_Status=2 where Site_Code='" + post.Site_Code + "' and Id='" + post.Asset_Id + "'";
                database.update_data(query).then(function (results) {
                    if (!results.result) {
                        reject(results.error);
                    } else {
                        let data = [];
                        data.push(post);
                        request.details = data;
                        request.result = true;
                        resolve(request);
                    }
                });
            }
        })
    }).catch(function (error) {
        request.error = error;
        return request;
    });
}
async function GetAssetAfterEvent(req) {
    let request = {
        result: false,
        error: '',
        details: []
    }
    let array_asset = [];
    let sitecode = req.body.Site_Code;
    let userid = req.body.User_Id;

    let query = "Select Role_Id,rolelist.Role_Name from usermaster inner join rolelist on usermaster.Role_Id=rolelist.Role_Code where usermaster.User_Id='" + userid + "' limit 1"

    database.fetch_data(query).then(function (results) {
        if (!results.result) {
            reject(results.error);
        } else {
            let records = results.records;
            let roleid = records[0].Role_Id;
            if (roleid === 1) {
                query = "Select assetmaster.*,typemaster.Description as Type_Description from assetmaster left join typemaster on assetmaster.Asset_Type=typemaster.Type_Code where Site_Code='" + sitecode + "' and Tag_Status=1";
            } else {
                query = "Select assetmaster.*,typemaster.Description as Type_Description from assetmaster left join typemaster on assetmaster.Asset_Type=typemaster.Type_Code where Site_Code='" + sitecode + "' and Tag_Status=2";
            }
            database.fetch_data(query).then(async function (results) {
                if (!results.result) {
                    reject(results.error)
                } else {
                    let records = results.records;
                    let len = records.len;
                    let moddate = '';
                    let crtdate = '';
                    for (let i = 0; i < len; i++) {
                        crtdate = records[i].Create_Date;
                        if (!crtdate || crtdate == null)
                            crtdate = '';
                        else
                            crtdate = await othermethods.AppFormatDate(crtdate);

                        moddate = records[i].Modify_Date;
                        if (!moddate || moddate == null)
                            moddate = '';
                        else
                            moddate = await othermethods.AppFormatDate(moddate);
                        moddate = records[i].Modify_Date;
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
                            Create_Date: crtdate,
                            Modify_Date: moddate,
                            Responsible_Warehouse: records[i].Responsible_Warehouse
                        };
                        array_asset.push(data);
                    }
                    request.result = true;
                    request.details = array_asset;
                    resolve(request);
                }
            });
        }
    });
}
module.exports = {
    GetAsset,
    RegisterAssetEvent,
    RegisterAssetTracking,
    GetAssetAfterEvent
};