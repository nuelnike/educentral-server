export const GetCountryStates = async (ref:string) => { 

    const { State } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    let cache_states:any = "";
    let data:any = {};
    
    // Check redis for resource requested
    const RedisGet = async () => {
        if(IfEmpty(ref))
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
            cache_states = await Get("states"); // get cache states from redis
        
            if(!IfEmpty(cache_states)) // if cached states is not empty
            {
                let states:Array<any> = cache_states; //convert redis data to array

                data = states.filter((x:any) => x.country_id == ref); // find resource in array

                if(!IfEmpty(data)) {
                    return { 
                        success: true, 
                        msg: GetStatusResponse("success").msg, 
                        code: GetStatusResponse("success").code, 
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
            
            data = await State.findAll({ // query database for resource requested
                where: {country_id: ref}
            });

            return { 
                success: true, 
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data 
            } // return response to requester


        } 
        catch (error:any) {
            Logger('engine', "Failed execution: failed to country states: "+ error.message); // log error message to .log file 
            return { 
                success: false, 
                code: GetStatusResponse("success").code,  
                msg: GetStatusResponse("internal_server_err").msg,
                data: []
            }; // return a 500 response to requester;
        }
 
    }

    return await RedisGet();

}