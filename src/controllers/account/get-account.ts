import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { GetAccount } = require("../../bootstrap/account/get-account"); 
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    router.get('/get-account/:payload', (req:Request, res:Response) => {  
        let param:any = Decrypt(req.params.payload);
        let typ:string = param.typ;
        let ref:string = param.ref; 
        (async () => {
        try{
            let result:any = await GetAccount(typ, ref);
            return res.json(result);
        }
        catch (err:any){
            Logger('error', `Failed to fetch account: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();      
    }); 

}