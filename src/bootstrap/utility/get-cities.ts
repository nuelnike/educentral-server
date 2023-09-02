export const GetCities = async () => { 

    const { City } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    let cache_cities:string = "";
    let data:any;
    
    // Check redis for resource requested
    const RedisGet = async () => {
        
        cache_cities = await Get("cities"); // get cache cities from redis
    
        if(!IfEmpty(cache_cities)) // if cached cities is not empty
        {
            console.log("cities already cached."); 
            return { 
                code: GetStatusResponse("success").code,  
                success: true, 
                msg: GetStatusResponse("success").msg, 
                data: JSON.parse(cache_cities) 
            } // return resource
        }
        else return await DBOps();
    }
    
    // Query the database to get resource
    const DBOps = async () => {

        try {
            
            data = await City.findAll();
            Save("cities", data, null, false); // save new array to redis
            console.log("cities Geted and cached successfully.");
            return { 
                success: true, 
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg,
                data 
            } // return resource   

        } 
        catch (error:any) {
            console.log("Engine failed to Get cities: "+ error.message);
            Logger('error', "Failed execution: failed to Get cities: "+ error.message); // log error message to .log file 
            return { 
                success: false, 
                code: GetStatusResponse("internal_server_err").code,
                msg: GetStatusResponse("internal_server_err").msg,
                data: []
            }; // return a 500 response to requester;
        }
 
    }

    return await RedisGet(); // Init redis function;

}