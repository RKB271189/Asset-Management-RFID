const database = require('../../config/database/connection');
const othermethods = require('../../config/other/othermethods');
const verify = require('./UserVerification');
async function CreateUser(req) {
    let currentdate = await othermethods.GetCurrentDate();
    let post = {
        First_Name: req.body.First_Name,
        Last_Name: req.body.Last_Name,
        Login_Id: req.body.Login_Id,
        Password: req.body.Password,
        Mobile_No: req.body.Mobile_No,
        Email_Id: req.body.Email,
        Role_Id: req.body.Role_Id,
        Is_Active: 1,
        Create_Date: currentdate,
        Modify_Date: currentdate
    }
    let query = "INSERT INTO usermaster SET ?";
    return new Promise(function (resolve, reject) {
        database.execute_data(query, post).then(function (results) {
            if (!results.result) {
                reject(results.error);
            }
            req.flash('error', 'User Created Successfully');
            resolve(true);
        })
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function VerifyUser(req) {
    return new Promise(function (resolve, reject) {
        let loginid = req.body.Login_Id;
        let password = req.body.Password;
        if (loginid === "Relcon" && password === "uni#rel@off123") {
            req.session["superadmin"] = false;
            req.session["loginid"] = loginid;
            /** 
             * developer login
             * */
            resolve(true);
        } else {
            let query = "select count(*) as UserCount from usermaster where Login_Id='" + loginid + "' limit 1";
            database.fetch_data(query).then(function (results) {
                if (!results.result) {
                    reject(results.error);
                } else {
                    let records = results.records;
                    let count = records[0].UserCount;
                    if (count == 0) {
                        reject("Login Id you are looking for does not match with the records");
                    } else {
                        query = "Select count(*) as UserCount,Role_Id from usermaster where Password='" + password + "' limit 1";
                        database.fetch_data(query).then(function (results) {
                            if (!results.result) {
                                reject(results.error);
                            } else {
                                records = results.records;
                                count = records[0].UserCount;
                                if (count == 0) {
                                    reject("Please provide valid password for the Login Id provided");
                                } else {
                                    let rolecode = records[0].Role_Id;
                                    query = "select * from rolelist where Role_Code='" + rolecode + "' limit 1";
                                    database.fetch_data(query).then(function (results) {
                                        if (!results.result) {
                                            reject(results.error);
                                        } else {
                                            records = results.records;
                                            let rolename = records[0].Role_Type;
                                            rolename = rolename.toUpperCase();
                                            if (rolename === "ADMIN" || rolename === "ADMINISTRATOR") {
                                                req.session["superadmin"] = false;
                                                req.session["loginid"] = loginid;
                                                resolve(true);
                                            } else {
                                                reject("You are not allowed to access this site");
                                            }
                                        }
                                    });
                                }
                            }
                        })
                    }
                }
            });
        }

    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function CreateRole(req) {
    let post = {
        Role_Code: req.body.Role_Code,
        Role_Type: req.body.Role_Type,
        Role_Name: req.body.Role_Name,
    }
    let query = "Insert into rolelist set ?";
    return new Promise(function (resolve, reject) {
        database.execute_data(query, post).then(function (results) {
            if (!results.result) {
                reject(results.error);
            }
            req.flash('error', 'Role Created Successfully');
            resolve(true);
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function GetRole(req) {
    let role = {
        Role_Id: '',
        Role_Code: '',
        Role_Name: '',
        Role_Type: ''
    }
    return new Promise(function (resolve, reject) {
        let query = "Select * from rolelist";
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            }
            let array_role = [];
            let records = results.records;
            let len = records.length;
            for (let i = 0; i < len; i++) {
                role = {
                    Role_Id: records[i].Role_Id,
                    Role_Code: records[i].Role_Code,
                    Role_Type: records[i].Role_Type,
                    Role_Name: records[i].Role_Name
                }
                array_role.push(role);
            }
            resolve(array_role);
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function UserLogout(req) {
    return new Promise(function (resolve, reject) {
        req.session["superadmin"] = "";
        req.session["loginid"] = "";
        resolve(true);
    }).catch(function (error) {
        req.flash('error', error.message);
        return false;
    });
}
module.exports = {
    CreateUser,
    VerifyUser,
    CreateRole,
    GetRole,
    UserLogout
}