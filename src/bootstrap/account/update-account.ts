const { Account } = require("../../core/database/model-listings"); // import DataHive model selector
const { Logger } = require("../../log"); // import logger function
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { GetAccount } = require("./get-account"); // import IfEmpty function
const { ConfirmAccountSession } = require("./confirm-account-session"); // import IfEmpty function
const { Encrypt, Decrypt } = require("../../core/security"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
const { Save, Get, Remove } = require("../../libs/redis"); // import Redis Get & Save functions
 

export const UpdateAccount = async (payload:any) => { 

    // Query the database to get resource
    const DBSave = async () => {

        if(IfEmpty(payload))    return { 
                                    code: GetStatusResponse("bad_request").code, 
                                    success: false, 
                                    msg: GetStatusResponse("bad_request").msg,
                                    data: null 
                                } // return resource
        
        else
        {
            try 
            {

                await Account.update(payload, { where: {id: payload.id} }); // update account
                let _account = await Get("account_"+payload.id); // get old record
                await Remove("account_"+payload.id); // remove old data
                await ConfirmAccountSession(payload.id, Decrypt(_account).session); // recache account session
                let account = await GetAccount("id", payload.id); // get updated record
                return  {
                            success: true,
                            code: GetStatusResponse("success").code,
                            msg: GetStatusResponse("success").msg,
                            data: Encrypt(account)
                        }
            }
            catch (error:any) {

                Logger('error', "Failed execution: failed to update account: "+ error.message); // log error message to .log file 
                
                return { 
                    success: false, 
                    code: GetStatusResponse("internal_server_err").code, 
                    msg: GetStatusResponse("internal_server_err").msg,
                    data: null
                }; // return a 500 response to requester;

            }
        }
 
    }

    return await DBSave(); // Init redis function 

}

export const UpdateAccountEmail = async (payload:any) => { 

    // Query the database to get resource
    const DBSave = async () => {

        if(IfEmpty(payload)) return { 
                                        success: false, 
                                        code: GetStatusResponse("bad_request").code, 
                                        msg: GetStatusResponse("bad_request").msg,
                                        data: null 
                                    } // return resource
        
        else
        {
            try {

                await Account.update({email: payload.email}, { where: {id: payload.id} });
                
                let account = await Get("account_"+payload.id); // get updated record
                await Remove("account_"+payload.id); // get updated record
                account = Decrypt(account); //decrypt account
                account.email = payload.email; // add email data to account

                Save("account_"+payload.id, Encrypt(account), null, false); // save to cache

                return  {
                            success: true,
                            code: GetStatusResponse("success").code,
                            msg: GetStatusResponse("success").msg,
                            data: account
                        }
            } 
            catch (error:any) {

                Logger('error', "Failed execution: failed to update account email: "+ error.message); // log error message to .log file 
                
                return {
                    success: false, 
                    code: GetStatusResponse("internal_server_err").code, 
                    msg: GetStatusResponse("internal_server_err").msg,
                    data: null
                }; // return a 500 response to requester;

            }
        }
 
    }

    return await DBSave(); // Init redis function 

}

export const UpdateAccountPassword = async (payload:any) => {  

    // Query the database to get resource
    const DBSave = async () => {

        if(IfEmpty(payload))    return { 
                                    success: false, 
                                    code: GetStatusResponse("bad_request").code, 
                                    msg: GetStatusResponse("bad_request").msg,
                                    data: null 
                                } // return resource
        
        else
        {
            try {

                let account:any = await Account.update({password: payload.password}, { where: {id: payload.id} });

                return  {
                            success: true,
                            code: GetStatusResponse("success").code,
                            msg: GetStatusResponse("success").msg,
                            data: null
                        }
            } 
            catch (error:any) {

                Logger('error', "Failed execution: failed to update account password: "+ error.message); // log error message to .log file 
                
                return { 
                    success: false, 
                    data: null,
                    code: GetStatusResponse("internal_server_err").code, 
                    msg: GetStatusResponse("internal_server_err").msg
                }; // return a 500 response to requester;

            }
        }
 
    }

    return await DBSave(); // Init redis function 

}