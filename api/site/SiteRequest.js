const verify = require('./SiteVerification');
async function SiteBeginRequest(req) {
    let request = {
        result: false,
        error: '',
        details: []
    }
    let sitecode = req.body.Site_Code;
    if (!sitecode) {
        request.error = "Please provide Site Code";
        return request;
    } else {
        return new Promise(function (resolve, reject) {
            verify.VerifySite(sitecode).then(function (results) {
                if (results == true) {
                    request.result = true;
                    resolve(request);
                } else {
                    reject(results);
                }
            });
        }).catch(function (error) {
            request.error = error;
            return request;
        });
    }
}
module.exports = {
    SiteBeginRequest,
}