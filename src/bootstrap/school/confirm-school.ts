const { GetItemByKey } = require("../../helpers/array-manipulation");
const { School } = require("../../core/database/model-listings"); // import DataHive model selector
const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
const { Logger } = require("../../log"); // import logger function
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { Decrypt, Encrypt } = require("../../core/security"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
const { Op } = require("sequelize"); // import operation function from sequalize
let arr:any = [];
let cache_school:any;

export const ConfirmSchool = async (typ:string = 'id', ref:string) => {

    
    // Check redis for resource requested
    const RedisGet = async () => {

        if(IfEmpty(ref))    return { 
                                success: false, 
                                code: GetStatusResponse("bad_request").code, 
                                msg: GetStatusResponse("bad_request").msg, 
                                data: null
                            }; // return a 500 response to requester;
        else
        {  
            arr = await Get("schools") || []; // get cache schools from redis
            if(!IfEmpty(arr))
            {
                cache_school = GetItemByKey(typ, ref, Decrypt(arr));
                if(!IfEmpty(cache_school)) return { 
                                                        code: GetStatusResponse("success").code, 
                                                        success: true, 
                                                        msg: GetStatusResponse("success").msg, 
                                                        data: null 
                                                }
                else return await DBOps();
            }
            else return await DBOps();

        }
    }
    
    // Query the database to get resource
    const DBOps = async () => {
        try {

            let qry:any;
            if (typ == "id") qry = {id: ref};
            if (typ == "name") qry = {name: ref};
            if (typ == "email") qry = {email: ref}; 
            
            let school:any = await School.findOne({ // query database for resource requested
                where: qry
            });


            if(!IfEmpty(school)) // if data is not empty
            {
                arr.push(school);
                Save("schools", Encrypt(arr), null, false); // cache session for 24 hours
                return { 
                    code: GetStatusResponse("success").code,
                    success: true,
                    msg: GetStatusResponse("success").msg,
                    data: null
                } // return response to requester
            }

            else    return { 
                        code: GetStatusResponse("not_found").code,
                        success: false,
                        msg: GetStatusResponse("not_found").msg,
                        data: null 
                    } // return a 404 response to requester

        } 
        catch (error:any) {
            Logger('error', "Failed execution: failed to confirm school: "+ error.message); // log error message to .log file 
            return { 
                code: GetStatusResponse("internal_server_err").code, 
                success: false,
                data: null,
                msg: GetStatusResponse("internal_server_err").msg 
            }; // return a 500 response to requester;
        }
 
    }

    return await RedisGet(); // Init redis function 

}