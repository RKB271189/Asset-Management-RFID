const verify = require('./UserVerification');
const controller = require('./UserController');
async function LoginRequest(req) {
    return new Promise(function (resolve, reject) {
        let loginid = req.body.Login_Id;
        let password = req.body.Password;
        if (!loginid) {
            reject("Please provide Login Id");
        } else if (!password) {
            reject("Please provide password");
        } else {
            resolve(true);
        }
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}



async function CreateUserRequest(req) {
    return new Promise(function (resolve, reject) {
        let firstname = req.body.First_Name;
        let loginid = req.body.Login_Id;
        let password = req.body.Password;
        let mobileno = req.body.Mobile_No;
        let roleid = req.body.Role_Id;
        let emailid = req.body.Email;
        let errormessage = "";
        if (!firstname) {
            errormessage = "First Name is mandatory";
            reject(errormessage);
        } else if (!loginid) {
            errormessage = "Login Id is mandatory";
            reject(errormessage);
        } else if (!password) {
            errormessage = "Password is mandatory";
            reject(errormessage);
        } else if (!roleid || roleid == 0 || roleid == "0") {
            errormessage = "Role is mandatory";
            reject(errormessage);
        } else if (!mobileno) {
            errormessage = "Mobile is mandatory";
            reject(errormessage);
        } else {
            if (password.length < 6) {
                errormessage = "Password must be more than 5 character";
                reject(errormessage);
            } else if (mobileno.length < 10) {
                errormessage = "Mobile number must have 10 digits";
                reject(errormessage);
            } else {
                let mob = /^[1-9]{1}[0-9]{9}$/;
                if (mob.test(mobileno) == false) {
                    errormessage = "Enter valid mobile number";
                    reject(errormessage);
                } else if (mobileno.length > 10) {
                    errormessage = "Enter valid mobile number";
                    reject(errormessage);
                }
                verify.VerifyLoginId(loginid).then(function (results) {
                    if (!results.result) {
                        errormessage = results.error;
                        reject(errormessage);
                    } else {
                        verify.VerifyMobile(mobileno).then(function (results) {
                            if (!results.result) {
                                errormessage = results.error;
                                reject(errormessage);
                            } else {
                                if (emailid) {
                                    let ema = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                    if (ema.test(emailid) == false) {
                                        errormessage = "Enter valid Email Address";
                                        reject(errormessage);
                                    } else {
                                        verify.VerifyEmail(emailid).then(function (results) {
                                            if (!results.result) {
                                                errormessage = results.error;
                                                reject(errormessage);
                                            } else {
                                                resolve(true);
                                            }
                                        });
                                    }
                                } else {
                                    resolve(true);
                                }
                            }
                        });
                    }
                });
            }
        }
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function UserUpdateRequest(req) {
    return new Promise(function (resolve, reject) {
        let firstname = req.body.First_Name;
        let loginid = req.body.Login_Id;
        let password = req.body.Password;
        let mobileno = req.body.Mobile_No;
        let roleid = req.body.Role_Id;
        let emailid = req.body.Email;
        let errormessage = "";
        if (!firstname) {
            errormessage = "First Name is mandatory";
            reject(errormessage);
        } else if (!loginid) {
            errormessage = "Login Id is mandatory";
            reject(errormessage);
        } else if (!password) {
            errormessage = "Password is mandatory";
            reject(errormessage);
        } else if (!roleid || roleid == 0 || roleid == "0") {
            errormessage = "Role is mandatory";
            reject(errormessage);
        } else if (!mobileno) {
            errormessage = "Mobile is mandatory";
            reject(errormessage);
        } else {
            if (password.length < 6) {
                errormessage = "Password must be more than 5 character";
                reject(errormessage);
            } else if (mobileno.length !== 10) {
                errormessage = "Mobile number must have 10 digits";
                reject(errormessage);
            } else {
                let mob = /^[1-9]{1}[0-9]{9}$/;
                if (mob.test(mobileno) == false) {
                    errormessage = "Enter valid mobile number";
                    reject(errormessage);
                } else if (mobileno.length > 10) {
                    errormessage = "Enter valid mobile number";
                    reject(errormessage);
                } else {
                    if (emailid) {
                        let ema = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (ema.test(emailid) == false) {
                            errormessage = "Enter valid Email Address";
                            reject(errormessage);
                        } else {
                            resolve(true);
                        }
                    } else {
                        resolve(true);
                    }
                }
            }
        }
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function UserRoleRequest(req) {
    return new Promise(function (resolve, reject) {
        let roletype = req.body.Role_Type;
        let rolename = req.body.Role_Name;
        let rolecode = req.body.Role_Code;
        if (!roletype) {
            reject("Role Type is mandatory");
        } else if (!rolename) {
            reject("Role Name is mandatory");
        } else if (!rolecode) {
            reject("Role Code is mandatory");
        } else {
            resolve(true);
        }
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
async function UpdateRoleRequest(req) {
    return new Promise(function (resolve, reject) {
        controller.GetRole(req).then(function (results) {
            if (!results) {
                reject("Something Went Wrong..Please try again");
            } else {
                let records = results;
                let len = records.length;
                let isrolepresent = false;
                let roleid = 0;
                for (let i = 0; i < len; i++) {
                    roleid = records[i].Role_Id;
                    if (req.body["Role_Id_" + roleid + ""]) {
                        isrolepresent = true;
                        break;
                    }
                }
                if (!isrolepresent) {
                    reject("Something Went Wrong..Please try again");
                } else {
                    let roletype = req.body["Role_Type_" + roleid + ""];
                    let rolename = req.body["Role_Name_" + roleid + ""];
                    roletype = roletype.trim();
                    rolename = rolename.trim();
                    if (!roletype) {
                        reject("Please provide Role Type for Role");
                    } else if (!rolename) {
                        reject("Please provide Role Name for Role");
                    } else {
                        req.body["Role_Id"] = roleid;
                        req.body["Role_Name"] = rolename;
                        req.body["Role_Type"] = roletype;
                        resolve(true);
                    }
                }
            }
        });
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
module.exports = {
    CreateUserRequest,
    UserRoleRequest,
    LoginRequest,
    UpdateRoleRequest,
    UserUpdateRequest
}