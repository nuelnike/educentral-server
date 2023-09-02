export const GetCountries = async () => { 

    const { Country } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    let cache_countries:string = "";
    let countries:any = [];
    
    // Check redis for resource requested
    const RedisGet = async () => {
        
        cache_countries = await Get("countries"); // get cache countries from redis
    
        if(!IfEmpty(cache_countries)) // if cached countries is not empty
        {
            console.log("countries already cached.");
            return { success: true, msg: GetStatusResponse("success").msg, data: JSON.parse(cache_countries) } // return resource
        }
        else return DBOps();
    }
    
    // Query the database to get resource
    const DBOps = async () => {

        try {
            
            countries = await Country.findAll(); 
            if(!IfEmpty(countries)) // if data is not empty
            { 
                Save("countries", countries, null, false); // save new array to redis
                console.log("countries fetched and cached successfully.");
                return { code: GetStatusResponse("success").code, success: true, msg: GetStatusResponse("success").msg, data: countries } // return resource
            }

            else {
                console.log("no countries currently available in the database.");
                return { success: false, code: GetStatusResponse("not_found").code, msg: GetStatusResponse("not_found").msg, data: null } // return a 404 response to requester
            }

        } 
        catch (error:any) {
            console.log("Engine failed to Get countries: "+ error.message);
            Logger('error', "Failed execution: failed to fetched countries: "+ error.message); // log error message to .log file 
            return { success: false, msg: GetStatusResponse("internal_server_err").msg }; // return a 500 response to requester;
        }
 
    }

    return await RedisGet(); // Init redis function

}