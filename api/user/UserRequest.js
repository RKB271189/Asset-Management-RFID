async function LoginRequest(req) {
    let request = {
        result: false,
        error: '',
        details: []
    }
    let loginid = req.body.Login_Id;
    let password = req.body.Password;
    if (!password) {
        request.error = 'Password is mandatory';
    } else if (!loginid) {
        request.error = 'Login Id is mandatory';
    } else {
        request.result = true;
    }
    return request;
}
module.exports = {
    LoginRequest
}