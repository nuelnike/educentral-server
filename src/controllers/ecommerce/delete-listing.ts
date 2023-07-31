import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { DeleteListing } = require("../../bootstrap/ecommerce/delete-listing");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {
    router.delete('/listing/:id', ValidateSession, (req:Request, res:Response) => {  
        let id:any = Decrypt(req.params.id); 
        (async () => {
        try{
            let result:any = await DeleteListing(id);
            return res.json(result);
        }
        catch (err:any){
            Logger('listing', `Failed to delete listing: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();      
    });

    // router.get('listing/delete/:id', ValidateSession, (req:Request, res:Response) =>
    // {

        
    //     console.log(req.params);
    //     // const id:number = Decrypt(req.params.id);
    //     // (async () => {
    //     //     try
    //     //     {
    //     //         let result:any = await DeleteListing(id);
    //     //         return res.json(result);
    //     //     }
    //     //     catch (err:any){
    //     //         Logger('listing', `Failed to delete listing: ${err.message}`);
    //     //         return  res.json({
    //     //                     success: false,
    //     //                     code: GetStatusResponse("internal_server_err").code,
    //     //                     msg: GetStatusResponse("internal_server_err").msg
    //     //                 });
    //     //     } 
    //     // })();    
    // });
}

