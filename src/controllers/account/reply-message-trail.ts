import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { SaveMessageTrail } = require("../../bootstrap/account/save-message-trail");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    //Get messages
    router.post('/save-message-trail', (req:Request, res:Response) => {

        let payload:any = Decrypt(req.body.payload);
        
        (async () => {
        try{
            let result:any = await SaveMessageTrail(payload);
            return res.json(result);
        }
        catch (err:any){
            Logger('error', `Failed to saving messages trail reply: ${err.message}`);
            return  res.json({
                        success: false,
                        data: err.message,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();  

    });

}


