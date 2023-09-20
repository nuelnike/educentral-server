import type {Request, Response} from 'express';
import { GetMilliSec } from '../../helpers/date';
import { UpdateAccountPassword } from '../../bootstrap/account/update-account';
const bcrypt = require('bcrypt')
const { Logger } = require("../../log");
const { IfEmpty, ValidEmailAddress } = require("../../helpers");
const { GetStatusResponse } = require("../../core/data/status-response");
const { GenerateRandomString } = require("../../helpers/generator");
const { Decrypt } = require("../../core/security");
const { GetAccount } = require("../../bootstrap/account/get-account");
const { SendMail } = require("../../core/mail");
const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions

module.exports = (router:any) => {  
 
  //login account
  router.get("/send-otp/:email", (req:Request, res:Response) => { 
 
    console.log("email");

    const email:string = Decrypt(req.params.email);
    let account:any = {};


    if(IfEmpty(email))
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
            msg: "invalid email address, try again.",
            data: null
        });
    } 
     
    else 
    { // Continue execution is check pass
      (async () => {
        try{ 

            account = await GetAccount("email", email);
            if(account?.success) {

                account = account.data;
                let otp:string = await GenerateRandomString(6);
                let duration:number = 5;
                let expiry:number = GetMilliSec("mins", duration);
                
                let MailPayload:any = {
                    payload: {name: account.fullname, otp, duration: duration+" mins"},
                    subject: 'OTP alert!',
                }

                try{
                    SendMail('otp', MailPayload, account.email);
                    Save("OTP_"+account.id, otp, expiry, true); // cache OTP for mins
                    return  res.json({ // Return accountonse to front end
                                success: true, 
                                code: GetStatusResponse("success").code,
                                msg: "OTP has been sent to your email address.",
                                data: account.id
                            });
                }
                catch (err:any){
                    Logger('error', `Failed to send OTP email: ${err.message}`);
                    return  res.json({
                                success: false,
                                code: GetStatusResponse("internal_server_err").code,
                                msg: GetStatusResponse("internal_server_err").msg
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
                        msg: GetStatusResponse("internal_server_err").msg,
                        data: null
                    });
        }
      })();
    }
      
  });
  
  //login account
  router.post("/reset-password", (req:Request, res:Response) => { 
 
    const { id, otp, password } = Decrypt(req.body.payload);
    let account:any = {} as any;
    let resp:any = {} as any;
    let hashed_password:string = "";
    let check_otp:any = "" as any;

    if(IfEmpty(id) || IfEmpty(otp) || IfEmpty(password))
    {
        res.json({
            success: false, 
            code: GetStatusResponse("bad_request").code,
            msg: GetStatusResponse("bad_request").msg
        });
    }
    else 
    { // Continue execution is check pass
      (async () => {
        try{ 

            check_otp = await Get("OTP_"+id); 

            if(check_otp == otp){
                resp = await GetAccount("id", id);
                if(resp?.success) { 
                    bcrypt.hash(password, 10, (err:any, hash:any) => { // ENCRYPT PASSWORD BEFORE ACCOUNT CREATION  
                        try {

                            hashed_password = hash;
                            
                            (async () => { 
                                return res.json(await UpdateAccountPassword(id, hashed_password));
                            })();
                            
                        }
                        catch (err:any){
                            Logger('error', `Failed to update account password : ${err.message}`);
                            return  res.json({
                                        success: false,
                                        code: GetStatusResponse("internal_server_err").code,
                                        msg: GetStatusResponse("internal_server_err").msg
                                    })
                        }
                    }); 
                }
                else return res.json(account);
            }
            else return  res.json({
                success: false,
                code: GetStatusResponse("bad_request").code,
                msg: "Sorry, we couldn`t verify your OTP for this action.",
                data: null
            });
    
        }
        catch (err:any){
          
            Logger('error', `Failed to change account password: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg,
                        data: null
                    });
        }
      })();
    }
      
  });

}

