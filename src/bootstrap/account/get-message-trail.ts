export const GetMessageTrail = async (id:string) => {

    const { MessageTrail, Account } = require("../../core/database/model-listings");
    const { Logger } = require("../../log");
    const { IfEmpty } = require("../../helpers");
    const { Encrypt } = require("../../core/security");
    const { GetStatusResponse } = require("../../core/data/status-response");
     
    try {

        let messages:any =  await MessageTrail.findAll({
                                where: { id },
                                include:  [{
                                    model: Account,
                                    attributes: ["fullname","username","photo"],
                                    required: false
                                }]
                            });

        if(!IfEmpty(messages))  return { 
                                    success: true, 
                                    code: GetStatusResponse("success").code, 
                                    msg: GetStatusResponse("success").msg, 
                                    data: Encrypt(messages)
                                }

        else return { 
                        success: false, 
                        code: GetStatusResponse("not_found").code, 
                        msg: GetStatusResponse("not_found").msg, 
                        data: null 
                    }

    } 
    catch (error:any) {
        Logger('error', "Failed execution: failed to fetch account messages: "+ error.message);
        return  { 
                    code: GetStatusResponse("internal_server_err").code, 
                    success: false, 
                    msg: GetStatusResponse("internal_server_err").msg
                }; // return a 500 response to requester;
    }

}