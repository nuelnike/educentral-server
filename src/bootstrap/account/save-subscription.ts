import { GetAllSubscriptions } from "./get-all-subscriptions";
import { Get, Save } from "../../libs/redis"; // import Redis Get & Save functions
const { Payment, Subscription } = require("../../core/database/model-listings"); // import DataHive model selector
import { Logger } from "../../log"; // import logger function
import { IfEmpty } from "../../helpers"; // import IfEmpty function
import { GetStatusResponse } from "../../core/data/status-response"; // import custom status response data 
let payment:any = {} as any;
let resp:any = null as any;
let arr:Array<any> = [] as any;

export const SaveSubscription = async (payload:any) => { 
     
    // Query the database to get resource
    const DBSave = async () => {

        if(IfEmpty(payload)) return { 
                                code: GetStatusResponse("bad_request").code, 
                                success: false, 
                                data: null,
                                msg: GetStatusResponse("bad_request").msg
                            } // return resource
        
        else
        {
            try {
    
                await Payment.create(payload, {returning: true});

                await Subscription.create({
                    payment_id: payload.id,
                    account_id: payload.account_id,
                    package_id: payload.package_id,
                    package_tier_id: payload.package_tier_id,
                    expiry: payload.expiry,
                    status_id:  payload.status_id
                });
                
                resp = await GetAllSubscriptions();

                Save("subscriptions", resp?.data || [], 0, false); // save new array to redis

                return  { 
                    code: GetStatusResponse("success").code, 
                    success: true, 
                    data: null,
                    msg: GetStatusResponse("success").msg 
                };
                
            } 
            catch (error:any) {

                Logger('error', "Failed execution: failed to save review: "+ error.message); // log error message to .log file

                return  { 
                            code: GetStatusResponse("internal_server_err").code, 
                            success: false, 
                            data: error.message,
                            msg: GetStatusResponse("internal_server_err").msg 
                        }; // return a 500 response to requester;
            }
        }
 
    }

    return await DBSave(); // Init redis function 

}