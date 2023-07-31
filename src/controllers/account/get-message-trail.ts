import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { GetMessageTrail } = require("../../bootstrap/account/get-message-trail");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    //GET ALL COUNTRY DATA
    router.get('/message-trail/:id', (req:Request, res:Response) => {
        let id:string = Decrypt(req.params.id);
        (async () => {
        try{
            let result:any = await GetMessageTrail(id);
            return res.json(result);
        }
        catch (err:any){
            Logger('account', `Failed to fetch message trails: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();      
    });

}