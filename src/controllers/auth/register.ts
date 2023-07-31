const bcrypt = require('bcrypt')
import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { IfEmpty, ValidEmailAddress } = require("../../helpers");
const { GetStatusResponse } = require("../../core/data/status-response");
const { StatusCode } = require("../../core/data");
const { Decrypt } = require("../../core/security");
const { CreateNewAccount } = require("../../bootstrap/account/create-account");
const { DeleteAccount } = require("../../bootstrap/account/del-account");
const { ConfirmAccount } = require("../../bootstrap/account/confirm-account");
const { GenerateRandomString } = require("../../helpers/generator");
const { CreateSchool } = require("../../bootstrap/school/create-school");
const { CreateProfessional } = require("../../bootstrap/account/create-professional");

module.exports = (router:any) => {  
 
  //login account
  router.post("/register-account", (req:Request, res:Response) => { 

    let req_body = Decrypt(req.body?.payload || {});
    let account:any = {};
 
    if ( IfEmpty(req_body?.acct_typ) || IfEmpty(req_body?.username) || IfEmpty(req_body?.password) || IfEmpty(req_body?.email) || IfEmpty(req_body?.phone) || IfEmpty(req_body?.address) || IfEmpty(req_body?.country_id) || IfEmpty(req_body?.state_id)) {
        return  res.json({ // CHECK IF ALL REQUIRED INPUT IS SET
                    success: false, 
                    code: GetStatusResponse("bad_request").code,
                    msg: GetStatusResponse("bad_request").msg+' 1'
                })
    }

 
    else if ( req_body?.acct_typ == "user" &&  (IfEmpty(req_body?.fullname) || IfEmpty(req_body?.gender))) {
        return  res.json({ // CHECK IF ALL REQUIRED INPUT IS SET
                    success: false, 
                    code: GetStatusResponse("bad_request").code,
                    msg: GetStatusResponse("bad_request").msg
                })
    }

    else if(req_body?.acct_typ == "school" &&  (IfEmpty(req_body?.school.school_categories) || IfEmpty(req_body?.school.reg_code))) {
        return  res.json({ // CHECK IF ALL REQUIRED INPUT IS SET
                    success: false, 
                    code: GetStatusResponse("bad_request").code,
                    msg: GetStatusResponse("bad_request").message,
                    data: null
                })
    }

    else if(req_body?.acct_typ == "professional" &&  (IfEmpty(req_body?.skills)) ) {
        return  res.json({ // CHECK IF ALL REQUIRED INPUT IS SET
                    success: false, 
                    code: GetStatusResponse("bad_request").code,
                    msg: GetStatusResponse("bad_request").message,
                    data: null
                })
    }

    else if (!ValidEmailAddress(req_body?.email)) { // CHECK ACCOUNT/ORGANIZATION EMAIL ADDRESS VALIDITY
        return  res.json({ // CHECK IF ALL REQUIRED INPUT IS SET
                    success: false,
                    code: GetStatusResponse("bad_request").code,
                    msg: "provide a valid personal email address"
                })
    } 

    else if (req_body?.password.length < 5) { // CHECK PASSWORD LENGTH
        return  res.json({
                    success: false,
                    code: GetStatusResponse("bad_request").code,
                    msg: 'password must be more atleast 5 characters!'
                })
    } 

    else if (req_body?.password !== req_body?.cpassword) { // CHECK SERVER SIDE PASSWORD MATCH 
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

            let ConfirmEmail:any = {};
            let ConfirmAccountname:any = {};
            // let ConfirmSchoolName:any = {};

            // if(req_body?.acct_typ == "user"){
                ConfirmEmail = await ConfirmAccount("email", req_body?.email);
                ConfirmAccountname = await ConfirmAccount("username", req_body?.username);
            // } 
            // else if(req_body?.acct_typ == "school") ConfirmSchoolName = await ConfirmSchool("name", req_body?.school.name);


            if(ConfirmEmail.code == GetStatusResponse("not_found").code && ConfirmAccountname.code == GetStatusResponse("not_found").code)
            {
                
                try {
                    bcrypt.hash(req_body?.password, 10, (err:any, hash:any) => { // ENCRYPT PASSWORD BEFORE ACCOUNT CREATION  
                        
                        req_body.password = hash;
                        req_body.status_id = StatusCode.active;
                        req_body.id = GenerateRandomString(20);

                        try {
                            
                            (async () => {

                                let result:any = await CreateNewAccount(req_body);

                                account = result.data;

                                if(result.success && req_body?.acct_typ == "school") return await CreateNewSchool();

                                else if(result.success && req_body?.acct_typ == "professional") return await CreateNewProfessional(); 

                                else if(result.success) res.json(result);

                            })();
                            
                        }
                        catch (err:any){
                            Logger('auth', `Failed to save new account : ${err.message}`);
                            return  res.json({
                                        success: false,
                                        code: GetStatusResponse("internal_server_err").code,
                                        msg: GetStatusResponse("internal_server_err").msg
                                    })
                        }
                    });
                }
                catch (err:any){
                    Logger('auth', `Failed to save new account: ${err.message}`);
                    return  res.json({
                                success: false,
                                code: GetStatusResponse("internal_server_err").code,
                                msg: GetStatusResponse("internal_server_err").msg
                            })
                }

            }
            else if(ConfirmEmail.code != GetStatusResponse("not_found").code)
            {
                return  res.json({
                            success: false,
                            code: GetStatusResponse("resource_exist").code,
                            msg: "account email already exist, try again."
                        })
            }
            else if(ConfirmAccountname.code != GetStatusResponse("not_found").code)
            {
                return  res.json({
                            success: false,
                            code: GetStatusResponse("resource_exist").code,
                            msg: "username already exist, try again."
                        })
            }
            else if(!ConfirmEmail.success) return res.json(ConfirmEmail);
            else if(!ConfirmAccountname.success) return res.json(ConfirmAccountname);
 
        }
        catch (err:any){ 
            Logger('auth', `Failed to register a account: ${err.message}`);
            return  res.json({
                    success: false,
                    code: GetStatusResponse("internal_server_err").code,
                    msg: GetStatusResponse("internal_server_err").msg
                    })
        }
      })();
    }

    const CreateNewSchool = async () => { 
        let school:any = req_body?.school;
        school.id = GenerateRandomString(20);
        school.account_id = account.id;
        let result:any = await CreateSchool(school);
        if(result.success) return res.json(result); // return any error encountered while saving
        else {
            result = await DeleteAccount(account.id);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg,
                        data: null
                    });
        }
    }
    const CreateNewProfessional = async () => { 
        let professional:any = { skills: req_body?.skills, account_id: account.id };
        let result:any = await CreateProfessional(professional);
        if(result.success) return res.json(result); // return any error encountered while saving
        else {
            await DeleteAccount(account.id);
            return res.json(result);
        }
    }
      
  });

}

