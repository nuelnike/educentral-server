import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { GetChats } = require("../../bootstrap/account/get-chats");
const { SaveMessage } = require("../../bootstrap/account/save-message");
const { GetAccount } = require("../../bootstrap/account/get-account");
const { IfEmpty } = require("../../helpers");
const { SendMail } = require("../../core/mail");

module.exports = (router:any) => {  
 
    //GET ALL COUNTRY DATA
    router.get('/get-chats/:payload', (req:Request, res:Response) => {  
        let { account_id, ref_id } = Decrypt(req.params.payload);
        if(!IfEmpty(account_id) || !IfEmpty(ref_id))
        {
            (async () => {
            try{
                let result:any = await GetChats(account_id, ref_id);
                return res.json(result);
            }
            catch (err:any){
                Logger('error', `Failed to fetch chats: ${err.message}`);
                return  res.json({
                            success: false,
                            code: GetStatusResponse("internal_server_err").code,
                            msg: GetStatusResponse("internal_server_err").msg
                        });
            }
            })(); 
        }
        else    return  res.json({
                    success: false,
                    code: GetStatusResponse("bad_request").code,
                    msg: GetStatusResponse("bad_request").msg
                });
    }); 
 
    //GET ALL COUNTRY DATA
    router.post('/save-chat', (req:Request, res:Response) => {  
        let reqBody = Decrypt(req.body.payload);
        let account = {} as any;
        if(!IfEmpty(reqBody.sender) || !IfEmpty(reqBody.receiver) || !IfEmpty(reqBody.content))
        {
            (async () => {
                try {
                    
                    account = await GetAccount("id", reqBody.receiver);

                    if(account?.success) {
                        account = account.data;
                        try{
                            let result:any = await SaveMessage(reqBody);
                            if(result.success){
                                let MailPayload:any = {
                                    payload: { name: account.fullname, msg: "You just recived a new enquiry message on edcentral" },
                                    subject: "Alert! ["+reqBody.subject+"]"
                                }

                                SendMail('notify_user', MailPayload, account.email);
                            }
                            return res.json(result);
                        }
                        catch (err:any){
                            Logger('error', `Failed to save chat: ${err.message}`);
                            return  res.json({
                                        success: false,
                                        code: GetStatusResponse("internal_server_err").code,
                                        msg: GetStatusResponse("internal_server_err").msg
                                    });
                        }

                    }

                }
                catch (err:any){
                    Logger('error', `Failed to validate account: ${err.message}`);
                    return  res.json({
                                success: false,
                                code: GetStatusResponse("internal_server_err").code,
                                msg: GetStatusResponse("internal_server_err").msg
                            });
                }

                

            })();
        }
        else    return  res.json({
                    success: false,
                    code: GetStatusResponse("bad_request").code,
                    msg: GetStatusResponse("bad_request").msg
                });    
    });

}