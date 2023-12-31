import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { GetMessages } = require("../../bootstrap/account/get-messages");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    //GET ALL COUNTRY DATA
    router.get('/account-messages/:user_id/:resource_id', (req:Request, res:Response) => {
        let user_id:string = Decrypt(req.params.user_id);
        let resource_id:string = req.params.resource_id;
        (async () => {
        try{
            let result:any = await GetMessages(user_id, resource_id);
            return res.json(result);
        }
        catch (err:any){
            Logger('error', `Failed to fetch messages: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();      
    });

}