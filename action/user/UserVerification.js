const database = require('../../config/database/connection');
async function VerifyLoginId(Login_Id) {
    let data = {
        result: false,
        error: ''
    }
    let query = "Select count(*) as LoginIdCount from usermaster where Login_Id='" + Login_Id + "'";
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error)
            } else {
                let records = results.records;
                let count = records[0].LoginIdCount;
                if (count > 0) {
                    reject("Login Id already taken");
                } else {
                    data.result = true;
                    resolve(data);
                }
            }
        });
    }).catch(function (error) {
        data.error = error;
        return data;
    });
}
async function VerifyMobile(Mobile_No) {
    let data = {
        result: false,
        error: ''
    }
    let query = "Select count(*) as MobileCount from usermaster where Mobile_No='" + Mobile_No + "'";
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error)
            } else {
                let records = results.records;
                let count = records[0].Mobile_No;
                if (count > 0) {
                    reject("Mobile Number is already present");
                } else {
                    data.result = true;
                    resolve(data);
                }
            }
        });
    }).catch(function (error) {
        data.error = error;
        return data;
    });
}

async function VerifyEmail(Email_Id) {
    let data = {
        result: false,
        error: ''
    }
    let query = "Select count(*) as EmailCount from usermaster where Email_Id='" + Email_Id + "'";
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error)
            } else {
                let records = results.records;
                let count = records[0].EmailCount;
                if (count > 0) {
                    reject("Email Id already taken");
                } else {
                    data.result = true;
                    resolve(data);
                }
            }
        });
    }).catch(function (error) {
        data.error = error;
        return data;
    });
}
module.exports = {
    VerifyLoginId,
    VerifyMobile,
    VerifyEmail
}