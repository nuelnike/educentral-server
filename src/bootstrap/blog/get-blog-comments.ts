const { Comments, Account } = require("../../core/database/model-listings"); // import DataHive model selector
const { Logger } = require("../../log"); // import logger function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
const { Op } = require("sequelize"); // import operation function from sequalize

export const GetBlogComments = async (id:any) => { 

    let comments:any = [];
    
    // Query the database to get resource
    const DBOps = async () => {
        try {

            comments =  await Comments.findAll({ 
                                    order: [["created_at", "DESC"]],
                                    where: { [Op.or]: [{ref_id: id}]},
                                    include:    [{
                                                    model: Account,
                                                    required: false,
                                                    attributes: ["fullname", "id", "username", "photo"],
                                                }]
                        });

                return { 
                    success: true,
                    code: GetStatusResponse("success").code,
                    msg: GetStatusResponse("success").msg,
                    data: comments
                }
        } 
        catch (error:any) {
            Logger('engine', "Failed execution: failed to confirm blog: "+ error.message); // log error message to .log file 
            return { 
                code: GetStatusResponse("internal_server_err").code,
                success: false,
                msg: GetStatusResponse("internal_server_err").msg,
                data: null
            }; // return a 500 response to requester;
        }
 
    }

    return await DBOps(); // Init redis function 

}