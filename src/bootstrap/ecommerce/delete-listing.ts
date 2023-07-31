const { Listing } = require("../../core/database/model-listings"); // import DataHive model selector
const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
const { Logger } = require("../../log"); // import logger function
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { Decrypt, Encrypt } = require("../../core/security"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
const { DeleteItemByID } = require("../../helpers/array-manipulation");
let cache_listing:any = [];

export const DeleteListing = async (id:number) => {
    
    // Check redis for resource requested
    const RedisGet = async () => {

        if(IfEmpty(id)) return { 
                            success: false, 
                            code: GetStatusResponse("bad_request").code, 
                            msg: GetStatusResponse("bad_request").msg,
                            data:null
                        }; // return a 500 response to requester;

        else
        { 
            cache_listing = await Get("listings"); // get cache listings from redis
            if(!IfEmpty(cache_listing?.data))
            {

                cache_listing = Decrypt(cache_listing.data);
                if(!IfEmpty(cache_listing))
                {
                    cache_listing = DeleteItemByID(id, cache_listing);
                    Save("listings", Encrypt(cache_listing), null, false); // cache session for 24 hours
                    return DBOps();
                }
                else return DBOps();

            }
            return DBOps();
        }
    }
    
    // Query the database to get resource
    const DBOps = async () => {
        try {
            await Listing.destroy({ where: {id} });
            return { 
                success: true,
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data: null
            }
        } 
        catch (error:any) {
            Logger('engine', "Failed execution: failed to delete listing : "+ error.message); // log error message to .log file 
            return { 
                success: false, 
                code: GetStatusResponse("internal_server_err").code, 
                msg: GetStatusResponse("internal_server_err").msg, 
                data: null 
            };
        }
 
    }

    return await RedisGet(); // Init redis function 

}