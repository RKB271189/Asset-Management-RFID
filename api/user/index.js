const user = require('express').Router();
const request = require('./UserRequest');
const controller = require('./UserController');
/**
 * event to verify user
 */
user.post('/login-verify', async (req, res) => {  
    //method in UserRequest page to verify if fields are not empty
    await request.LoginRequest(req).then(async function (results) {
        if (!results.result) {
            res.end(JSON.stringify(results));
        } else {
            //method in UserController to search for user in user master table
            await controller.VerifyLogin(req).then(function (results) {
                res.end(JSON.stringify(results));
            });
        }
    });
});

module.exports = user;