export const GetMessages = async (id:string) => {

    const { Message, Account } = require("../../core/database/model-listings");
    const { Logger } = require("../../log");
    const { IfEmpty } = require("../../helpers");
    const { Encrypt } = require("../../core/security");
    const { GetStatusResponse } = require("../../core/data/status-response");
    const { Op } = require("sequelize"); // import operation function from sequalize
     
    try {

        let messages:any =  await Message.findAll({
                                where: { [Op.or]: [{ref_id: id}, {sender: id}]},
                                include:  [{
                                    model: Account,
                                    attributes: ["fullname","username","photo"],
                                    required: false,
                                    as: "from"
                                },
                                {
                                    model: Account,
                                    attributes: ["fullname","username","photo"],
                                    required: false,
                                    as: "to"
                                }]
                            });

        if(!IfEmpty(messages))  return { 
                                    code: GetStatusResponse("success").code, 
                                    success: true, 
                                    msg: GetStatusResponse("success").msg, 
                                    data: Encrypt(messages)
                                }

        else return { 
                        code: GetStatusResponse("not_found").code, 
                        success: false, msg: GetStatusResponse("not_found").msg, 
                        data: null 
                    }

    } 
    catch (error:any) {
        Logger('engine', "Failed execution: failed to fetch account messages: "+ error.message);
        return  { 
                    code: GetStatusResponse("internal_server_err").code, 
                    success: false, 
                    msg: GetStatusResponse("internal_server_err").msg
                }; // return a 500 response to requester;
    }

}