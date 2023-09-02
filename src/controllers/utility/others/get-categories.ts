import type {Request, Response} from 'express';
const { Logger } = require("../../../log");
const { GetStatusResponse } = require("../../../core/data/status-response");
const { GetCategories } = require("../../../bootstrap/utility/get-categories");

module.exports = (router:any) => {  
 
  //GET ALL COUNTRY DATA
  router.get('/get-categories', (req:Request, res:Response) => {
    (async () => {
      try
      {
        let result:any = await GetCategories();
        return res.json(result);
      }
      catch (err:any)
      {
        Logger('error', `Failed to fetch categories: ${err.message}`);
        return  res.json({
                  success: false,
                  code: GetStatusResponse("internal_server_err").code,
                  msg: GetStatusResponse("internal_server_err").msg
                })
      } 
    })();
            
  });

}