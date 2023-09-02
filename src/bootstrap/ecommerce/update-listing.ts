const { Listing } = require("../../core/database/model-listings"); // import DataHive model selector
const { DeleteItemByID } = require("../../helpers/array-manipulation");
const { GetListings } = require("./get-listings");
const { Logger } = require("../../log"); // import logger function
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { GetListing } = require("./get-listing"); // import IfEmpty function
const { Encrypt, Decrypt } = require("../../core/security"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
const { Save, Get } = require("../../libs/redis"); // import Redis Get & Save functions
let cache_listing:any = [];
 

export const UpdateListing = async (payload:any) => { 

    // Query the database to get resource
    const DBSave = async () => {

        if(IfEmpty(payload))    return {
                                    code: GetStatusResponse("bad_request").code, 
                                    success: false, 
                                    msg: GetStatusResponse("bad_request").msg,
                                    data: null 
                                }
        
        else
        {
            try 
            {

                await Listing.update(payload, { where: {id: payload.id} });

                cache_listing = await GetListings();

                if(!IfEmpty(cache_listing.data))
                {
                    cache_listing = Decrypt(cache_listing.data);
                    if(!IfEmpty(cache_listing))
                    {
                        cache_listing = DeleteItemByID(payload.id, cache_listing);
                        await Save("listings", Encrypt(cache_listing));
                    }
                }

                GetListing(payload.id);
                
                return  {
                    success: true,
                    code: GetStatusResponse("success").code,
                    msg: GetStatusResponse("success").msg,
                    data: null
                }
            }
            catch (error:any) {

                Logger('error', "Failed execution: failed to update listing: "+ error.message); // log error message to .log file 
                
                return { 
                    success: false, 
                    code: GetStatusResponse("internal_server_err").code, 
                    msg: GetStatusResponse("internal_server_err").msg,
                    data: null
                }; // return a 500 response to requester;

            }
        }
 
    }

    return await DBSave(); // Init redis function 

}