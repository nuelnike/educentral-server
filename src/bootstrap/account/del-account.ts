const { Account } = require("../../core/database/model-listings"); // import DataHive model selector
const { Get, Remove } = require("../../libs/redis"); // import Redis Get & Save functions
const { Logger } = require("../../log"); // import logger function
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
let cache_account:any = [];

export const DeleteAccount = async (id:number) => {
    
    // Check redis for resource requested
    const RedisGet = async () => {

        if(IfEmpty(id)) return { 
                            success: false, 
                            code: GetStatusResponse("bad_request").code, 
                            msg: GetStatusResponse("bad_request").msg,
                            data:null
                        }; // return a 500 response to requester;

        else
        { 
            cache_account = await Get("account_"+id); // get old record

            if(!IfEmpty(cache_account)) await Remove("account_"+id); // remove old data
            return DBOps();
        }
    }
    
    // Query the database to get resource
    const DBOps = async () => {
        try {
            await Account.destroy({ where: { id } });
            return { 
                success: true,
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data: null
            }
        } 
        catch (error:any) {
            Logger('error', "Failed execution: failed to delete account : "+ error.message); // log error message to .log file 
            return { 
                success: false, 
                code: GetStatusResponse("internal_server_err").code, 
                msg: GetStatusResponse("internal_server_err").msg, 
                data: null 
            };
        }
 
    }

    return await RedisGet(); // Init redis function 

}