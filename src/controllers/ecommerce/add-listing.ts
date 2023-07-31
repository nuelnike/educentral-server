import type {Request, Response} from 'express';
const { IfEmpty } = require("../../helpers");
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { AddListing } = require("../../bootstrap/ecommerce/add-listing");
const { ConfirmAccount } = require("../../bootstrap/account/confirm-account");
const { ConfirmSchool } = require("../../bootstrap/school/confirm-school");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    //GET ALL COUNTRY DATA
    router.post('/listing', ValidateSession, (req:Request, res:Response) => {  

        let payload:any = Decrypt(req.body.payload);

        if ( IfEmpty(payload.account_id) ||  IfEmpty(payload.name) || IfEmpty(payload.price) || IfEmpty(payload.description) || IfEmpty(payload.listing_type_id))
        {
            Logger('listing', `Failed to add new listing: form data incomplete`);
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

                    let check:any = await ConfirmAccount("id", payload.account_id);
                    
                    if(check?.success)
                    {
                        (async () => {
                            try{
                                delete payload["image"];
                                let result:any = await AddListing(payload);
                                return res.json(result);
                            }
                            catch (err:any){
                                Logger('listing', `Failed to add new listing: ${err.message}`);
                                return  res.json({
                                            success: false,
                                            code: GetStatusResponse("internal_server_err").code,
                                            msg: GetStatusResponse("internal_server_err").msg
                                        });
                            }
                        })();
                    }
                    else return res.json(check);
                }
                catch (err:any){
                    Logger('listing', `Failed to add new listing: ${err.message}`);
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