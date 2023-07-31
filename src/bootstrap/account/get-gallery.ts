export const GetGallery = async (id:string) => {

    const { Gallery } = require("../../core/database/model-listings");
    const { Logger } = require("../../log");
    const { Encrypt } = require("../../core/security");
    const { GetStatusResponse } = require("../../core/data/status-response");
    const { Op } = require("sequelize"); // import operation function from sequalize
     
    try {

        let galleries:any =     await Gallery.findAll({
                                    order: [["created_at", "DESC"]],
                                    where: { [Op.or]: [{account_id: id}]}
                                });

        return  { 
                    code: GetStatusResponse("success").code, 
                    success: true,
                    msg: GetStatusResponse("success").msg, 
                    data: Encrypt(galleries)
                } 

    } 
    catch (error:any) {
        Logger('engine', "Failed execution: failed to fetch account galleries: "+ error.message);
        return  { 
                    code: GetStatusResponse("internal_server_err").code, 
                    success: false, 
                    msg: GetStatusResponse("internal_server_err").msg
                }; // return a 500 response to requester;
    }

}