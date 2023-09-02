export const GetMessage = async (id:any) => {

    const { Message, MessageTrail, Account } = require("../../core/database/model-listings");
    const { Logger } = require("../../log");
    const { IfEmpty } = require("../../helpers");
    const { Encrypt } = require("../../core/security");
    const { GetStatusResponse } = require("../../core/data/status-response");
    const { Op } = require("sequelize"); // import operation function from sequalize
     
    try {

        let message:any =  await Message.findOne({
                                where: { [Op.or]: [{ref_id: id}, {sender: id}, {receiver: id}]},
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
            code: GetStatusResponse("success").code, 
            success: true, 
            msg: GetStatusResponse("success").msg, 
            data: Encrypt(message)
        }

    } 
    catch (error:any) {
        Logger('error', "Failed execution: failed to fetch account message: "+ error.message);
        return  { 
                    code: GetStatusResponse("internal_server_err").code, 
                    success: false, 
                    data: null,
                    msg: GetStatusResponse("internal_server_err").msg
                }; // return a 500 response to requester;
    }

}