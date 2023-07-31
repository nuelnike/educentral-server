import type {Request, Response} from 'express';
const { Logger } = require("../../../log");
const { GetStatusResponse } = require("../../../core/data/status-response");
const { Decrypt } = require("../../../core/security");
const { ConfirmAccount } = require("../../../bootstrap/account/confirm-account");

module.exports = (router:any) => {  
 
  //GET ALL COUNTRY DATA
  router.post('/confirm-account-info', (req:Request, res:Response) => {  

    let { typ, ref } = Decrypt(req.body.payload);

    (async () => {
      try{
        let result:any = await ConfirmAccount(typ, ref);
        return res.json(result);
      }
      catch (err:any){
        Logger('utility', `Failed to confirm account info: ${err.message}`);
        return  res.json({
                  success: false,
                  code: GetStatusResponse("internal_server_err").code,
                  msg: GetStatusResponse("internal_server_err").msg
                })
      } 
    })();
            
  });

}