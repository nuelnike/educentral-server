export const ConfirmAccount = async (typ:string, ref:string) => { 

    const { Account } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    const { Op } = require("sequelize"); // import operation function from sequalize
    let cache_accounts:string = "";
    let data:any = {};
    
    // Check redis for resource requested
    const RedisGet = async () => {

        if(IfEmpty(ref)) return { success: false, msg: GetStatusResponse("bad_request").msg }; // return a 500 response to requester;

        else
        { 
            cache_accounts = await Get("accounts"); // get cache accounts from redis

            if(!IfEmpty(cache_accounts)) // if cached accounts is not empty
            {
                let accounts:Array<any> = JSON.parse(cache_accounts); //convert redis data to array
                data = accounts.find(x => x[typ] == ref); // find resource in array
                if(!IfEmpty(data)) {
                    return { code: GetStatusResponse("success").code, success: true, msg: GetStatusResponse("success").msg, data: true } // return response to requester
                }
                else return DBOps();
            }
            else return DBOps();
        }
    }
    
    // Query the database to get resource
    const DBOps = async () => {
        try {
            
            let account:any = await Account.findOne({ // query database for resource requested
                where: { [Op.or]: [{id: ref}, {email: ref}, {username: ref}]},
                attributes: ["id","fullname","username","status_id","email","phone","address","photo","gender","password"]
            })

            if(!IfEmpty(account)) // if data is not empty
            {
                let accounts:Array<any> = JSON.parse(cache_accounts); //convert redis data to array
                accounts.push(account); // push new account into array
                Save("accounts", accounts, null, false); // save new array to redis
                return { code: GetStatusResponse("success").code, success: true, msg: GetStatusResponse("success").msg, data: true } // return response to requester
            }

            else return { code: GetStatusResponse("not_found").code, success: false, msg: GetStatusResponse("not_found").msg, data: null } // return a 404 response to requester

        } 
        catch (error:any) {
            Logger('engine', "Failed execution: failed to confirm account: "+ error.message); // log error message to .log file 
            return { code: GetStatusResponse("internal_server_err").code, success: false, msg: GetStatusResponse("internal_server_err").msg }; // return a 500 response to requester;
        }
 
    }

    return await RedisGet(); // Init redis function 

}