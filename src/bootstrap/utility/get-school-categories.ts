import { Decrypt } from "../../core/security";
const { SchoolCategory } = require("../../core/database/model-listings"); // import DataHive model selector
const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
const { Logger } = require("../../log"); // import logger function
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
let cache_categories:string = "";
let categories:any = [];

export const GetSchoolCategories = async () => { 
    
    // Check redis for resource requested
    const RedisGet = async () => {
        
        cache_categories = await Get("categories"); // get cache categories from redis
    
        if(!IfEmpty(cache_categories)) // if cached categories is not empty
        {
            console.log("categories already cached.");
            return { 
                success: true, 
                msg: GetStatusResponse("success").msg,
                code: GetStatusResponse("success").code, 
                data: cache_categories
            } // return resource
        }
        else return await DBOps();
    }
    
    // Query the database to get resource
    const DBOps = async () => {

        try {
            
            categories = await SchoolCategory.findAll(); 
            if(!IfEmpty(categories)) // if data is not empty
            { 
                Save("categories", categories, null, false); // save new array to redis
                console.log("categories fetched and cached successfully.");
                return {  
                    success: true, 
                    msg: GetStatusResponse("success").msg,
                    code: GetStatusResponse("success").code, 
                    data: categories
                } // return resource
            }

            else {
                console.log("no categories currently available in the database.");
                return { 
                    success: false, 
                    code: GetStatusResponse("not_found").code, 
                    msg: GetStatusResponse("not_found").msg, 
                    data: [] 
                } // return a 404 response to requester
            }

        } 
        catch (error:any) {
            console.log("Engine failed to Get categories: "+ error.message);
            Logger('error', "Failed execution: failed to fetched categories: "+ error.message); // log error message to .log file 
            return { 
                success: false,
                msg: GetStatusResponse("internal_server_err").msg,
                code: GetStatusResponse("internal_server_err").code,
                data: []
            }; // return a 500 response to requester;
        }
 
    }

    return await RedisGet(); // Init redis function

}