const { School } = require("../../core/database/model-listings"); // import DataHive model selector
const { DeleteItemByID } = require("../../helpers/array-manipulation");
const { GetSchools } = require("./get-schools");
const { GetSchool } = require("./get-school"); // import IfEmpty function
const { Logger } = require("../../log"); // import logger function
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { Encrypt, Decrypt } = require("../../core/security"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
const { Save, Get } = require("../../libs/redis"); // import Redis Get & Save functions
let cache_school:any = [];
 

export const UpdateSchool = async (payload:any) => { 

    // Query the database to get resource
    const DBSave = async () => {

        if(IfEmpty(payload))    return {
                                    code: GetStatusResponse("bad_request").code, 
                                    success: false, 
                                    msg: GetStatusResponse("bad_request").msg,
                                    data: null 
                                }
        
        else
        {
            try 
            {

                await School.update(payload, { where: {id: payload.id} });

                cache_school = await GetSchools();
                cache_school = cache_school.data;

                if(!IfEmpty(cache_school))
                {
                    cache_school = Decrypt(cache_school);
                    if(!IfEmpty(cache_school))
                    {
                        cache_school = DeleteItemByID(payload.id, cache_school);
                        await Save("schools", Encrypt(cache_school));
                    }
                }

                GetSchool(payload.id);
                
                return  {
                    success: true,
                    code: GetStatusResponse("success").code,
                    msg: GetStatusResponse("success").msg,
                    data: null
                }
            }
            catch (error:any) {

                Logger('error', "Failed execution: failed to update school: "+ error.message); // log error message to .log file 
                
                return { 
                    success: false, 
                    code: GetStatusResponse("internal_server_err").code, 
                    msg: GetStatusResponse("internal_server_err").msg,
                    data: null
                }; // return a 500 response to requester;

            }
        }
 
    }

    return await DBSave(); // Init redis function 

}