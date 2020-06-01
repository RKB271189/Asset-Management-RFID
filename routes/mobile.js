const mobile = require('express').Router();
const user = require('../api/user');
const site = require('../api/site');
const asset = require('../api/asset')
const authenticate = require('../auth/authenticate');
/**
 * Generating token for the first time so that user has to pass when signin
 * it is temporary token
 */
mobile.get('/token', async (req, res) => {
    let user = {
        userid: 1,
        username: 'RelconApp'
    };
    res.setHeader('Content-Type', 'application/json');
    //generating token using jwt authentication
    await authenticate.GenerateToken(user).then(function (results) {
        res.end(JSON.stringify(results));
    });
});
/**
 * After login all the request has to go through this it will verify generated token
 * after successfull login as well as simple login request(token generated in the above method)
 */
mobile.use((req, res, next) => {
    let request = {
        result: false,
        error: '',
        details: []
    };
    req.ContentType = "application/json";
    res.contentType = "application/json";
    res.setHeader('Content-Type', 'application/json');
    let authHeader = req.headers['authorization'];
    //verifying generated token
    authenticate.VerifyToken(authHeader).then(function (results) {
        if (!results.result) {
            request.error = results.error;
            request.result = false;
            res.end(JSON.stringify(request));
        } else {
            next();
        }
    }).catch(function (error) {
        request.error = error;
        request.result = false;
        res.end(JSON.stringify(request));
    });
});
mobile.use('/user', user);
mobile.use('/site', site);
mobile.use('/asset', asset);

module.exports = mobile;