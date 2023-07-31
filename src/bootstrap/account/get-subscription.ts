

export const GetSubscription = async (id:any) => { 

    const { Subscription, Account, Payment, Package } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function 
    const { GetItemByID } = require("../../helpers/array-manipulation");
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    let cache_subscription:any = "" as any;
    let arr:Array<any> = [];
    let data:any;
    
    // Check redis for resource requested
    const RedisGet = async () => {
        
        arr = await Get("subscriptions"); // get cache subscriptions from redis

        cache_subscription = await GetItemByID(arr, id);
    
        if(!IfEmpty(cache_subscription)) // if cached subscriptions is not empty
        {
            data = { 
                success: true,
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data: cache_subscription 
            } // return resource
        }
        else return DBOps();
    }
    
    // Query the database to get resource
    const DBOps = async () => {

        try {
            
            data = await    Subscription.findOne({
                                where: { id },
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
                arr.push(data);
                Save("subscription", arr, null, false); // save new array to redis
                console.log("subscription fetched and cached successfully.");
            }

            return { 
                success: true, 
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data 
            } // return a 404 response to requester
 
        } 
        catch (error:any) {
            console.log("Engine failed to fetch subscription: "+ error.message);
            Logger('engine', "Failed execution: failed to Get subscription: "+ error.message); // log error message to .log file 
            return { 
                success: false, 
                code: GetStatusResponse("internal_server_err").code, 
                msg: GetStatusResponse("internal_server_err").msg,
                data: null
            }; // return a 500 response to requester;
        }
 
    }

    return await RedisGet();

}