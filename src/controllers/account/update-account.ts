import type {Request, Response} from 'express';
const bcrypt = require('bcrypt');
const { IfEmpty, ValidEmailAddress } = require("../../helpers");
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
import { UpdateAccount, UpdateAccountPassword, UpdateAccountEmail } from "../../bootstrap/account/update-account";
const { UpdateSchool } = require("../../bootstrap/school/update-school");
const { GetAccount } = require("../../bootstrap/account/get-account");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    //GET ALL COUNTRY DATA
    router.post('/update-account', ValidateSession, (req:Request, res:Response) => {  

        let payload:any = Decrypt(req.body.payload);

        if ( IfEmpty(payload.acct_typ) || IfEmpty(payload.username) || IfEmpty(payload.phone) || IfEmpty(payload.address) || IfEmpty(payload.country_id) || IfEmpty(payload.state_id)) {
            return  res.json({ // CHECK IF ALL REQUIRED INPUT IS SET
                        success: false, 
                        code: GetStatusResponse("bad_request").code,
                        msg: GetStatusResponse("bad_request").msg+' 1'
                    })
        }
    
     
        else if ( payload?.acct_typ == "user" &&  (IfEmpty(payload.fullname) || IfEmpty(payload.gender))) {
            return  res.json({ // CHECK IF ALL REQUIRED INPUT IS SET
                        success: false, 
                        code: GetStatusResponse("bad_request").code,
                        msg: GetStatusResponse("bad_request").msg
                    })
        }
    
        else if(payload?.acct_typ == "school" &&  (IfEmpty(payload.school.name) || IfEmpty(payload.school.school_category_id) || IfEmpty(payload.school.reg_code))) {
            return  res.json({ // CHECK IF ALL REQUIRED INPUT IS SET
                        success: false, 
                        code: GetStatusResponse("bad_request").code,
                        msg: GetStatusResponse("bad_request").message,
                        data: null
                    })
        } 

        else 
        { 

            (async () => {
                try{ 
                    (async () => {
                        try{
                            let result:any = {};
                            result = await UpdateAccount(payload);
                            if(result.success){
                                if(payload.acct_typ == 'school')
                                {
                                    try{
                                        result = await UpdateSchool(payload.school);
                                    }
                                    catch (err:any){
                                        Logger('error', `Failed to update school data: ${err.message}`);
                                        return  res.json({
                                                    success: false,
                                                    code: GetStatusResponse("internal_server_err").code,
                                                    msg: GetStatusResponse("internal_server_err").msg
                                                });
                                    }
                                }
                                result = await GetAccount("id", payload.id);
                            }
                            return res.json(result);
                        }
                        catch (err:any){
                            Logger('error', `Failed to update account data: ${err.message}`);
                            return  res.json({
                                        success: false,
                                        code: GetStatusResponse("internal_server_err").code,
                                        msg: GetStatusResponse("internal_server_err").msg
                                    });
                        }
                    })();
                }
                catch (err:any){
                    Logger('error', `Failed to update account: ${err.message}`);
                    return  res.json({
                                success: false,
                                code: GetStatusResponse("internal_server_err").code,
                                msg: GetStatusResponse("internal_server_err").msg
                            });
                }
            })();   
        }

    });
 
    //GET ALL COUNTRY DATA
    router.post('/update-email', ValidateSession, (req:Request, res:Response) => {  

        let payload:any = Decrypt(req.body.payload);

        if ( IfEmpty(payload.email) || IfEmpty(payload.password) || IfEmpty(payload.id) || !ValidEmailAddress(payload.email))
        {
            return  res.json({ // CHECK IF ALL REQUIRED INPUT IS SET
                        success: false, 
                        code: GetStatusResponse("bad_request").code,
                        msg: GetStatusResponse("bad_request").msg
                    })
        } 
 
        else 
        { 

            (async () => {
                try{ 

                    let account:any = await GetAccount("id", payload.id);
                    account = account.data;
                    if(account.code != GetStatusResponse("not_found").code)
                    {
                        
                        if (bcrypt.compareSync(payload.password, account.password))
                        {
                            (async () => {
                                try{
                                    let result:any = await UpdateAccountEmail(payload);
                                    return res.json(result);
                                }
                                catch (err:any){
                                    Logger('error', `Failed to update account email: ${err.message}`);
                                    return  res.json({
                                                success: false,
                                                code: GetStatusResponse("internal_server_err").code,
                                                msg: GetStatusResponse("internal_server_err").msg
                                            });
                                }
                            })();
                        } 
                        else { // RESTURN RESPONSE IF PASSWORD IS WRONG.
                          return  res.json({
                                    success: false,
                                    code: GetStatusResponse("bad_request").code,
                                    msg: "password is invalid, try again"
                                  });
                        }

                    }
                    else if(account.code != GetStatusResponse("not_found").code)
                    {
                        return  res.json({
                                    success: false,
                                    code: GetStatusResponse("resource_exist").code,
                                    msg: "username already exist, try again."
                                })
                    }
                    else if(!account.success) return res.json(account);

                }
                catch (err:any){
                    Logger('error', `Failed to update account email: ${err.message}`);
                    return  res.json({
                                success: false,
                                code: GetStatusResponse("internal_server_err").code,
                                msg: GetStatusResponse("internal_server_err").msg
                            });
                }
            })();   
        }

    });
 
    //GET ALL COUNTRY DATA
    router.post('/update-password', ValidateSession, (req:Request, res:Response) => {  

        const { id, password }:any = Decrypt(req.body.payload);
        let resp:any = {} as any;
        let account:any = {} as any;

        if ( IfEmpty(id) || IfEmpty(password.old) || IfEmpty(password.new) || IfEmpty(password.confirm) || (password.new != password.confirm))
        {
            return  res.json({
                        success: false, 
                        code: GetStatusResponse("bad_request").code,
                        msg: GetStatusResponse("bad_request").msg,
                        data: null
                    })
        } 
 
        else 
        { 

            (async () => {
                try{ 

                    resp = await GetAccount("id", id);

                    if(resp.code == GetStatusResponse("success").code)
                    {
                        
                        account = resp.data;

                        if (bcrypt.compareSync(password.old, account.password))
                        {
                            (async () => {
                                try{

                                    bcrypt.hash(password.new, 10, (err:any, hash:any) => {
                                        (async () => {
                                            try{ 
                                                return res.json(await UpdateAccountPassword(id, hash));
                                            }
                                            catch (err:any){
                                                Logger('error', `Failed to update account password: ${err.message}`);
                                                return  res.json({
                                                            success: false,
                                                            data: null,
                                                            code: GetStatusResponse("internal_server_err").code,
                                                            msg: GetStatusResponse("internal_server_err").msg
                                                        });
                                            }
                                        })();
                                    })
                                }
                                catch (err:any){
                                    Logger('error', `Failed to update account password: ${err.message}`);
                                    return  res.json({
                                                success: false,
                                                code: GetStatusResponse("internal_server_err").code,
                                                msg: GetStatusResponse("internal_server_err").msg
                                            });
                                }
                            })();
                        } 
                        else {
                          return  res.json({
                                    success: false,
                                    code: GetStatusResponse("bad_request").code,
                                    msg: "old password is invalid, try again."
                                  });
                        }
                    }
                    else if(resp.code != GetStatusResponse("not_found").code)
                    {
                        return  res.json({
                                    success: false,
                                    code: GetStatusResponse("resource_exist").code,
                                    msg: "username already exist, try again."
                                })
                    }
                    else if(!resp.success) return res.json(resp);

                }
                catch (err:any){
                    Logger('error', `Failed to update account password: ${err.message}`);
                    return  res.json({
                                success: false,
                                code: GetStatusResponse("internal_server_err").code,
                                msg: GetStatusResponse("internal_server_err").msg
                            });
                }
            })();   
        }

    });

}