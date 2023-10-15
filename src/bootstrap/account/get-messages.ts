export const GetMessages = async (user_id:string, resource_id:string = "") => {

    const { Message, Account } = require("../../core/database/model-listings");
    const { Logger } = require("../../log");
    const { IfEmpty } = require("../../helpers");
    const { Encrypt } = require("../../core/security");
    const { GetStatusResponse } = require("../../core/data/status-response");
    const { Op } = require("sequelize"); // import operation function from sequalize
     
    try
    {

        let where_clause:any;
        if (IfEmpty(resource_id)) where_clause = { [Op.or]: [{ref_id: user_id}, {sender: user_id}] };
        else where_clause = {ref_id: resource_id}, {sender: user_id};

        let messages:any =  await Message.findOne({
                                where: where_clause,
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

                            return { 
                                code: GetStatusResponse("success").code, 
                                success: true, 
                                msg: GetStatusResponse("success").msg, 
                                data: messages
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