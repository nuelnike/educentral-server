export const GetPackages = async () => { 

    const { Package, Package_tier } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    let cache_packages:any = [] as any;
    let data:any;
    
    // Check redis for resource requested
    const RedisGet = async () => {
         
        cache_packages = await Get("packages"); // get cache packages from redis
    
        if(!IfEmpty(cache_packages)) // if cached packages is not empty
        {

            return { 
                success: true,
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data: JSON.parse(cache_packages)
            } // return resource

        }
        else return await DBOps();
    }
    
    // Query the database to get resource
    const DBOps = async () => {

        try {
            
            data = await Package.findAll({
                order: [["name", "ASC"]],
                include: [
                    {
                        model: Package_tier,
                        required: false
                    }]
                });
            if(!IfEmpty(data))  Save("packages", data, null, false); // save new array to redis
            return { 
                success: true, 
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data: data ?? []
            } // return a 404 response to requester
 

        } 
        catch (error:any) {
            console.log("Engine failed to fetch packages: "+ error.message);
            Logger('error', "Failed execution: failed to Get packages: "+ error.message); // log error message to .log file 
            return { 
                success: false, 
                code: GetStatusResponse("internal_server_err").code, 
                msg: GetStatusResponse("internal_server_err").msg,
                data: [] 
            }; // return a 500 response to requester;
        }
 
    }

    return await RedisGet();

}