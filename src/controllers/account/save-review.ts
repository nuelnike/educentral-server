import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { SaveReview } = require("../../bootstrap/account/save-review");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    //Get reviews
    router.post('/save-review', (req:Request, res:Response) => {

        let payload:any = Decrypt(req.body.payload);
        
        (async () => {
        try{
            let result:any = await SaveReview(payload);
            return res.json(result);
        }
        catch (err:any){
            Logger('error', `Failed to fetch reviews: ${err.message}`);
            return  res.json({
                        success: false,
                        data: err.message,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();  

    });

}


