const database=require('../../config/database/connection');

async function VerifyAssetIfscanned(req){
    return new Promise(function(resolve,reject){
        let assetid=req.query.asset;
        let sitecode=req.query.site;
        if(!assetid){
            reject("Provide Asset Id");
        }else{
            let query="Select count(*) as AssetCount from assetmaster where (Tag_Status=1 or Tag_Status=2) and Id="+assetid+" and Site_Code='"+sitecode+"'";
            database.fetch_data(query).then(function(results){
                if(!results.result){
                    reject(results.error);
                }else{
                    let records=results.records;
                    let count=records[0].AssetCount;
                    if(count===0){
                        resolve(true);
                    }else{
                        reject("This asset is already scanned you cannot update/delete");
                    }
                }
            });
        }
    }).catch(function(error){
        req.flash('error',error);
        return false;
    });
    
}

module.exports={
    VerifyAssetIfscanned,
}