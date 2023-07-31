
import type {Request, Response} from 'express';
const { IfEmpty } = require("../../helpers");
const { Logger } = require("../../log");
const { Decrypt } = require("../../core/security");
const { GetStatusResponse } = require("../../core/data/status-response");
const { SaveComment } = require("../../bootstrap/blog/save-comments");

module.exports = (router:any) => {
 
    router.post('/make-comment', (req:Request, res:Response) => {  
        if(IfEmpty(req.body.payload))
        {
            return  res.json({
                        success: false, 
                        code: GetStatusResponse("bad_request").code,
                        msg: GetStatusResponse("bad_request").msg
                    }) 
        }
        else
        {
            (async () => {
                try{
                    let payload:any = Decrypt(req.body.payload);
                    return res.json(await SaveComment(payload));
                }
                catch (err:any){
                    Logger('error', `Failed to save comment: ${err.message}`);
                    return  res.json({
                                success: false,
                                code: GetStatusResponse("internal_server_err").code,
                                msg: GetStatusResponse("internal_server_err").msg
                            });
            }
            })();
        }      
    });
    
}