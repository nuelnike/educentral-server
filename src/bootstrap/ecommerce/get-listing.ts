const { Listings } = require("../../core/database/model-listings"); // import DataHive model selector
const { GetItemByID } = require("../../helpers/array-manipulation");
const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
const { Logger } = require("../../log"); // import logger function
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { Decrypt, Encrypt } = require("../../core/security"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
let cache_listing:any = [];

export const GetListing = async (id:string) => {
    
    // Check redis for resource requested
    // const RedisGet = async () => {

    //     if(IfEmpty(id)) return { success: false, code: GetStatusResponse("bad_request").code, msg: GetStatusResponse("bad_request").msg }; // return a 500 response to requester;

    //     else
    //     { 
    //         cache_listing = await Get("listings"); // get cache listings from redis
    //         if(!IfEmpty(cache_listing))
    //         {

    //             cache_listing = Decrypt(cache_listing); 
    //             let data:any = GetItemByID(id, cache_listing); 

    //             if(!IfEmpty(data))  return { 
    //                                     success: true, 
    //                                     code: GetStatusResponse("success").code,
    //                                     msg: GetStatusResponse("success").msg, 
    //                                     data: Encrypt(data)
    //                                 };
    //             else return DBOps();

    //         }
    //         return DBOps();
    //     }
    // }
    
    // Query the database to get resource
    const DBOps = async () => {
        try {
            
            let listing:any = await Listings.findOne({ where: { account_id: id} })

            if(!IfEmpty(listing)) // if data is not empty
            {
                cache_listing.push(listing);
                Save("listings", Encrypt(cache_listing), null, false); // cache session for 24 hours
                return {
                    success: true,
                    code: GetStatusResponse("success").code,
                    msg: GetStatusResponse("success").msg, 
                    data: listing
                }
            }

            else return { code: GetStatusResponse("not_found").code, success: false, msg: GetStatusResponse("not_found").msg, data: null } // return a 404 response to requester

        } 
        catch (error:any) {
            Logger('error', "Failed execution: failed to confirm listing: "+ error.message); // log error message to .log file 
            return { code: GetStatusResponse("internal_server_err").code, success: false, msg: GetStatusResponse("internal_server_err").msg }; // return a 500 response to requester;
        }
 
    }

    return await DBOps(); // Init redis function 

}