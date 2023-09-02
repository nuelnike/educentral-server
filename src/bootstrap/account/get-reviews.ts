export const GetReviews = async (id:any) => {

    const { Review } = require("../../core/database/model-listings");
    const { Logger } = require("../../log");
    const { Encrypt } = require("../../core/security");
    const { GetStatusResponse } = require("../../core/data/status-response");
     
    try {
        let reviews:any = [];
            reviews =  await Review.findAll({
                order: [["created_at", "DESC"]],
                where: { ref_id: id }
            });
        return { 
                    success: true,
                    data: Encrypt(reviews),
                    code: GetStatusResponse("success").code, 
                    msg: GetStatusResponse("success").msg
                }

    } 
    catch (error:any) {
        Logger('error', "Failed execution: failed to fetch account reviews: "+ error.message);
        return  { 
                    code: GetStatusResponse("internal_server_err").code, 
                    success: false, 
                    data: [],
                    msg: GetStatusResponse("internal_server_err").msg
                }; // return a 500 response to requester;
    }

}