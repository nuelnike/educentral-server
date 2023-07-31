import type {Request, Response} from 'express';
const bcrypt = require('bcrypt');
const { Logger } = require("../../log");
const { IfEmpty, ValidEmailAddress } = require("../../helpers");
const { GetStatusResponse } = require("../../core/data/status-response");
const { StatusCode } = require("../../core/data");
const { GenerateToken } = require("../../helpers/generator");
const { Encrypt, Decrypt } = require("../../core/security");
const { GetAccount } = require("../../bootstrap/account/get-account");
const { SaveAccountSession } = require("../../bootstrap/account/save-account-session");
const { SendMail } = require("../../core/mail");

module.exports = (router:any) => {  
 
  //login account
  router.post("/login", (req:Request, res:Response) => { 
 
    const { email, password }: {email:string, password:string} = Decrypt(req.body.payload);
    let account:any;

    if(IfEmpty(email) || IfEmpty(password))
    {
      res.json({
        success: false, 
        code: GetStatusResponse("bad_request").code,
        msg: GetStatusResponse("bad_request").msg
      }) 
    } 

    else if (!ValidEmailAddress(email)) 
    { // END EXECUTION IF THERE IS AN ISSUE WITH EMAIL PROVIDED 
      res.json({
        success: false,
        code: GetStatusResponse("bad_request").code,
        msg: "invalid email address, try again."
      })
    } 
     
    else 
    { // Continue execution is check pass
      (async () => {
        try{ 

          account = await GetAccount("email", email);
          if(account?.success) {
            account = account.data;
            if (bcrypt.compareSync(password, account.password)) { // Encrypt AND CHECK ACCOUNT PASSWORD MATCH  
                
              if (account.status_id === StatusCode.inactive){
                return  res.json({
                          success: false,
                          code: GetStatusResponse("unauthorized").code,
                          msg: GetStatusResponse("unauthorized").msg
                        })
              }
              else if (account.status_id === StatusCode.active){

                let token:string = GenerateToken();
                let session:any = { token, account_id: account.id, status_id: StatusCode.online };
                
                try{ 
                  let save_session:any = await SaveAccountSession(session);
                  if(save_session?.success)
                  {
                    delete account["password"]; // remove password from object data.
                    account.token = token;

                    let MailPayload:any = {
                      name: account.fullname,
                      subject: 'Login alert!'
                    }
 
                    try{
                      
                      SendMail('login', MailPayload, account.email) 

                      return  res.json({ // Return accountonse to front end
                                success: true, 
                                code: GetStatusResponse("success").code,
                                msg: "welcome, " + account.username,
                                data: Encrypt(account)
                              }); 
                    }
                    catch (err:any){
                      Logger('error', `Failed to send login email: ${err.message}`);
                      return  res.json({
                                success: false,
                                code: GetStatusResponse("internal_server_err").code,
                                msg: GetStatusResponse("internal_server_err").msg
                              })
                    }
                  } 
                  else return res.json(save_session); // return any error encountered while saving 

                }
                catch (err:any){
                  Logger('error', `Failed to save account session: ${err.message}`);
                  return  res.json({
                            success: false,
                            code: GetStatusResponse("internal_server_err").code,
                            msg: GetStatusResponse("internal_server_err").msg
                          })
                }
              }  
            }  
            else { // RESTURN RESPONSE IF PASSWORD IS WRONG.
              return  res.json({
                        success: false,
                        code: GetStatusResponse("bad_request").code,
                        msg: "password is invalid, try again"
                      })
            }
          }
          else return res.json(account);
 
        }
        catch (err:any){
          
          Logger('error', `Failed to login: ${err.message}`);
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

