import type {Request, Response} from 'express';
const { IfEmpty, ValidEmailAddress, CapString } = require("../../helpers");
const { support } = require("../../core/data/system-info");
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security"); 
const { SendMail } = require("../../core/mail");

module.exports = (router:any) => {  
 
    //GET ALL COUNTRY DATA
    router.post('/university-enquiry', (req:Request, res:Response) => {  

        let payload:any = Decrypt(req.body.payload);

        if (IfEmpty(payload.fullname) || IfEmpty(payload.email) || !ValidEmailAddress(payload.email) || IfEmpty(payload.phone))
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
                    let subject:string = "";
                    if(payload.type === 'scholarship'){
                        subject = (payload.assisted ? 'Assisted ' : "")+CapString(payload.type+' enquiry');
                        let consent:string = payload.assisted ? 'to be' : ' not to be';
                        payload.message = payload.fullname+' has made an enquiry about ' + CapString(payload.type) + ' and wish '+ consent + ' assisted for this '+payload.type+ ' enquiry.';
                    }
                    if(payload.type == 'foreign_uni'){
                        subject = "Foregin University Enquiry";
                        payload.message = payload.fullname+' will like to make an enquiry about Foregin Universities.';
                    }

                    let MailPayload:any = {
                            payload,
                            subject
                        }
                    
                    await SendMail('enquiry', MailPayload, support);

                    return  res.json({ // Return accountonse to front end
                                success: true, 
                                code: GetStatusResponse("success").code,
                                msg: GetStatusResponse("success").msg,
                                data: null
                            });
                }
                catch (err:any){
                    Logger('error', `Failed to add new listing: ${err.message}`);
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