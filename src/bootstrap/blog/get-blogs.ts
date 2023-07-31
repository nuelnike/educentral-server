export const GetBlogs = async () => { 

    const { Blog, Account, Status } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Save } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    let data:any;
    
    // Check redis for resource requested
    // const RedisGet = async () => {
        
    //     data = await Get("blogs"); // get cache blogs from redis
    
    //     if(!IfEmpty(data)) // if cached blogs is not empty
    //     {
    //         return { 
    //             success: true, 
    //             msg: GetStatusResponse("success").msg, 
    //             code: GetStatusResponse("success").code, 
    //             data 
    //         } // return resource
    //     }
    //     else return DBOps();
    // }
    
    // Query the database to get resource
    const DBOps = async () => {

        try {
            
            data = await Blog.findAll({
                where: { status_id: 1},
                order: [["created_at", "DESC"]],
                include: [
                    {
                        model: Status,
                        attributes: ["name"],
                        required: false,
                    },
                    {
                        model: Account,
                        required: false,
                        attributes: ["fullname", "id", "username", "photo"],
                    }
                ]
            }); 
            Save("blogs", data, null, false); // save new array to redis
            console.log("blogs fetched and cached successfully.");
            return { 
                success: true, 
                msg: GetStatusResponse("success").msg, 
                code: GetStatusResponse("success").code, 
                data 
            } // return a 404 response to requester

        } 
        catch (error:any) {
            console.log("Engine failed to Get blogs: "+ error.message);
            Logger('engine', "Failed execution: failed to Get blogs: "+ error.message); // log error message to .log file 
            return { 
                success: false, 
                msg: GetStatusResponse("internal_server_err").msg,
                code: GetStatusResponse("internal_server_err").code, 
                data: null
            }; // return a 500 response to requester;
        }
 
    }

    return await DBOps(); // Init redis function 
}