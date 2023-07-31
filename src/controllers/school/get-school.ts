import type {Request, Response} from 'express';
const { IfEmpty } = require("../../helpers");
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt, Encrypt } = require("../../core/security");
const { GetSchool } = require("../../bootstrap/school/get-school");
const { GetSchools } = require("../../bootstrap/school/get-schools");
const { SearchSchools } = require("../../bootstrap/school/search-schools");
const { CategorizeSchools } = require("../../bootstrap/school/categorize-schools");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);

module.exports = (router:any) => {  
 
    router.get('/load-school/:payload', (req:Request, res:Response) => {  
        let param:any = Decrypt(req.params.payload);
        let typ:string = param.typ;
        let ref:string = param.ref;

        // console.log({typ, ref});

        (async () => {
        try{
            let result:any = await GetSchool(typ, ref);
            return res.json(result);
        }
        catch (err:any){
            Logger('school', `Failed to fetch school: ${err.message}`);
            return  res.json({
                        success: false,
                        code: GetStatusResponse("internal_server_err").code,
                        msg: GetStatusResponse("internal_server_err").msg
                    });
        }
        })();      
    });
    
    router.get('/load-schools/:payload', (req:Request, res:Response) => {

        let param:any = Decrypt(req.params.payload);
        let _result:any; 

        (async () => {
            try{ 
                if(IfEmpty(param.category_id) || param.category_id == 6) return res.json(await GetSchools(param));
                else {
                    let result:any = await CategorizeSchools(param);  
                    if(result.success ){
                        let i = 0; 
                        let account:any;
                        let new_arr:any = [];
                        let arr:any = Decrypt(result.data);
                        while (i < arr.length) {
                            account = arr[i].school.account;
                            if(!IfEmpty(account)) new_arr.push(account);
                            i++;
                        }
                        _result = {
                            success: true,
                            code: GetStatusResponse("success").code, 
                            msg: GetStatusResponse("success").msg, 
                            data: Encrypt(new_arr)
                        }
                    }
                    else _result = result; 

                    return res.json(_result);
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
    
    router.get('/search-schools/:payload', (req:Request, res:Response) => {  
        let param:any = Decrypt(req.params.payload); 
        (async () => {
        try{ 
            let result:any = await SearchSchools(param);
            return res.json(result); 
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

}