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
            req.session["superadmin"] = true;
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
                        reject("Login Id does not match with the records");
                    } else {
                        query = "Select count(*) as UserCount,Role_Id from usermaster where Password='" + password + "' limit 1";
                        database.fetch_data(query).then(function (results) {
                            if (!results.result) {
                                reject(results.error);
                            } else {
                                records = results.records;
                                count = records[0].UserCount;
                                if (count == 0) {
                                    reject("Please provide valid password for the Login Id");
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
                                                req.session["superadmin"] = false;
                                                req.session["loginid"] = loginid;
                                                resolve(true);
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
async function GetUserList(req, id = 0) {
    let array_user = [];
    let query = "";
    if (id == 0) {
        query = "select User_Id,Login_Id,First_Name,Mobile_No,Email_Id,rolelist.Role_Type from usermaster left join rolelist on usermaster.Role_Id=rolelist.Role_Code";
    } else {
        query = "select * from usermaster where User_Id=" + id + " limit 1";
    }

    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let records = results.records;
                let len = records.length;
                if (id == 0) {
                    for (let i = 0; i < len; i++) {
                        let data = {
                            User_Id: records[i].User_Id,
                            Login_Id: records[i].Login_Id,
                            First_Name: records[i].First_Name,
                            Role: records[i].Role_Type,
                            Mobile_No: records[i].Mobile_No,
                            Email_Id: records[i].Email_Id
                        }
                        array_user.push(data);
                    }
                } else {
                    for (let i = 0; i < len; i++) {
                        let data = {
                            Password: records[i].Password,
                            User_Id: records[i].User_Id,
                            Login_Id: records[i].Login_Id,
                            First_Name: records[i].First_Name,
                            Last_Name: records[i].Last_Name,
                            Mobile_No: records[i].Mobile_No,
                            Email_Id: records[i].Email_Id,
                            Role_User: records[i].Role_Id,
                            Role: '',
                        }
                        array_user.push(data);
                    }
                }
                resolve(array_user);
            }
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function UpdateUser(req) {
    let currentdate = await othermethods.GetCurrentDate();
    let post = {
        User_Id: req.body.User_Id,
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
    let query = "Update usermaster set First_Name='" + post.First_Name + "',Last_Name='" + post.Last_Name + "',Login_Id='" + post.Login_Id + "',Password='" + post.Password + "',Mobile_No='" + post.Mobile_No + "',Email_Id='" + post.Email_Id + "',Role_Id='" + post.Role_Id + "',Is_Active='" + post.Is_Active + "',Modify_Date='" + post.Modify_Date + "' where User_Id='" + post.User_Id + "'";
    return new Promise(function (resolve, reject) {
        database.update_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                req.flash('error', 'User details updated successfully');
                resolve(true);
            }
        });
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
async function UpdateRole(req) {
    let post = {
        Role_Id: req.body.Role_Id,
        Role_Type: req.body.Role_Type,
        Role_Name: req.body.Role_Name,
    }
    let query = "Update rolelist set Role_Type='" + post.Role_Type + "',Role_Name='" + post.Role_Name + "' where Id='" + post.Role_Id + "'";
    return new Promise(function (resolve, reject) {
        database.update_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            }
            req.flash('error', 'Role Updated Successfully');
            resolve(true);
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function GetRole(req) {
    let array_role = [];
    return new Promise(function (resolve, reject) {
        let query = "Select * from rolelist";
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            }
            let records = results.records;
            let len = records.length;
            for (let i = 0; i < len; i++) {
                let role = {
                    Role_Id: records[i].Id,
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
async function DeleteRole(roleid, req) {
    return new Promise(function (resolve, reject) {
        if (!roleid) {
            reject("Something went wrong..Please try again");
        } else {
            let query = "Select Role_Code from rolelist where Id=" + roleid + " limit 1";
            database.fetch_data(query).then(function (results) {
                if (!results.result) {
                    reject(results.error);
                } else {
                    let records = results.records;
                    let rolecode = records[0].Role_Code;
                    if (rolecode === 1 || rolecode === 2) {
                        reject("Your are only allowed to update it");
                    } else {
                        query = "Delete from rolelist where Id=" + roleid + "";
                        database.update_data(query).then(function (results) {
                            if (!results.result) {
                                reject(results.error);
                            } else {
                                req.flash('error', 'Role deleted successfully');
                                resolve(true);
                            }
                        });
                    }
                }
            });
        }
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function GetRoleById(roleid, req) {
    let array_access = [];
    let query = "Select Role_Access from rolelist where Id=" + roleid + " limit 1";
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let records = results.records;
                let roleaccess = records[0].Role_Access;
                if (!roleaccess) {
                    resolve(array_access)
                } else {
                    array_access.push(roleaccess);
                    resolve(roleaccess)
                }
            }
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });

}
async function SaveRoleAccess(req) {
    return new Promise(function (resolve, reject) {
        let access_menu = "";
        let roleid = req.body.Role_Id;
        Object.keys(req.body).forEach(function (key) {
            if (key == "Role_Id") {

            } else {
                access_menu += key + ',';
            }
        });
        if (access_menu == "") {
            reject("Something went wrong..Please Try Again");
        } else {
            access_menu = access_menu.substring(0, access_menu.length - 1);
            let query = "update rolelist set Role_Access='" + access_menu + "' where Id=" + roleid + "";
            database.update_data(query).then(function (results) {
                if (!results.result) {
                    reject(results.error);
                } else {
                    req.flash('error', 'User Role Access saved successfully');
                    resolve(true);
                }
            });
        }
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
    UserLogout,
    UpdateRole,
    DeleteRole,
    GetRoleById,
    SaveRoleAccess,
    GetUserList,
    UpdateUser
}