const othermethods = require('../../config/other/othermethods');
const database = require('../../config/database/connection');
const paginate = require('../../config/other/pagination');
async function ViewAsset() {

}
async function CreateAsset(req) {
    let currentdate = await othermethods.GetCurrentDate();
    let post = {
        Asset_Code: req.body.Asset_Code,
        Asset_Type: req.body.Asset_Type,
        Description: req.body.Description,
        Site_Code: req.body.Site_Code,
        Tag_Id: '',
        Tag_Status: 0,
        Serial_Number: req.body.Serial_Number,
        Model_Number: req.body.Model_Number,
        Create_Date: currentdate,
        Modify_Date: currentdate,
        Responsible_Warehouse: req.body.Responsible_Warehouse
    };
    let query = "Insert into assetmaster set ?";
    return new Promise(function (resolve, reject) {
        database.execute_data(query, post).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                req.flash('error', "Asset created successfully");
                resolve(true);
            }
        });
    }).catch(function (error) {
        req.flash('error', error);
        return true;
    });
}
async function CreateAssetType(req) {
    let lifemonth = req.body.Life_Month;
    if (!lifemonth)
        lifemonth = '';
    let post = {
        Type_Code: req.body.Type_Code,
        Description: req.body.Description,
        Life_Month: lifemonth
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
async function UpdateAsset(req) {
    return new Promise(function (resolve, reject) {
        let sitecode = req.body.Site_Code;
        let assetid = req.body.Asset_Id;
        let assetcode = req.body.Asset_Code;
        let description = req.body.Description;
        let modelnumber = req.body.Model_Number;
        let serialnumber = req.body.Serial_Number;
        let assettype = req.body.Asset_Type;
        let responsiblewarehouse = req.body.Responsible_Warehouse;
        let query = "update assetmaster set Site_Code='" + sitecode + "',Asset_Code=" + assetcode + ",Asset_Type='" + assettype + "',Description='" + description + "',Model_Number='" + modelnumber + "',Serial_Number='" + serialnumber + "',Responsible_Warehouse='" + responsiblewarehouse + "',Tag_Status=0 where Id=" + assetid + "";
        database.update_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                req.flash('error', "Asset updated successfully");
                resolve(true);
            }
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function DeleteAsset(req) {
    return new Promise(function (resolve, reject) {
        let assetid = req.query.asset;
        let sitecode = req.query.site;
        let query = "Delete from assetmaster where Id=" + assetid + " and Site_Code='" + sitecode + "'";
        database.update_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                req.flash('error', "Asset deleted succesfully");
                resolve(true);
            }
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function GetAssetDetails(req) {
    let sitecode = req.body.Site_Code;
    let array_asset = [];
    let query = "Select assetmaster.*,assetmaster.Id as Asset_Id,assetmaster.Description as AssetDescription,typemaster.Description as Type_Description,tagevent.Generate_Time,tagtracking.Track_Time from assetmaster inner join typemaster on assetmaster.Asset_Type=typemaster.Type_Code left join tagevent on tagevent.Site_Code=assetmaster.Site_Code left join tagtracking on tagtracking.Site_Code=assetmaster.Site_Code where assetmaster.Site_Code='" + sitecode + "' group by assetmaster.Id";
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(async function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let records = results.records;
                let len = records.length;
                if (len === 0) {
                    reject("No records found for this site");
                } else {
                    for (let i = 0; i < len; i++) {
                        let crtdate = records[i].Create_Date;
                        let gendate = records[i].Generate_Time;
                        let trackdate = records[i].Track_Time;
                        if (!crtdate || crtdate == null) {
                            crtdate = '';
                        } else {
                            crtdate = await othermethods.FormatDate(crtdate);
                        }
                        if (!gendate || gendate == null) {
                            gendate = '';
                        } else {
                            gendate = await othermethods.FormatDate(gendate);
                        }
                        if (!trackdate || trackdate == null) {
                            trackdate = '';
                        } else {
                            trackdate = await othermethods.FormatDate(trackdate);
                        }
                        let data = {
                            Asset_Id: records[i].Asset_Id,
                            Site_Code: records[i].Site_Code,
                            Asset_Code: records[i].Asset_Code,
                            Description: records[i].AssetDescription,
                            Type_Description: records[i].Type_Description,
                            Tag_Id: records[i].Tag_Id,
                            Tag_Status: records[i].Tag_Status,
                            Serial_Number: records[i].Serial_Number,
                            Model_Number: records[i].Model_Number,
                            Responsible_Warehouse: records[i].Responsible_Warehouse,
                            Generate_Time: gendate,
                            Track_Time: trackdate,
                            Create_Date: crtdate
                        }
                        array_asset.push(data);
                    }
                    resolve(array_asset);
                }
            }
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function GetAssetDetailsOnUpdate(req) {
    return new Promise(function (resolve, reject) {
        let assetid = req.query.asset;
        let sitecode = req.query.site;
        let query = "Select * from assetmaster where Id=" + assetid + " and Site_Code='" + sitecode + "' limit 1";
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let records = results.records;
                let len = records.length;
                if (len === 1) {
                    let data = {
                        Asset_Id: records[0].Id,
                        Site_Code: records[0].Site_Code,
                        Model_Number: records[0].Model_Number,
                        Serial_Number: records[0].Serial_Number,
                        Description: records[0].Description,
                        Asset_Code: records[0].Asset_Code,
                        Asset_Type: records[0].Asset_Type,
                        Responsible_Warehouse: records[0].Responsible_Warehouse
                    };
                    req.flash('asset', data);
                    resolve(true);
                } else {
                    reject("Something went wrong..Please try again");
                }
            }
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function GetAsssetEventDetails(req, page = 0) {
    let query = "";
    let pagelink = "";
    let count = 0;
    if (page == 0) {
        count = await GetEventCount(req);
        query = await MakeEventQuery(req);
    } else {
        count = req.session['eventcount'];
    }
    count = parseInt(count);
    if (count !== 0) {
        return new Promise(async function (resolve, reject) {
            let params = {
                "page": page,
                "count": count
            }
            pagelink = await GetEventPaginate(params, req);
            query = req.session["query"];
            database.fetch_data(query).then(async function (results) {
                if (!results.result) {
                    reject(results.error);
                } else {
                    let records = results.records;
                    let len = records.length;
                    let array_asset = [];
                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            let gendate = await othermethods.FormatDate(records[i].Generate_Time)
                            let data = {
                                Site_Code: records[i].Site_Code,
                                Asset_Code: records[i].Asset_Code,
                                Type_Description: records[i].Type_Description,
                                Asset_Description: records[i].Asset_Description,
                                Tag_Id: records[i].Tag_Id,
                                Serial_Number: records[i].Serial_Number,
                                Model_Number: records[i].Model_Number,
                                Generate_Time: gendate,
                                Longitude: records[i].Longitude,
                                Latitude: records[i].Latitude,
                                Login_Id: records[i].Login_Id,
                                First_Name: records[i].First_Name
                            }
                            array_asset.push(data);
                        }
                        req.flash('event', array_asset);
                        req.flash('link', pagelink);
                        resolve(true);
                    } else {
                        reject("Sorry..No records found");
                    }
                }
            });
        }).catch(function (error) {
            req.flash('error', error);
            return false;
        });
    } else {
        req.flash('error', "Sorry..No records found");
        return false;
    }
}
/**
 * Below is the method to get Event Details Paging and Query
 */
async function MakeEventQuery(req) {
    let assetcode = req.body.Asset_Code;
    let startdate = req.body.Start_Date;
    let enddate = req.body.End_Date;
    let sitecode = req.body.Site_Code;
    let assetid = 0;
    let query = "Select assetmaster.Model_Number,assetmaster.Serial_Number,typemaster.Description as Type_Description,assetmaster.Asset_Code as Asset_Code,assetmaster.Description as Asset_Description,tagevent.Tag_Id as Tag_Id,tagevent.Generate_Time,tagevent.Modify_Time,tagevent.Site_Code,Longitude,Latitude,usermaster.Login_Id,usermaster.First_Name from tagevent inner join assetmaster on tagevent.Asset_Id=assetmaster.Id left join typemaster on assetmaster.Asset_Type=typemaster.Type_Code left join usermaster on tagevent.User_Id=usermaster.User_Id where";
    if (assetcode) {
        assetid = await GetAssetId(assetcode);
        if (assetid == 0) {
            query = query + " tagevent.Asset_Code='" + assetcode + "' and";
        } else {
            query = query + " tagevent.Asset_Id='" + assetid + "' and";
        }
    }
    if (startdate) {
        let dt = startdate;
        startdate = startdate + " 00:00:00";
        query = query + " Generate_Time between '" + startdate + "' and ";
        if (enddate) {
            enddate = enddate + " 23:59:59";
            query = query + "'" + enddate + "' and";

        } else {
            enddate = dt + " 23:59:59";
            query = query + "'" + enddate + "' and";
        }
    }
    if (sitecode) {
        query = query + " tagevent.Site_Code='" + sitecode + "' and";
    }
    query = query.substring(0, query.length - 4);
    query = query + " order by Generate_Time Desc";
    req.session["query"] = query;
    return query;
}
async function GetEventCount(req) {
    let assetcode = req.body.Asset_Code;
    let startdate = req.body.Start_Date;
    let enddate = req.body.End_Date;
    let sitecode = req.body.Site_Code;
    let assetid = 0;
    let query = "Select count(*) as EventCount from tagevent inner join assetmaster on tagevent.Asset_Id=assetmaster.Id left join typemaster on assetmaster.Asset_Type=typemaster.Type_Code left join usermaster on tagevent.User_Id=usermaster.User_Id where";
    if (assetcode) {
        assetid = await GetAssetId(assetcode);
        if (assetid == 0) {
            query = query + " tagevent.Asset_Code='" + assetcode + "' and";
        } else {
            query = query + " tagevent.Asset_Id='" + assetid + "' and";
        }
    }
    if (startdate) {
        let dt = startdate;
        startdate = startdate + " 00:00:00";
        query = query + " Generate_Time between '" + startdate + "' and ";
        if (enddate) {
            enddate = enddate + " 23:59:59";
            query = query + "'" + enddate + "' and";

        } else {
            enddate = dt + " 23:59:59";
            query = query + "'" + enddate + "' and";
        }
    }
    if (sitecode) {
        query = query + " tagevent.Site_Code='" + sitecode + "' and";
    }
    query = query.substring(0, query.length - 4);
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let records = results.records;
                let count = records[0].EventCount;
                req.session["eventcount"] = count;
                resolve(count);
            }
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    })
}
async function GetEventPaginate(params, req) {
    let currentpage = 1;
    let perpage = 10;
    let count = params["count"];
    let pageuri = '/web/asset/fetch-event-search/';
    let page = params['page'];
    pageid = parseInt(page);
    currentpage = pageid > 0 ? pageid : currentpage;
    const Paginate = new paginate(count, currentpage, pageuri, perpage);
    let query = req.session["query"];
    if (query.includes("limit")) {
        query = query.substring(0, query.indexOf('limit'));
        req.session["query"] = query + " limit " + Paginate.perPage + " OFFSET " + Paginate.offset + "";
    } else {
        req.session["query"] = req.session["query"] + " limit " + Paginate.perPage + " OFFSET " + Paginate.offset + "";
    }

    return Paginate.links();
}
async function GetAssetId(assetcode) {
    return new Promise(function (resolve, reject) {
        let query = "Select Id from assetmaster where Asset_Code='" + assetcode + "' limit 1;"
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error)
            } else {
                let records = results.records;
                if (records.length === 0) {
                    resolve(0);
                } else {
                    let assetid = records[0].Id;
                    resolve(assetid);
                }
            }
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    })
}
async function GetTrackDetails(req, page = 0) {
    let query = "";
    let count = 0;
    let pagelink = "";
    if (page == 0) {
        count = await GetTrackCount(req);
        query = await MakeTrackQuery(req);
    } else {
        count = req.session['trackcount'];
    }
    count = parseInt(count);
    if (count !== 0) {
        return new Promise(async function (resolve, reject) {
            let params = {
                "page": page,
                "count": count
            };
            pagelink = await GetTrackPaginate(params, req);
            query = req.session["query"];
            database.fetch_data(query).then(async function (results) {
                if (!results.result) {
                    reject(results.error);
                } else {
                    let records = results.records;
                    let len = records.length;
                    let array_asset = [];
                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            let gendate = await othermethods.FormatDate(records[i].Generate_Time);
                            let trackdate = await othermethods.FormatDate(records[i].Track_Time);
                            let data = {
                                Site_Code: records[i].Site_Code,
                                Track_Time: trackdate,
                                Asset_Code: records[i].Asset_Code,
                                Type_Description: records[i].Type_Description,
                                Asset_Description: records[i].Asset_Description,
                                Tag_Id: records[i].Tag_Id,
                                Serial_Number: records[i].Serial_Number,
                                Model_Number: records[i].Model_Number,
                                Generate_Time: gendate,
                                Longitude: records[i].Track_Longitude,
                                Latitude: records[i].Track_Latitude,
                                Login_Id: records[i].Login_Id,
                                First_Name: records[i].First_Name
                            }
                            array_asset.push(data);
                        }
                        req.flash('track', array_asset);
                        req.flash('link', pagelink);
                        resolve(true);
                    } else {
                        reject("Sorry..No records found");
                    }
                }
            });
        }).catch(function (error) {
            req.flash('error', error);
            return false;
        });
    } else {
        req.flash('error', "Sorry..No records found");
        return false;
    }
}
async function MakeTrackQuery(req) {
    let assetcode = req.body.Asset_Code;
    let startdate = req.body.Start_Date;
    let enddate = req.body.End_Date;
    let sitecode = req.body.Site_Code;
    let assetid = 0;
    let query = "select assetmaster.Tag_Id,assetmaster.Site_Code,assetmaster.Asset_Code,assetmaster.Model_Number,assetmaster.Serial_Number,tagtracking.Track_Time,assetmaster.Description as Asset_Description,typemaster.Description as Type_Description,tagevent.Generate_Time,tagtracking.Longitude as Track_Longitude,tagtracking.Latitude as Track_Latitude,usermaster.Login_Id,usermaster.First_Name from tagtracking inner join assetmaster on tagtracking.Asset_Id=assetmaster.Id inner join tagevent on tagtracking.Asset_Id=tagevent.Asset_Id left join usermaster on tagtracking.User_Id=usermaster.User_Id left join typemaster on assetmaster.Asset_Type=typemaster.Type_Code where";
    if (assetcode) {
        assetid = await GetAssetId(assetcode);
        if (assetid == 0) {
            query = query + " tagtracking.Asset_Code='" + assetcode + "' and";
        } else {
            query = query + " tagtracking.Asset_Id='" + assetid + "' and";
        }
    }
    if (startdate) {
        let dt = startdate;
        startdate = startdate + " 00:00:00";
        query = query + " Track_Time between '" + startdate + "' and ";
        if (enddate) {
            enddate = enddate + " 23:59:59";
            query = query + "'" + enddate + "' and";

        } else {
            enddate = dt + " 23:59:59";
            query = query + "'" + enddate + "' and";
        }
    }
    if (sitecode) {
        query = query + " tagtracking.Site_Code='" + sitecode + "' and";
    }
    query = query.substring(0, query.length - 4);
    req.session["query"] = query;
    return query;
}
async function GetTrackCount(req) {
    let assetcode = req.body.Asset_Code;
    let startdate = req.body.Start_Date;
    let enddate = req.body.End_Date;
    let sitecode = req.body.Site_Code;
    let assetid = 0;
    let query = "Select count(*) as TrackCount from tagtracking inner join assetmaster on tagtracking.Asset_Id=assetmaster.Id inner join tagevent on tagtracking.Asset_Id=tagevent.Asset_Id left join usermaster on tagtracking.User_Id=usermaster.User_Id left join typemaster on assetmaster.Asset_Type=typemaster.Type_Code where";
    if (assetcode) {
        assetid = await GetAssetId(assetcode);
        if (assetid == 0) {
            query = query + " tagtracking.Asset_Code='" + assetcode + "' and";
        } else {
            query = query + " tagtracking.Asset_Id='" + assetid + "' and";
        }
    }
    if (startdate) {
        let dt = startdate;
        startdate = startdate + " 00:00:00";
        query = query + " Track_Time between '" + startdate + "' and ";
        if (enddate) {
            enddate = enddate + " 23:59:59";
            query = query + "'" + enddate + "' and";

        } else {
            enddate = dt + " 23:59:59";
            query = query + "'" + enddate + "' and";
        }
    }
    if (sitecode) {
        query = query + " tagtracking.Site_Code='" + sitecode + "' and";
    }
    query = query.substring(0, query.length - 4);
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let records = results.records;
                let count = records[0].TrackCount;
                req.session["trackcount"] = count;
                resolve(count);
            }
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function GetTrackPaginate(params, req) {
    let currentpage = 1;
    let perpage = 10;
    let count = params["count"];
    let pageuri = '/web/asset/fetch-track-search/';
    let page = params['page'];
    pageid = parseInt(page);
    currentpage = pageid > 0 ? pageid : currentpage;
    const Paginate = new paginate(count, currentpage, pageuri, perpage);
    let query = req.session["query"];
    if (query.includes("limit")) {
        query = query.substring(0, query.indexOf('limit'));
        req.session["query"] = query + " limit " + Paginate.perPage + " OFFSET " + Paginate.offset + "";
    } else {
        req.session["query"] = req.session["query"] + " limit " + Paginate.perPage + " OFFSET " + Paginate.offset + "";
    }

    return Paginate.links();
}
module.exports = {
    ViewAsset,
    CreateAsset,
    CreateAssetType,
    GetAssetType,
    GetAssetDetails,
    GetAsssetEventDetails,
    GetTrackDetails,
    GetAssetDetailsOnUpdate,
    UpdateAsset,
    DeleteAsset
};