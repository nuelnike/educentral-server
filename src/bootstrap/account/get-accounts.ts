export const GetAccounts = async () => { 

    const { Account } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    let cache_accounts:string = "";
    let data:any;
    
    // Check redis for resource requested
    const RedisGet = async () => {
        
        cache_accounts = await Get("accounts"); // get cache accounts from redis
    
        if(!IfEmpty(cache_accounts)) // if cached accounts is not empty
        {
            console.log("accounts already cached.");
            data = { success: true, msg: GetStatusResponse("success").msg, data: cache_accounts } // return resource
        }
        else return DBOps();
    }
    
    // Query the database to get resource
    const DBOps = async () => {

        try {
            
            data = await Account.findAll();
            if(!IfEmpty(data)) // if data is not empty
            { 
                Save("accounts", data, null, false); // save new array to redis
                console.log("accounts Geted and cached successfully.");
                data = { success: true, msg: GetStatusResponse("success").msg, data } // return a 404 response to requester
            }

            else {
                console.log("no accounts currently available in the database.");
                data = { success: true, msg: GetStatusResponse("not_found").msg, data: null } // return a 404 response to requester
            }

        } 
        catch (error:any) {
            console.log("Engine failed to Get accounts: "+ error.message);
            Logger('error', "Failed execution: failed to Get accounts: "+ error.message); // log error message to .log file 
            data = { success: false, msg: GetStatusResponse("internal_server_err").msg }; // return a 500 response to requester;
        }
 
    }

    await RedisGet(); // Init redis function 

    return data;

}