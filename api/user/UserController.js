const authenticate = require("../../auth/authenticate");
const database = require("../../config/database/connection");
/**
 * verify the user details and return that user full details in response
 * @param {*} req 
 */
async function VerifyLogin(req) {
    let array_data = [];
    let data = {
        result: false,
        error: '',
        token: '',
        details: [],
    }
    return new Promise(function (resolve, reject) {
        let loginid = req.body.Login_Id;
        //verifying login id
        let query = "select * from usermaster where Login_Id='" + loginid + "' limit 1";
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            }
            let records = results.records;
            let len = records.length;
            if (len === 1) {
                let userpassword = req.body.Password;
                //checking if password matches
                if (userpassword === records[0].Password) {
                    let user = {
                        User_Id: records[0].User_Id,
                        Login_Id: records[0].LOgin_Id,
                        Email_Id: records[0].Email_Id,
                        Mobile_No: records[0].Mobile_No,
                        First_Name: records[0].First_Name,
                        Last_Name: records[0].Last_Name,
                        Role_Id: records[0].Role_Id,
                    }
                    array_data.push(user);
                    let usr = {
                        userid: user.User_Id,
                        username: user.First_Name
                    }
                    //generataing to token if the user details are currect and sending them
                    //back with the response
                    authenticate.GenerateToken(usr).then(function (results) {
                        if (!results.result) {
                            reject(results.error)
                        }
                        data.result = true;
                        data.details = array_data;
                        data.token = results.token;
                        resolve(data);
                    });
                } else {
                    reject("Invalid Password Provided");
                }
            } else {
                reject("Invalid Login Id Provided");
            }
        });
    }).catch(function (error) {
        data.error = error;
        return data;
    });
}
module.exports = {
    VerifyLogin
}