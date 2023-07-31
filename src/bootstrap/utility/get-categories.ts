export const GetCategories = async () => { 

    const { Category } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Encrypt } = require("../../core/security"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    let cache_categories:any;
    let data:any;
    
    // Check redis for resource requested
    const RedisGet = async () => {
        
        cache_categories = await Get("categories"); // get cache categories from redis
    
        if(!IfEmpty(cache_categories)) // if cached categories is not empty
        {
            console.log("categories already cached.");
            return { 
                success: true, 
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data: cache_categories 
            } // return resource
        }
        else return DBOps();
    }
    
    // Query the database to get resource
    const DBOps = async () => {

        try {
            
            data = await Category.findAll({
                attributes: ["id", "name"]
            });
            if(!IfEmpty(data)) // if data is not empty
            { 
                Save("categories", data, null, false); // save new array to redis
                console.log("categories fetched and cached successfully.");
                return { 
                    success: true,
                    code: GetStatusResponse("success").code, 
                    msg: GetStatusResponse("success").msg, 
                    data
                }
            }

            else {
                console.log("no categories currently available in the database.");
                return { 
                    success: true,
                    code: GetStatusResponse("not_found").code,
                    msg: GetStatusResponse("not_found").msg, 
                    data: [] 
                }
            }

        } 
        catch (error:any) {
            console.log("Engine failed to Get categories: "+ error.message);
            Logger('engine', "Failed execution: failed to Get categories: "+ error.message); // log error message to .log file 
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