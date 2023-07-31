import type {Request, Response} from 'express';
const { IfEmpty } = require("../../helpers");
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { UpdateListing } = require("../../bootstrap/ecommerce/update-listing");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);
const { ConfirmAccount } = require("../../bootstrap/account/confirm-account");

module.exports = (router:any) => {  
 
    //GET ALL COUNTRY DATA
    router.post('/listing/update', ValidateSession, (req:Request, res:Response) => {  

        let payload:any = Decrypt(req.body.payload);

        if ( IfEmpty(payload.id) ||  IfEmpty(payload.account_id) || IfEmpty(payload.name) || IfEmpty(payload.price) || IfEmpty(payload.description) || IfEmpty(payload.listing_type_id))
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

                    let account:any = await ConfirmAccount("id", payload.account_id);
                    if(account?.success)
                    {
                        try{ 
                            (async () => {
                                try{

                                    delete payload["account"];
                                    delete payload["category"];
                                    delete payload["created_at"];
                                    delete payload["updated_at"];
                                    delete payload["listing_type"];

                                    let result:any = await UpdateListing(payload);
                                    result.data = null;
                                    return res.json(result);

                                }
                                catch (err:any){
                                    Logger('listing', `Failed to update listing data: ${err.message}`);
                                    return  res.json({
                                                success: false,
                                                code: GetStatusResponse("internal_server_err").code,
                                                msg: GetStatusResponse("internal_server_err").msg
                                            });
                                }
                            })();
                        }
                        catch (err:any){
                            Logger('listing', `Failed to update listing: ${err.message}`);
                            return  res.json({
                                        success: false,
                                        code: GetStatusResponse("internal_server_err").code,
                                        msg: GetStatusResponse("internal_server_err").msg
                                    });
                        }
                    }
                    else return res.json(account);
            })();   
        }

    }); 
    
}