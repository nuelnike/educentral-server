

export const ConfirmAccountSession = async (id:string, token:string) => {

    const { Session } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { GetAccount } = require("./get-account"); // import IfEmpty function
    const { Decrypt, Encrypt } = require("../../core/security"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    let cache_account:any = {};
    
    // Check redis for resource requested
    const RedisGet = async () => {
        if(IfEmpty(id) || IfEmpty(token)) return { success: false,  code: GetStatusResponse("bad_request").code, msg: GetStatusResponse("bad_request").msg }; // return a 500 response to requester;
        
        else
        {
            cache_account = await Get("account_"+id); // get cache account from redis

            
            if(!IfEmpty(cache_account)) // if account is not empty
            {
                cache_account = Decrypt(cache_account); // decrypt cache
                if(cache_account.session == token) return { code: GetStatusResponse("success").code, success: true, msg: GetStatusResponse("success").msg, data: null } // return response to requester if token is true
                else return DBOpsSession(); // else query DB for session data
            }
            else return DBOpsAccountAndSession(); // query DB to get both account and active session
        } 
    }
    
    // Query the database to get session resource
    const DBOpsSession = async () => {
        try {
            
            let session:any = await Session.findOne({ // query database for resource requested
                where: { account_id: id, token },
            });

            if(!IfEmpty(session)) // if data is not empty
            {
                cache_account.session =  session.token;

                Save("account_"+id, Encrypt(cache_account), null, false); // cache session for 24 hours
                return { code: GetStatusResponse("success").code, success: true, msg: GetStatusResponse("success").msg, data: true } // return response to requester
            }

            else return { code: GetStatusResponse("not_found").code, success: false, msg: GetStatusResponse("not_found").msg, data: null } // return a 404 response to requester

        } 
        catch (error:any) {
            Logger('engine', "Failed execution: failed to confirm account session: "+ error.message); // log error message to .log file 
            return { code: GetStatusResponse("internal_server_err").code, success: false, msg: GetStatusResponse("internal_server_err").msg }; // return a 500 response to requester;
        }
 
    }
    
    // Query the database to get account and session resource
    const DBOpsAccountAndSession = async () => {
        try {

            let account:any = await GetAccount("id", id); // get account data
               

            if(account.success)
            {
               cache_account = await Get("account_"+id); // get cache account from redis

                if(!IfEmpty(cache_account))
                {
                    cache_account = Decrypt(cache_account); // decrypt cache account data
                    
                    let session:any = await Session.findOne({ // query database for resource requested
                        where: {account_id: id, token},
                    });

                    if(!IfEmpty(session))
                    {
                        cache_account.session =  session.token;
                        Save("account_"+id, Encrypt(cache_account), null, false); // cache session
                        return { code: GetStatusResponse("success").code, success: true, msg: GetStatusResponse("success").msg, data: null } // return response to requester
                    }
                    else return { code: GetStatusResponse("not_found").code, success: false, msg: GetStatusResponse("not_found").msg, data: null } // return a 404 response to requester
                }
                else return { code: GetStatusResponse("not_found").code, success: false, msg: GetStatusResponse("not_found").msg, data: null } // return a 404 response to requester
                
            }
            else return { code: GetStatusResponse("not_found").code, success: false, msg: GetStatusResponse("not_found").msg, data: null } // return a 404 response to requester
            
            
        } 
        catch (error:any) {
            Logger('engine', "Failed execution: failed to confirm account session: "+ error.message); // log error message to .log file 
            return { code: GetStatusResponse("internal_server_err").code, success: false, msg: GetStatusResponse("internal_server_err").msg }; // return a 500 response to requester;
        }
 
    }

    return await RedisGet(); // Init redis function 

}