const user = require('express').Router();
const request = require('./UserRequest');
const controller = require('./UserController');
user.post('/login-verify', async (req, res) => {
    await request.LoginRequest(req).then(async function (results) {
        if (!results.result) {
            res.end(JSON.stringify(results));
        } else {
            await controller.VerifyLogin(req).then(function (results) {
                res.end(JSON.stringify(results));
            });
        }
    });
});

module.exports = user;