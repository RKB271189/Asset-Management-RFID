const jwt = require('jsonwebtoken');
const database = require('../config/database/connection');
/**
 * Generating Token using jsonwebtoken
 * @param {*} user it will have user id and user name
 * @returns tokendetails as json array
 */
async function GenerateToken(user) {
    let tokendetails = {
        result: false,
        error: '',
        token: ''
    }
    return new Promise(function (resolve, reject) {
        jwt.sign({ user: user }, 'uni#rel@off123', (error, token) => {
            if (error) {
                reject(error)
            }
            tokendetails.result = true;
            tokendetails.token = token;
            resolve(tokendetails);
        });
    }).catch(function (error) {
        console.log(error);
        tokendetails.error = error;
        return tokendetails;
    });
}

/**
 * It will verify the generated token
 * @param {*} bearerheader 
 * @returns json array with details verified as true or false
 */
async function VerifyToken(bearerheader) {
    let tokenstatus = {
        result: false,
        error: ''
    }
    return new Promise(function (resolve, reject) {
        if (typeof bearerheader !== 'undefined') {
            let bearer = bearerheader.split(' ');
            let token = bearer[1];
            jwt.verify(token, 'uni#rel@off123', (error, authdata) => {
                if (error) {
                    reject(error);
                }
                tokenstatus.result = true;
                resolve(tokenstatus);
            });
        } else {
            reject("You are not authenticated to make request");
        }
    }).catch(function (error) {
        console.log(error);
        tokenstatus.result = false;
        return tokenstatus;
    });
}
async function AccessAuthenticate(req) {
    return new Promise(function (resolve, reject) {
        if (req.session['superadmin']) {
            resolve(true);
        } else {
            let method = req.method;
            method = method.toUpperCase();
            let url = req.url;
            let loginid = req.session["loginid"];
            if (method === "GET") {
                let query = "Select Role_Access from usermaster inner join rolelist on usermaster.Role_Id=rolelist.Role_Code where Login_Id='" + loginid + "' limit 1";
                database.fetch_data(query).then(function (results) {
                    if (!results.result) {
                        reject(results.error);
                    } else {
                        if (method === "GET") {
                            if (url.includes('update') || url.includes('delete')) {
                                resolve(true);
                            } else {
                                let urlmenu = req.query.assetm;
                                if (typeof urlmenu === "undefined") {
                                    resolve(true);
                                } else {
                                    let records = results.records;
                                    let roleaccess = records[0].Role_Access;
                                    let array_menu = urlmenu.split('-');
                                    let menu = 'm' + array_menu[0];
                                    if (roleaccess.includes(menu)) {
                                        resolve(true);
                                    } else {
                                        reject("Invalid Access");
                                    }
                                }
                            }
                        } else {
                            resolve(true);
                        }
                    }
                });
            } else {
                resolve(true);
            }
        }
    }).catch(function (error) {
        req.flash('error', error);
        return false;
    });
}
module.exports = {
    GenerateToken,
    VerifyToken,
    AccessAuthenticate
};