const { Comments } = require("../../core/database/model-listings"); // import DataHive model selector
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { Logger } = require("../../log"); // import logger function

export const SaveComment = async (payload:any) => {
     
    // Query the database to get resource
    const DBSave = async () => {

        if(IfEmpty(payload))    return { 
                                    code: GetStatusResponse("bad_request").code, 
                                    success: false, 
                                    data: null,
                                    msg: GetStatusResponse("bad_request").msg  
                                } // return resource
        
        else
        {
            try {

                await Comments.create(payload);

                return  {
                            success: true,
                            code: GetStatusResponse("success").code,
                            msg: GetStatusResponse("success").msg,
                            data: null
                        }
            } 
            catch (error:any) {
                Logger('engine', "Failed execution: failed to create new comment: "+ error.message); // log error message to .log file 
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