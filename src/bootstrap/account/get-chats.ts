export const GetChats = async (account_id:string, ref_id:string) => {

    const { Message, Account, MessageTrail } = require("../../core/database/model-listings");
    const { Logger } = require("../../log");
    const { Encrypt } = require("../../core/security");
    const { GetStatusResponse } = require("../../core/data/status-response");
     
    try {
        let messages:any = []; 
        messages =  await Message.findOne({
                    where: { sender: account_id, ref_id },
                    order: [["created_at", "ASC"]],
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
                        order: [["created_at", "desc"]],
                        separate: true,
                        required: false,
                        include:  [{
                            model: Account,
                            attributes: ["fullname","username","photo"],
                            required: false
                        }]
                    }
                ]
        });

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