const jwt = require('jsonwebtoken');


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

module.exports = {
    GenerateToken,
    VerifyToken
};