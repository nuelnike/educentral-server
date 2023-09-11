import type {Request, Response} from 'express';
import {Logger} from "../../../log";
const { GetStatusResponse } = require("../../../core/data/status-response");
const { GeneralSearch } = require("../../../bootstrap/account/general-search");
// const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    //Get reviews
    router.get('/general-search/:keyword', (req:Request, res:Response) => {

        let keyword:any = req.params.keyword;
        
        (async () => {
        try{
            let result:any = await GeneralSearch(keyword);
            return res.json(result);
        }
        catch (err:any){
            Logger('error', `Failed to search: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();  

    });

}


