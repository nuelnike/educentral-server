import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { GetSubscription } = require("../../bootstrap/account/get-subscription");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    //GET ALL COUNTRY DATA
    router.get('/get-subscription/:id', ValidateSession, (req:Request, res:Response) => {  
        let id:any = Decrypt(req.params.id);
        (async () => {
        try{
            let result:any = await GetSubscription(id);
            return res.json(result);
        }
        catch (err:any){
            Logger('account', `Failed to fetch subscriptions: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();      
    });

}