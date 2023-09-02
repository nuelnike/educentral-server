export const GetChats = async (payload:any) => {

    const { Message, Account, MessageTrail } = require("../../core/database/model-listings");
    const { Logger } = require("../../log");
    const { IfEmpty } = require("../../helpers");
    const { Encrypt } = require("../../core/security");
    const { GetStatusResponse } = require("../../core/data/status-response");
    const { Op } = require("sequelize"); // import operation function from sequalize
     
    try {
        let messages:any = [];
        if(payload.typ == "accounts")
        {
            messages =  await Message.findAll({
                where: { [Op.or]: [{account_id: payload.id}, {sender: payload.id}]},
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
        }
        else
        {
            messages =  await Message.findOne({
                where: { listing_id: payload.id },
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
                },
                {
                    model: MessageTrail,
                    required: false
                }
            ]
            });

        }

        return { 
                    success: true,
                    data: Encrypt(messages),
                    code: GetStatusResponse("success").code, 
                    msg: GetStatusResponse("success").msg
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