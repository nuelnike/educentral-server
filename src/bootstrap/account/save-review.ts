import { RoundOff } from "../../helpers";
const { Decrypt } = require("../../core/security"); // import DataHive model selector
const { GetReviews } = require("./get-reviews"); // import DataHive model selector
const { UpdateAccount } = require("./update-account"); // import DataHive model selector
const { Review } = require("../../core/database/model-listings"); // import DataHive model selector
const { Logger } = require("../../log"); // import logger function
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data 

export const SaveReview = async (payload:any) => { 
     
    // Query the database to get resource
    const DBSave = async () => {

        if(IfEmpty(payload)) return { 
                                code: GetStatusResponse("bad_request").code, 
                                success: false, 
                                data: [],
                                msg: GetStatusResponse("bad_request").msg
                            } // return resource
        
        else
        {
            try {
    
                await Review.create(payload);

                let revs:any = await GetReviews(payload.ref_id);

                let new_rating:number = (Number(payload.rating) + Number(payload.old_ratings)) / Decrypt(revs.data).length;

                await UpdateAccount({id: payload.ref_id, ratings: RoundOff(new_rating, 1) });

                return revs;
                
            } 
            catch (error:any) {

                Logger('error', "Failed execution: failed to save review: "+ error.message); // log error message to .log file

                return  { 
                            code: GetStatusResponse("internal_server_err").code, 
                            success: false, 
                            data: error.message,
                            msg: GetStatusResponse("internal_server_err").msg 
                        }; // return a 500 response to requester;
            }
        }
 
    }

    return await DBSave(); // Init redis function 

}