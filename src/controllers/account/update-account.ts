import type {Request, Response} from 'express';
const bcrypt = require('bcrypt');
const { IfEmpty, ValidEmailAddress } = require("../../helpers");
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { UpdateAccount, UpdateAccountPassword, UpdateAccountEmail } = require("../../bootstrap/account/update-account");
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
                                        Logger('account', `Failed to update school data: ${err.message}`);
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
                            Logger('account', `Failed to update account data: ${err.message}`);
                            return  res.json({
                                        success: false,
                                        code: GetStatusResponse("internal_server_err").code,
                                        msg: GetStatusResponse("internal_server_err").msg
                                    });
                        }
                    })();
                }
                catch (err:any){
                    Logger('account', `Failed to update account: ${err.message}`);
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
                    if(account.code != GetStatusResponse("not_found").code)
                    {
                        
                        if (bcrypt.compareSync(payload.password, account.data.password))
                        {
                            (async () => {
                                try{
                                    let result:any = await UpdateAccountEmail(payload);
                                    return res.json(result);
                                }
                                catch (err:any){
                                    Logger('account', `Failed to update account email: ${err.message}`);
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
                    Logger('account', `Failed to update account email: ${err.message}`);
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

        let payload:any = Decrypt(req.body.payload);

        if ( IfEmpty(payload.id) || IfEmpty(payload.password.old) || IfEmpty(payload.password.new) || IfEmpty(payload.password.confirm) || (payload.password.new != payload.password.confirm))
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

                    let account:any = await GetAccount("id", payload.id);

                    if(account.code == GetStatusResponse("success").code)
                    {
                        
                        if (bcrypt.compareSync(payload.password.old, account.data.password))
                        {
                            (async () => {
                                try{
                                    bcrypt.hash(payload.password.new, 10, (err:any, hash:any) => {
                                        (async () => {
                                            try{
                                                payload.password = hash;
                                                let result:any = await UpdateAccountPassword(payload);
                                                return res.json(result);
                                            }
                                            catch (err:any){
                                                Logger('account', `Failed to update account password: ${err.message}`);
                                                return  res.json({
                                                            success: false,
                                                            code: GetStatusResponse("internal_server_err").code,
                                                            msg: GetStatusResponse("internal_server_err").msg
                                                        });
                                            }
                                        });
                                    })
                                }
                                catch (err:any){
                                    Logger('account', `Failed to update account password: ${err.message}`);
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
                    Logger('account', `Failed to update account password: ${err.message}`);
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