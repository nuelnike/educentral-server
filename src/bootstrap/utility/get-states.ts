export const GetStates = async (id:any) => { 

    const { State } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    let cache_states:string = "";
    let data:any;
    
    // Check redis for resource requested
    const RedisGet = async () => {
        
        cache_states = await Get("states"); // get cache states from redis
    
        if(!IfEmpty(cache_states)) // if cached states is not empty
        { 
            console.log("states already cached.");
            return { 
                success: true,
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data: cache_states 
            } // return resource
        }
        else return await DBOps();
    }
    
    // Query the database to get resource
    const DBOps = async () => {

        try {
            
            data = await State.findAll();
            if(!IfEmpty(data)) // if data is not empty
            { 
                Save("states", data, null, false); // save new array to redis
                console.log("states Geted and cached successfully.");
                return { 
                    success: true, 
                    code: GetStatusResponse("success").code,
                    msg: GetStatusResponse("success").msg, 
                    data 
                } // return resource
            }

            else {
                console.log("no states currently available in the database.");
                return { 
                    success: true, 
                    code: GetStatusResponse("not_found").code, 
                    msg: GetStatusResponse("not_found").msg, 
                    data: []
                } // return a 404 response to requester
            }

        } 
        catch (error:any) {
            console.log("Engine failed to Get states: "+ error.message);
            Logger('error', "Failed execution: failed to Get states: "+ error.message); // log error message to .log file 
            return { 
                success: false, 
                msg: GetStatusResponse("internal_server_err").msg,
                code: GetStatusResponse("internal_server_err").code, 
                data: []
            }; // return a 500 response to requester;
        }
 
    }

    return await RedisGet(); // Init redis function ;

}