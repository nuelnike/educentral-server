import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { Decrypt } = require("../../core/security");
const { GetStatusResponse } = require("../../core/data/status-response");
const { GetProfessionals } = require("../../bootstrap/account/get-professionals");
const { FilterProfessionals } = require("../../bootstrap/account/filter-professionals");
const { SearchProfessionals } = require("../../bootstrap/account/search-professionals");

module.exports = (router:any) => {  
 
    //GET ALL COUNTRY DATA
    router.get('/load-professionals', (req:Request, res:Response) => {  
        // let id:string = Decrypt(req.body.payload).id;
        (async () => {
        try{
            return res.json(await GetProfessionals());
        }
        catch (err:any){
            Logger('error', `Failed to fetch professionals: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();      
    });
    
    router.get('/filter-professionals/:typ/:keyword', (req:Request, res:Response) => {
        let keyword:string = req.params.keyword;
        let typ:string = req.params.typ;
        (async () => {
        try{
            if(typ == "filter") return res.json(await FilterProfessionals(keyword));
            if(typ == "search") return res.json(await SearchProfessionals(keyword));
        }
        catch (err:any){
            Logger('error', `Failed to fetch professionals: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();      
    });

}