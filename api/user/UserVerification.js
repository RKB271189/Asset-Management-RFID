let database = require('../../config/database/connection');

/**
 * method to verify the role of the event during asset scanning at ware house and 
 * scanning at field (outlet)
 * for the event /tag-event-entry and /tag-track-entry
 * @param {*} req 
 */
async function VerifyRole(req) {
    let userid = req.body.User_Id;
    let query = "select Role_Id from usermaster where User_Id='" + userid + "' limit 1";
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let records = results.records;
                if (records.length == 0) {
                    reject("User not found..Please use another tag");
                } else {
                    let roleid = records[0].Role_Id;
                    let obturl = req.originalUrl;
                    if (obturl.includes('event')) {
                        if (roleid === 1 || roleid === 101) {
                            resolve(true);
                        } else {
                            reject("You are not allowed to access this option");
                        }
                    } else {
                        if (obturl.includes('track')) {
                            if (roleid === 2 || roleid === 101) {
                                resolve(true);
                            } else {
                                reject("You are not allowed to access this option");
                            }
                        }
                    }
                }
            }
        });
    }).catch(function (error) {
        return error;
    });
}

module.exports = {
    VerifyRole
}