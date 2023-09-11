import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { GetPackages } = require("../../bootstrap/account/get-packages");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    //GET ALL COUNTRY DATA
    router.get('/get-packages', (req:Request, res:Response) => {
        (async () => {
        try{
            let result:any = await GetPackages();
            return res.json(result);
        }
        catch (err:any){
            Logger('error', `Failed to fetch packages: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();      
    });

}