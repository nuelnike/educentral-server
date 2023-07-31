export const GetState = async (ref:string) => { 

    const { State } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    const { Op } = require("sequelize"); // import operation function from sequalize
    let cache_states:any = "";
    let data:any = {};
    
    // Check redis for resource requested
    const RedisGet = async () => {
        if(IfEmpty(ref))
        {
            return { 
                success: false, 
                msg: GetStatusResponse("bad_request").msg,
                code: GetStatusResponse("bad_request").code,
                data: []
            }; // return a 500 response to requester;
        }
        else
        {
            cache_states = await Get("states"); // get cache states from redis
        
            if(!IfEmpty(cache_states)) // if cached states is not empty
            {
                let states:Array<any> = cache_states; //convert redis data to array

                data = states.find(x => x.id == ref || x.name == ref); // find resource in array

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
            
            data = await State.findOne({ // query database for resource requested
                where: { [Op.or]: [{id: ref}, {name: ref}]},
                attributes: ["id","first_name","surname","other_name","username","status_id","email","phone","address","photo","gender","password"]
            })
            if(!IfEmpty(data)) // if data is not empty
            {
                let states:Array<any> = JSON.parse(cache_states); // convert cached data to array
                states.push(data); // push new data into array
                Save("states", states, null, false); // save new array to redis
                return { 
                    success: true,
                    code: GetStatusResponse("success").code, 
                    msg: GetStatusResponse("success").msg, 
                    data 
                } // return response to requester
            }

            else return { 
                success: true,
                code: GetStatusResponse("not_found").code,
                msg: GetStatusResponse("not_found").msg, 
                data: [] 
            } // return a 404 response to requester

        } 
        catch (error:any) {
            Logger('engine', "Failed execution: failed to Get account: "+ error.message); // log error message to .log file 
            return { 
                success: false, 
                code: GetStatusResponse("internal_server_err").code,
                msg: GetStatusResponse("internal_server_err").msg,
                data: []
            }; // return a 500 response to requester;
        }
 
    } 

    return await RedisGet();;

}