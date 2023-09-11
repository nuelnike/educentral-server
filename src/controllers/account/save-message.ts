import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { SaveMessage } = require("../../bootstrap/account/save-message");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    //Get messages
    router.post('/save-message', (req:Request, res:Response) => {

        let payload:any = Decrypt(req.body.payload);
        
        (async () => {
        try{
            console.log(payload);
            let result:any = await SaveMessage(payload);
            return res.json(result);
        }
        catch (err:any){
            Logger('error', `Failed to fetch messages: ${err.message}`);
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


