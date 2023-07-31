import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { GetReviews } = require("../../bootstrap/account/get-reviews");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    //Get reviews
    router.get('/get-reviews/:id', (req:Request, res:Response) => {

        let id:any = Decrypt(req.params.id);
        
        (async () => {
        try{
            let result:any = await GetReviews(id);
            return res.json(result);
        }
        catch (err:any){
            Logger('account', `Failed to fetch reviews: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();  

    });

}


