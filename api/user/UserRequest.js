let verify = require('./UserVerification');
async function LoginRequest(req) {
    let request = {
        result: false,
        error: '',
        details: []
    }
    let loginid = req.body.Login_Id;
    let password = req.body.Password;
    if (!loginid) {
        request.error = 'Login Id is mandatory';
    } else if (!password) {
        request.error = 'Password is mandatory';
    } else {
        request.result = true;
    }
    return request;
}
async function RoleRequest(req) {
    let request = {
        result: false,
        error: '',
        details: []
    }
    return new Promise(function (resolve, reject) {
        let userid = req.body.User_Id;
        if (!userid) {
            reject("Please provide User Id");
        } else {
            verify.VerifyRole(req).then(function (results) {
                if (results !== true) {
                    reject(results);
                } else {
                    resolve(true);
                }
            });
        }
    }).catch(function (error) {
        request.error = error;
        return request;
    });
}
module.exports = {
    LoginRequest
}