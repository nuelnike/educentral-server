const bcrypt = require('bcrypt')
import type {Request, Response} from 'express';
const { Logger } = require("../../../log");
const { GetStatusResponse } = require("../../../core/data/status-response");
// const { Encrypt, Decrypt } = require("../../../core/security");
const { GetCountries } = require("../../../bootstrap/utility/get-countries");
const { GetCountryStates } = require("../../../bootstrap/utility/get-states-in-country");
const { GetStateCities } = require("../../../bootstrap/utility/get-cities-in-state");

module.exports = (router:any) => {  
 
  //GET ALL COUNTRY DATA
  router.get('/countries', (req:Request, res:Response) => {  
    (async () => {
      try{
        let result:any = await GetCountries();
        return res.json(result);
      }
      catch (err:any){
        Logger('utility', `Failed to fetch countires: ${err.message}`);
        return  res.json({
                  success: false,
                  code: GetStatusResponse("internal_server_err").code,
                  msg: GetStatusResponse("internal_server_err").msg
                });
      } 
    })();      
  });
  
  //GET ALL COUNTRY DATA
  router.get('/country-states/:id', (req:Request, res:Response) => {  

    const id:string = req.params.id; // Parse and decrypt id  

    (async () => {
      try{
        let result:any = await GetCountryStates(id);
        return res.json(result);
      }
      catch (err:any){
        Logger('utility', `Failed to fetch countires: ${err.message}`);
        return  res.json({
                  success: false,
                  code: GetStatusResponse("internal_server_err").code,
                  msg: GetStatusResponse("internal_server_err").msg
                })
      } 
    })();
            
  });
  
  //GET ALL COUNTRY DATA
  router.get('/state-cities/:id', (req:Request, res:Response) => {  

    const id:string  = req.params.id; // Parse and decrypt id 

    (async () => {
      try{
        let result:any = await GetStateCities(id);
        return res.json(result);
      }
      catch (err:any){
        Logger('utility', `Failed to fetch cities in a state: ${err.message}`);
        return  res.json({
                  success: false,
                  code: GetStatusResponse("internal_server_err").code,
                  msg: GetStatusResponse("internal_server_err").msg
                })
      } 
    })();
            
  });

}