

export const CreateNewAccount = async (payload:any) => { 

    const { Account } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { Encrypt } = require("../../core/security"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    const { Save } = require("../../libs/redis"); // import Redis Get & Save functions
     
    // Query the database to get resource
    const DBSave = async () => {

        if(IfEmpty(payload)) return { code: GetStatusResponse("bad_request").code, success: false, msg: GetStatusResponse("bad_request").msg  } // return resource
        
        else
        {
            try {

                let account:any = await Account.create(payload);

                Save("account_"+payload.id, Encrypt(account), null, false); // cache session for 24 hours

                return  {
                            success: true,
                            code: GetStatusResponse("success").code,
                            msg: GetStatusResponse("success").msg,
                            data: account
                        }
            } 
            catch (error:any) {

                Logger('engine', "Failed execution: failed to create new account: "+ error.message); // log error message to .log file 
                
                return { 
                    success: false, 
                    code: GetStatusResponse("internal_server_err").code, 
                    msg: GetStatusResponse("internal_server_err").msg 
                }; // return a 500 response to requester;

            }
        }
 
    }

    return await DBSave(); // Init redis function 

}