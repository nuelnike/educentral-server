import type {Request, Response} from 'express';
const { IfEmpty } = require("../../helpers");
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { GetBlog } = require("../../bootstrap/blog/get-blog");
const { GetBlogs } = require("../../bootstrap/blog/get-blogs");
const { GetBlogComments } = require("../../bootstrap/blog/get-blog-comments");

module.exports = (router:any) => {  
 
    router.get('/get-blogs', (req:Request, res:Response) => {  

        (async () => {
        try{
            return res.json(await GetBlogs());
        }
        catch (err:any){
            Logger('error', `Failed to fetch blogs: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();      
    });
    
    router.get('/get-blog/:id', (req:Request, res:Response) => {

        let id:any = req.params.id;

        (async () => {
            try{ 
                if(IfEmpty(id)) return res.json(await GetBlog(id)); 
                else{
                    return  res.json({
                        success: false,
                        code: GetStatusResponse("bad_request").code,
                        msg: GetStatusResponse("bad_request").msg
                    });
                }
            }
            catch (err:any){
                Logger('school', `Failed to fetch schools: ${err.message}`);
                return  res.json({
                            success: false,
                            code: GetStatusResponse("internal_server_err").code,
                            msg: GetStatusResponse("internal_server_err").msg
                        });
            }
        })();      
    });
    
    router.get('/get-blog-comments/:id', (req:Request, res:Response) => {  
        let id:any = req.params.id; 
        (async () => {
        try{
            return res.json(await GetBlogComments(id)); 
        }
        catch (err:any){
            Logger('error', `Failed to fetch blog comments: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();     
    });

}