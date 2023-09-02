const { Listing } = require("../../core/database/model-listings"); // import DataHive model selector
const { Logger } = require("../../log"); // import logger function
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { GetListings } = require("./get-listings");
const { Encrypt, Decrypt } = require("../../core/security"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
const { Save } = require("../../libs/redis"); // import Redis Get & Save functions
let cache_listing:any = [];

export const AddListing = async (payload:any) => { 
     
    // Query the database to get resource
    const DBSave = async () => {

        if(IfEmpty(payload))    return { 
                                    code: GetStatusResponse("bad_request").code, 
                                    success: false, 
                                    msg: GetStatusResponse("bad_request").msg,
                                    data: null
                                } // return resource
        
        else
        {
            try {


                let listing:any = await Listing.create(payload);
                // cache_listing = await GetListings(); // get cache listings from redis
                // cache_listing = !IfEmpty(cache_listing.data) ? Decrypt(cache_listing.data) : [];
                // cache_listing.push(listing); 
                
                // Save("listings", Encrypt(cache_listing), null, false); // cache session for 24 hours

                return  {
                            success: true,
                            code: GetStatusResponse("success").code,
                            msg: GetStatusResponse("success").msg,
                            data: Encrypt(listing.id)
                        }
            } 
            catch (error:any) {

                Logger('error', "Failed execution: failed to create new listing: "+ error.message); // log error message to .log file 
                
                return { 
                    success: false, 
                    code: GetStatusResponse("internal_server_err").code, 
                    msg: GetStatusResponse("internal_server_err").msg 
                }; // return a 500 response to requester;

            }
        }
 
    }

    return await DBSave(); // Init redis function 

}