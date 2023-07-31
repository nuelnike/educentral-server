const bcrypt = require('bcrypt')
import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { IfEmpty, ValidEmailAddress } = require("../../helpers");
const { GetStatusResponse } = require("../../core/data/status-response");
const { StatusCode } = require("../../core/data");
const { GenerateToken } = require("../../helpers/generator");
const { Encrypt, Decrypt } = require("../../core/security");
const { CreateNewAccount } = require("../../bootstrap/account/create-account");
const { SaveAccountSession } = require("../../bootstrap/account/save-account-session");
const { ConfirmAccount } = require("../../bootstrap/account/confirm-account");
const { ConfirmSchool } = require("../../bootstrap/school/confirm-school");
const { CreateSchool } = require("../../bootstrap/school/create-school");
const { GenerateRandomString } = require("../../helpers/generator");

module.exports = (router:any) => {  
 
  //login account
  router.post("/register-school", (req:Request, res:Response) => { 

    const req_body = Decrypt(req.body.payload);
 
    if ( IfEmpty(req_body.username) || IfEmpty(req_body.password) || IfEmpty(req_body.fullname) || IfEmpty(req_body.school.name) || IfEmpty(req_body.school.school_category_id) || IfEmpty(req_body.email) || IfEmpty(req_body.phone) || IfEmpty(req_body.gender) || IfEmpty(req_body.address) || IfEmpty(req_body.country_id) || IfEmpty(req_body.state_id)) {
        return  res.json({ // CHECK IF ALL REQUIRED INPUT IS SET
                    success: false, 
                    data: null,
                    code: GetStatusResponse("bad_request").code,
                    msg: GetStatusResponse("bad_request").msg
                })
    } 

    else if (!ValidEmailAddress(req_body.email)) { // CHECK ACCOUNT/ORGANIZATION EMAIL ADDRESS VALIDITY
        return  res.json({ // CHECK IF ALL REQUIRED INPUT IS SET
                    success: false,
                    code: GetStatusResponse("bad_request").code,
                    msg: "provide a valid personal email address"
                })
    } 

    else if (req_body.password.length < 5) { // CHECK PASSWORD LENGTH
        return  res.json({
                    success: false,
                    code: GetStatusResponse("bad_request").code,
                    msg: 'password must be more atleast 5 characters!'
                })
    } 

    else if (req_body.password !== req_body.cpassword) { // CHECK SERVER SIDE PASSWORD MATCH 
        return  res.json({
                    success: false,
                    code: GetStatusResponse("bad_request").code,
                    msg: 'passwords don`t match, try again!'
                })
    } 
     
    else 
    { // Continue execution is check pass
      (async () => {
        try{ 

            let ConfirmEmail:any = await ConfirmAccount("email", req_body.email);
            let ConfirmAccountname:any = await ConfirmAccount("username", req_body.username);
            let ConfirmSchoolName:any = await ConfirmAccount("name", req_body.school.name);

            if(ConfirmEmail.code == GetStatusResponse("not_found").code && ConfirmAccountname.code == GetStatusResponse("not_found").code && ConfirmSchoolName.code == GetStatusResponse("not_found").code)
            {
                
                try {
                    bcrypt.hash(req_body.password, 10, (err:any, hash:any) => { // ENCRYPT PASSWORD BEFORE ACCOUNT CREATION  
                        req_body.password = hash;
                        req_body.status_id = StatusCode.active;
                        req_body.id = GenerateRandomString(20);

                        try {
                            
                            (async () => {

                                let result:any = await CreateNewAccount(req_body);
                                let account:any = result.data;

                                
                                if(result.success)
                                {
                                    req_body.account_id = account.id;
                                    req_body.id = GenerateRandomString(20);
                                    let _result:any = await CreateSchool(req_body);
                                    let school:any = _result.data;

                                    if(_result.success)
                                    {
                                        let token:string = GenerateToken();
                                        let session:any = { token, account_id: req_body.id, status_id: StatusCode.online };
                                
                                        try{
                                            (async () => {

                                                let save_session:any = await SaveAccountSession(session);

                                                if(save_session?.success) {
                                                    
                                                    let data:any = {
                                                        account: Encrypt(account), 
                                                        authentication: Encrypt(session.token)
                                                    }

                                                    return  res.json({ // Return accountonse to front end
                                                                success: true, 
                                                                code: GetStatusResponse("success").code,
                                                                msg: "welcome, " + account.username,
                                                                data
                                                            }); 
                                                }
                                                else return res.json(save_session); // return any error encountered while saving  
                                            })();
                                        }
                                        catch (err:any){
                                            Logger('auth', `Failed to save account session: ${err.message}`);
                                            return  res.json({
                                                        success: true,
                                                        code: GetStatusResponse("success").code,
                                                        msg: GetStatusResponse("success").msg
                                                    });
                                        }
                                    }
                                    else res.json(result);
                                }
                                else res.json(result);

                            })();
                            
                        }
                        catch (err:any){
                            Logger('auth', `Failed to save new school : ${err.message}`);
                            return  res.json({
                                        success: false,
                                        code: GetStatusResponse("internal_server_err").code,
                                        msg: GetStatusResponse("internal_server_err").msg
                                    })
                        }
                    });
                }
                catch (err:any){
                    Logger('auth', `Failed to save new school: ${err.message}`);
                    return  res.json({
                                success: false,
                                code: GetStatusResponse("internal_server_err").code,
                                msg: GetStatusResponse("internal_server_err").msg
                            })
                }

            }
            else if(ConfirmEmail.code == GetStatusResponse("success").code)
            {
                return  res.json({
                            success: false,
                            code: GetStatusResponse("resource_exist").code,
                            msg: "account email already exist, try again."
                        })
            }
            else if(ConfirmAccountname.code == GetStatusResponse("success").code)
            {
                return  res.json({
                            success: false,
                            code: GetStatusResponse("resource_exist").code,
                            msg: "username already exist, try again."
                        })
            }
            else if(ConfirmSchoolName.code == GetStatusResponse("success").code)
            {
                return  res.json({
                            success: false,
                            code: GetStatusResponse("resource_exist").code,
                            msg: "School name already exist, try again."
                        })
            }
            else if(!ConfirmEmail.success) return res.json(ConfirmEmail);
            else if(!ConfirmAccountname.success) return res.json(ConfirmAccountname);
            else if(!ConfirmSchoolName.success) return res.json(ConfirmSchoolName);
 
        }
        catch (err:any){
            Logger('auth', `Failed to register a new school: ${err.message}`);
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

