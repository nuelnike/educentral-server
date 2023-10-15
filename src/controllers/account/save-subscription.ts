import type {Request, Response} from 'express';
import { Logger } from "../../log";
import { GetStatusResponse } from "../../core/data/status-response";
import { Decrypt } from "../../core/security";
import { SaveSubscription } from "../../bootstrap/account/save-subscription";
// const { SaveSubscription } = require("../../bootstrap/account/save-subscription");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);
import { IfEmpty } from "../../helpers";
import { GetFutureDateTimeStamp } from "../../helpers/date";
import { GenerateRandomString } from "../../helpers/generator";

module.exports = (router:any) => {  
 
    //Get subscriptions
    router.post('/save-subscription', ValidateSession, (req:Request, res:Response) => {

        let payload:any = Decrypt(req.body.payload);

        if(IfEmpty(payload.payment_ref) || IfEmpty(payload.account_id) || IfEmpty(payload.amount) || IfEmpty(payload.status_id) || IfEmpty(payload.package_id)){
            res.json({
                success: false, 
                code: GetStatusResponse("bad_request").code,
                msg: GetStatusResponse("bad_request").msg,
                data: null
            })
        }
        else{
            (async () => {
            try{
                payload.id = GenerateRandomString(20);
                console.log(payload);
                let result:any = await SaveSubscription(payload);
                return res.json(result);
            }
            catch (err:any){
                Logger('error', `Failed to save subscription: ${err.message}`);
                return  res.json({
                            success: false,
                            data: err.message,
                            code: GetStatusResponse("internal_server_err").code,
                            msg: GetStatusResponse("internal_server_err").msg
                        });
            }
            })();  
        }

    });

}


