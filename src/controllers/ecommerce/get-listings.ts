import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { GetListings } = require("../../bootstrap/ecommerce/get-listings");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    //GET ALL COUNTRY DATA
    router.get('/get-listings/:id', (req:Request, res:Response) => { 
        let id:string = Decrypt(req.params.id);
        (async () => {
            try{
                let result:any = await GetListings(id);
                return res.json(result);
            }
            catch (err:any){
                Logger('listing', `Failed to fetch listing: ${err.message}`);
                return  res.json({
                            success: false,
                            code: GetStatusResponse("internal_server_err").code,
                            msg: GetStatusResponse("internal_server_err").msg
                        });
            }
        })();      
    });

}