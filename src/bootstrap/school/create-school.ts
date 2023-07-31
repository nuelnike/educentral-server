

const { School, SchoolCategory  } = require("../../core/database/model-listings"); // import DataHive model selector
const { Logger } = require("../../log"); // import logger function
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { GetSchools } = require("./get-schools");
const { Encrypt, Decrypt } = require("../../core/security"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
const { Save } = require("../../libs/redis"); // import Redis Get & Save functions
let cache_school:any = [];

export const CreateSchool = async (payload:any) => { 
     
    // Query the database to get resource
    const DBSave = async () => {

        if(IfEmpty(payload))    return { 
                                    code: GetStatusResponse("bad_request").code, 
                                    success: false, 
                                    msg: GetStatusResponse("bad_request").msg,
                                    data: null
                                } // return resource
        
        else
        {
            try {

                let school:any = await School.create(payload);
                
                for (let i = 0; i < payload.school_categories.length; i++)
                {
                    await SchoolCategory.create({ category_id: payload.school_categories[i], school_id: payload.id });
                }

                cache_school = await GetSchools(); // get cache schools from redis
                cache_school = !IfEmpty(cache_school.data) ? Decrypt(cache_school.data) : [];
                cache_school.push(school);
                
                Save("schools", Encrypt(cache_school), null, false); // cache session for 24 hours

                return  {
                            success: true,
                            code: GetStatusResponse("success").code,
                            msg: GetStatusResponse("success").msg,
                            data: Encrypt(school)
                        }
            } 
            catch (error:any) {

                Logger('engine', "Failed execution: failed to create new school: "+ error.message); // log error message to .log file 
                
                return { 
                    success: false, 
                    data: null,
                    code: GetStatusResponse("internal_server_err").code, 
                    msg: GetStatusResponse("internal_server_err").msg 
                }; // return a 500 response to requester;

            }
        }
 
    }

    return await DBSave(); // Init redis function 

}