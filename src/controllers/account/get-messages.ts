import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { GetMessages } = require("../../bootstrap/account/get-messages");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    //GET ALL COUNTRY DATA
    router.post('/account-messages', (req:Request, res:Response) => {  
        let id:string = Decrypt(req.body.payload).id;
        (async () => {
        try{
            let result:any = await GetMessages(id);
            return res.json(result);
        }
        catch (err:any){
            Logger('account', `Failed to fetch messages: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();      
    });

}