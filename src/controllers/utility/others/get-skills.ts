import type {Request, Response} from 'express';
const { Logger } = require("../../../log");
const { GetStatusResponse } = require("../../../core/data/status-response");
const { GetSkills } = require("../../../bootstrap/utility/get-skills");

module.exports = (router:any) => {  
 
  //GET ALL COUNTRY DATA
  router.get('/get-skills', (req:Request, res:Response) => {
    (async () => {
      try
      {
        let result:any = await GetSkills();
        return res.json(result);
      }
      catch (err:any)
      {
        Logger('error', `Failed to fetch skills: ${err.message}`);
        return  res.json({
                  success: false,
                  code: GetStatusResponse("internal_server_err").code,
                  msg: GetStatusResponse("internal_server_err").msg
                })
      } 
    })();
            
  });

}