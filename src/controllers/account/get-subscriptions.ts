import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { GetSubscriptions } = require("../../bootstrap/account/get-subscriptions");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    //GET ALL COUNTRY DATA
    router.get('/get-subscriptions/:id/:typ', ValidateSession, (req:Request, res:Response) => {  
        let id:any = Decrypt(req.params.id);
        let typ:any = req.params.typ;
        (async () => {
        try{
            let result:any = await GetSubscriptions(id, typ);
            return res.json(result);
        }
        catch (err:any){
            Logger('error', `Failed to fetch subscriptions: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();      
    });

}