export const GetAllSubscriptions = async () => { 

    const { Subscription, Account, Payment, Package, Status } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    const { Op } = require("sequelize"); // import operation function from sequalize
    let data:any = [] as any;
    
    // Check redis for resource requested
    const RedisGet = async () => {
        
        data = await Get("subscriptions") || []; // get cache subscriptions from redis
    
        if(!IfEmpty(data)) // if cached subscriptions is not empty
        {
            data = { 
                success: true,
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data 
            } // return resource
        }
        else return await DBOps();
    }
    
    // Query the database to get resource
    const DBOps = async () => {

        try {
            
            data = await    Subscription.findAll({
                                include: [ 
                                    {
                                        model: Status,
                                        attributes: ["name"],
                                        required: false
                                    },
                                    {
                                        model: Account,
                                        attributes: ["fullname"],
                                        required: false
                                    },
                                    {
                                        model: Payment,
                                        required: false
                                    },
                                    {
                                        model: Package,
                                        attributes: ["name"],
                                        required: false
                                    }  
                                ] 
                            });
            if(!IfEmpty(data)) // if data is not empty
            { 
                Save("subscriptions", data, null, false); // save new array to redis
                console.log("subscriptions fetched and cached successfully.");
            }
            return { 
                success: true, 
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data 
            } // return a 404 response to requester
 

        } 
        catch (error:any) {
            console.log("Engine failed to fetch subscriptions: "+ error.message);
            Logger('error', "Failed execution: failed to Get subscriptions: "+ error.message); // log error message to .log file 
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