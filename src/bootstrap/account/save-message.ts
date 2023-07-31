const { Encrypt } = require("../../core/security"); // import DataHive model selector
const { Message, MessageTrail } = require("../../core/database/model-listings"); // import DataHive model selector
const { Logger } = require("../../log"); // import logger function
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data 

export const SaveMessage = async (payload:any) => { 
     
    // Query the database to get resource
    const DBSave = async () => {

        if(IfEmpty(payload)) return { 
                                code: GetStatusResponse("bad_request").code, 
                                success: false, 
                                data: [],
                                msg: GetStatusResponse("bad_request").msg
                            } // return resource
        
        else
        {
            try {

                let resp:any = {} as any;
                
                if(IfEmpty(payload.message_id)) resp = await Message.create(payload);
                else resp = await MessageTrail.create(payload);
                
                return  { 
                    code: GetStatusResponse("success").code, 
                    success: true,
                    data: IfEmpty(payload.message_id) ? Encrypt(resp.id) : Encrypt(payload.message_id),
                    msg: GetStatusResponse("success").msg 
                };
                
            } 
            catch (error:any) {

                Logger('engine', "Failed execution: failed to save review: "+ error.message); // log error message to .log file

                return  { 
                            code: GetStatusResponse("internal_server_err").code, 
                            success: false, 
                            data: error.message,
                            msg: GetStatusResponse("internal_server_err").msg 
                        };
            }
        }
 
    }

    return await DBSave(); // Init redis function 

}