import type {Request, Response} from 'express';
import { Logger } from "../../log";
import { IfEmpty } from "../../helpers";
import { GetStatusResponse } from "../../core/data/status-response";
import { Decrypt } from "../../core/security";
import { InactivateAccountSession } from "../../bootstrap/account/remove-account-session";

module.exports = (router:any) => {  
 
  //login account
  router.get("/logout/:id", (req:Request, res:Response) => { 
 
    const id = Decrypt(req.params.id);
    let resp:any;

    if(IfEmpty(id))
    {
      res.json({
        success: false, 
        code: GetStatusResponse("bad_request").code,
        msg: GetStatusResponse("bad_request").msg
      }) 
    } 
 
    else 
    { // Continue execution is check pass
      (async () => {
        try{ 

          resp = await InactivateAccountSession(id);
          if(resp?.success) { 
            return  res.json({ // Return accountonse to front end
                      success: true, 
                      code: GetStatusResponse("success").code,
                      msg: "user logout operation was successfull.",
                      data: null
                    });
          }
          else return res.json(resp);
 
        }
        catch (err:any){
          Logger('error', `Failed to logout: ${err.message}`);
          return  res.json({
                    success: false,
                    code: GetStatusResponse("internal_server_err").code,
                    msg: GetStatusResponse("internal_server_err").msg
                  })
        }
      })();
    }
      
  });

}

