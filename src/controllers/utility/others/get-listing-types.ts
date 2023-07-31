import type {Request, Response} from 'express';
const { Logger } = require("../../../log");
const { GetStatusResponse } = require("../../../core/data/status-response");
const { GetListingTypes } = require("../../../bootstrap/utility/get-listing-types");

module.exports = (router:any) => {  
 
  //GET ALL COUNTRY DATA
  router.get('/get-listing-types', (req:Request, res:Response) => {
    (async () => {
      try{
        let result:any = await GetListingTypes();
        return res.json(result);
      }
      catch (err:any){
        Logger('utility', `Failed to fetch listing types: ${err.message}`);
        return  res.json({
                  success: false,
                  code: GetStatusResponse("internal_server_err").code,
                  msg: GetStatusResponse("internal_server_err").msg
                });
      } 
    })();
            
  });

}