export const ConfirmAccount = async (typ:string, ref:string) => {

    const { Account } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { Decrypt, Encrypt } = require("../../core/security"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    const { Op } = require("sequelize"); // import operation function from sequalize
    let cache_account:any = {};
    
    // Check redis for resource requested
    const RedisGet = async () => {

        if(IfEmpty(ref)) return { success: false, code: GetStatusResponse("bad_request").code, msg: GetStatusResponse("bad_request").msg, data: null }; // return a 500 response to requester;

        else
        {
            if(typ == "id")
            {
                cache_account = await Get("account_"+ref); // get cache accounts from redis
                cache_account = Decrypt(cache_account);
                if(cache_account[typ] == ref)
                {
                    return { code: GetStatusResponse("success").code, success: true, msg: GetStatusResponse("success").msg, data: null } // return response to requester
                }
                else return DBOps();

            } 
            else return DBOps();

        }
    }
    
    // Query the database to get resource
    const DBOps = async () => {
        try {

            let qry:any;
            if (typ == "id") qry = {id: ref};
            if (typ == "email") qry = {email: ref};
            if (typ == "username") qry = {username: ref}; 
            
            let account:any = await Account.findOne({ // query database for resource requested
                where: qry
            })

            if(!IfEmpty(account)) // if data is not empty
            {
                Save("account_"+account.id, Encrypt(account), null, false); // cache session for 24 hours
                cache_account = await Get("account_"+account.id); // get cache accounts from redis
                cache_account = Decrypt(cache_account);
                return { code: GetStatusResponse("success").code, success: true, msg: GetStatusResponse("success").msg, data: null } // return response to requester
            }

            else return { code: GetStatusResponse("not_found").code, success: false, msg: GetStatusResponse("not_found").msg, data: null } // return a 404 response to requester

        } 
        catch (error:any) {
            Logger('error', "Failed execution: failed to confirm account: "+ error.message); // log error message to .log file 
            return { code: GetStatusResponse("internal_server_err").code, success: false, msg: GetStatusResponse("internal_server_err").msg }; // return a 500 response to requester;
        }
 
    }

    return await RedisGet(); // Init redis function 

}