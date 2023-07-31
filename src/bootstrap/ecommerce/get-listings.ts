const { Listing, Account, ListingType } = require("../../core/database/model-listings"); // import DataHive model selector
const { Logger } = require("../../log"); // import logger function
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { Encrypt } = require("../../core/security"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
let listings:any;

export const GetListings = async (id:string) => {
  
    const DBOps = async () => {
        try { 
            // Query the database to get resource
            
            if(id == "all")  
            {
                listings = await    Listing.findAll({
                                        order: [["created_at", "DESC"]],
                                        include: [
                                            {
                                                model: ListingType,
                                                attributes: ["name"],
                                            },
                                            {
                                                model: Account,
                                                attributes: ["fullname","username","photo"],
                                            }
                                        ]
                                    });
            }
            else
            {
                listings = await    Listing.findAll({
                                        where: { account_id: id },
                                        order: [["created_at", "DESC"]],
                                        // limit: PageSize,// limit items per payload by set query limit params
                                        // offset: PageOffset(page), // For page 1, the offset is: (1 - 1) * 20 => 0 * 20 = 0 
                                        include: [
                                            {
                                                model: ListingType,
                                                attributes: ["name"],
                                                required: false
                                            },
                                            {
                                                model: Account,
                                                attributes: ["fullname","username","photo"],
                                                required: false
                                            }
                                        ]
                                    });
            }
 
            return { 
                success: true,
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data: Encrypt(listings)
            } 
        } 
        catch (error:any) {
            Logger('engine', "Failed execution: failed to confirm listing: "+ error.message); // log error message to .log file 
            return { code: GetStatusResponse("internal_server_err").code, success: false, msg: GetStatusResponse("internal_server_err").msg }; // return a 500 response to requester;
        }
 
    }

    return await DBOps(); // Init redis function 

}