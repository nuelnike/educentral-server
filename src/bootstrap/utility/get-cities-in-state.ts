export const GetStateCities = async (id:any) => { 

    const { City } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    let cache_cities:any = "";
    let data:any = {};
    
    // Check redis for resource requested
    const RedisGet = async () => {
        if(IfEmpty(id))
        {
            return { 
                success: false, 
                code: GetStatusResponse("bad_request").code,
                msg: GetStatusResponse("bad_request").msg,
                data: []
            }; // return a 500 response to requester;
        }
        else
        {
            cache_cities = await Get("cities"); // get cache cities from redis
        
            if(!IfEmpty(cache_cities)) // if cached cities is not empty
            {
                let cities:Array<any> = JSON.parse(cache_cities); //convert redis data to array

                data = cities.filter((x:any) => x.state_id == id); // find resource in array

                if(!IfEmpty(data)) {
                    return { 
                        success: true, 
                        code: GetStatusResponse("success").code,
                        msg: GetStatusResponse("success").msg,
                        data 
                    } // return response to requester
                }
                else return await DBOps();
            }
            else return await DBOps();
        }
    }
    
    // Query the database to get resource
    const DBOps = async () => {

        try {
            
            data = await City.findAll({ // query database for resource requested
                where: {state_id: id}
            });

            return { 
                success: true, 
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg,
                data 
            } // return response to requester
            
        } 
        catch (error:any) {
            Logger('engine', "Failed execution: failed to state cities: "+ error.message); // log error message to .log file 
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