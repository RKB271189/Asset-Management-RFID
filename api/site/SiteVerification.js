const database = require('../../config/database/connection');

async function VerifySite(Site_Code) {
    let query = "Select count(*) as SiteCount from sitemaster where Site_Code='" + Site_Code + "' limit 1;";
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let records = results.records;
                let count = records[0].SiteCount;
                if (count === 0) {
                    reject("No such code present in system: contact admin");
                } else {
                    resolve(true);
                }
            }
        });
    }).catch(function (error) {
        return error;
    });
}

module.exports = {
    VerifySite
};