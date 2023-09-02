export const GetListingTypes = async () => { 

    const { ListingType } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { Encrypt } = require("../../core/security"); // import Redis Get & Save functions
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    let cache_listing_types:any;
    let data:any;
    
    // Check redis for resource requested
    const RedisGet = async () => {
        
        cache_listing_types = await Get("listing_types"); // get cache listing_types from redis
    
        if(!IfEmpty(cache_listing_types)) // if cached listing_types is not empty
        {
            console.log("listing types already cached.");
            return { 
                success: true, 
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data: cache_listing_types 
            } // return resource
        }
        else return DBOps();
    }
    
    // Query the database to get resource
    const DBOps = async () => {

        try {
            
            data = await ListingType.findAll({
                attributes: ["id", "name"]
            });
            if(!IfEmpty(data)) // if data is not empty
            {
                Save("listing_types", data, null, false); // save new array to redis
                console.log("listing types fetched and cached successfully.");
                return { 
                    success: true,
                    code: GetStatusResponse("success").code, 
                    msg: GetStatusResponse("success").msg, 
                    data 
                }
            }

            else {
                console.log("no listing types currently available in the database.");
                return { 
                    success: true,
                    code: GetStatusResponse("not_found").code,
                    msg: GetStatusResponse("not_found").msg, 
                    data: [] 
                }
            }

        } 
        catch (error:any) {
            console.log("Engine failed to fetch listing types: "+ error.message);
            Logger('error', "Failed execution: failed to Get listing types: "+ error.message); // log error message to .log file 
            return { 
                success: false, 
                code: GetStatusResponse("internal_server_err").code,
                msg: GetStatusResponse("internal_server_err").msg,
                data: []  
            }; // return a 500 response to requester;
        }
 
    }

    return await RedisGet(); // Init redis function 

}