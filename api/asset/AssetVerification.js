const database = require('../../config/database/connection');


async function GetPresenceSiteInAsset(Site_Code) {
    let query = "Select count(*) as SiteCount from assetmaster where Site_Code='" + Site_Code + "'";
    return new Promise(function (resolve, reject) {
        database.fetch_data(query).then(function (results) {
            if (!results.result) {
                reject(results.error);
            } else {
                let records = results.records;
                let count = records[0].SiteCount;
                if (count === 0 || typeof count == 'undefined') {
                    reject("Site Code is not present in the asset system: contact admin");
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
    GetPresenceSiteInAsset,
}