const { Blog, Status, Account } = require("../../core/database/model-listings"); // import DataHive model selector
const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
const { Logger } = require("../../log"); // import logger function
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { GetItemByID } = require("../../helpers/array-manipulation"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data

export const GetBlog = async (id:any) => {

    // const { Op } = require("sequelize"); // import operation function from sequalize
    let cache_blog:any = {};
    let blog:any;
    let cache_blogs:any = [];
    
    // Check redis for resource requested
    const RedisGet = async () => {

        if(IfEmpty(id)) return { 
                                success: false, 
                                code: GetStatusResponse("bad_request").code, 
                                msg: GetStatusResponse("bad_request").msg, 
                                data: null
                            }; // return a 500 response to requester;

        else
        {
            
                cache_blogs = await Get("blogs"); // get cache blogs from redis
                if(!IfEmpty(cache_blogs))
                {
                    cache_blog = GetItemByID(id, cache_blogs);
                    if(!IfEmpty(cache_blog))
                    {
                        return { 
                            code: GetStatusResponse("success").code, 
                            success: true, 
                            msg: GetStatusResponse("success").msg, 
                            data: cache_blog 
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
 
            blog =  await Blog.findOne({ 
                        where: { id },
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
                    })

            if(!IfEmpty(blog)) // if data is not empty
            {
                cache_blogs.push(blog);
                Save("blogs", cache_blogs, null, false); // cache session for 24 hours
                return { 
                    success: true,
                    code: GetStatusResponse("success").code,
                    msg: GetStatusResponse("success").msg,
                    data: blog
                }
            }
        } 
        catch (error:any) {
            Logger('error', "Failed execution: failed to fetch blog: "+ error.message); // log error message to .log file 
            return { 
                code: GetStatusResponse("internal_server_err").code,
                success: false,
                msg: GetStatusResponse("internal_server_err").msg,
                data: null
            }; // return a 500 response to requester;
        }
 
    }

    return await RedisGet(); // Init redis function 

}