
export const InactivateAccountSession = async (id:string) => { 
    const { StatusCode } = require("../../core/data");
    const { Session } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Remove } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
     
    // Query the database to get resource
    const RemoveSession = async () => {

        if(IfEmpty(id)) return { 
                            code: GetStatusResponse("bad_request").code, 
                            success: false, 
                            msg: GetStatusResponse("bad_request").msg,
                            data: null
                        } // return resource
        
        else
        {
            try {

                await Remove("account_"+id); // get cache accounts from redis
                await Session.update({status_id: StatusCode.offline}, { where: { account_id: id } });

                return  {
                            success: true,
                            code: GetStatusResponse("success").code, 
                            msg: GetStatusResponse("success").msg, 
                            data: null
                        }; 
                
            } 
            catch (error:any) {

                Logger('error', "Failed execution: failed to remove account session: "+ error.message); // log error message to .log file

                return  { 
                            code: GetStatusResponse("internal_server_err").code, 
                            success: false, 
                            data:null,
                            msg: GetStatusResponse("internal_server_err").msg 
                        }; // return a 500 response to requester;
            }
        }
 
    }

    return await RemoveSession(); // Init redis function 

}