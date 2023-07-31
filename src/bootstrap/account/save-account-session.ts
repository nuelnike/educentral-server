
export const SaveAccountSession = async (payload:any) => { 

    const { GetAccount } = require("./get-account"); // import DataHive model selector
    const { Session } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { Encrypt, Decrypt } = require("../../core/security"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    // let { token, duration, account_id, status_id }:any = payload;
    let cache_account:any = {};
     
    // Query the database to get resource
    const DBSave = async () => {

        if(IfEmpty(payload)) return { code: GetStatusResponse("bad_request").code, success: false, msg: GetStatusResponse("bad_request").msg  } // return resource
        
        else
        {
            try {
    
                let session:any = await Session.create(payload);

                cache_account = await Get("account_"+payload.account_id); // get cache accounts from redis

                if(!IfEmpty(cache_account)) 
                {
                    cache_account = Decrypt(cache_account);

                    cache_account.session =  payload.token;

                    Save("account_"+payload.account_id, Encrypt(cache_account), null, false); // cache session for 24 hours

                    return  {
                                success: true,
                                code: GetStatusResponse("success").code, 
                                msg: GetStatusResponse("success").msg, 
                                data: session
                            }; 
                }
                else return DBOps(session);
                
            } 
            catch (error:any) {

                Logger('engine', "Failed execution: failed to save account session: "+ error.message); // log error message to .log file

                return  { 
                            code: GetStatusResponse("internal_server_err").code, 
                            success: false, 
                            data:null,
                            msg: GetStatusResponse("internal_server_err").msg 
                        }; // return a 500 response to requester;
            }
        }
 
    }

    const DBOps = async (session:any) => {
        try {
            
            cache_account = await  GetAccount("id", payload.account_id);
            
            if(!IfEmpty(cache_account)) // if data is not empty
            {
                cache_account.session =  payload.token;

                Save("account_"+cache_account.id, Encrypt(cache_account), null, false); // cache session for 24 hours

                return { success: true, code: GetStatusResponse("success").code, msg: GetStatusResponse("success").msg, data: session } // return response to requester
            }

            else    return { 
                        success: false,
                        code: GetStatusResponse("not_found").code,
                        msg: GetStatusResponse("not_found").msg,
                        data: null
                    }

        } 
        catch (error:any) {

            console.log(payload)

            Logger('engine', "Failed execution: failed to fetch account: "+ error.message); // log error message to .log file 

            return { code: GetStatusResponse("internal_server_err").code, success: false, msg: GetStatusResponse("internal_server_err").msg }; // return a 500 response to requester;
        
        }
 
    }

    return await DBSave(); // Init redis function 

}