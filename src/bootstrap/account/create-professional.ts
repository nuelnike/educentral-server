

const { Professional, ProfessionalSkill } = require("../../core/database/model-listings"); // import DataHive model selector
const { Logger } = require("../../log"); // import logger function
const { IfEmpty } = require("../../helpers"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data

export const CreateProfessional = async (payload:any) => { 
     
    // Query the database to get resource
    const DBSave = async () => {

        if(IfEmpty(payload.account_id) || IfEmpty(payload.skills)) {  
            return { 
                success: false, 
                code: GetStatusResponse("bad_request").code, 
                msg: GetStatusResponse("bad_request").msg,
                data: null
            } // return resource
        }
        
        else
        {
            try {

                await Professional.create(payload);
                let professional:any = await Professional.findOne({
                                                                    where: { account_id: payload.account_id }
                                                                });
                

                for (let i = 0; i < payload.skills.length; i++)
                {
                    await ProfessionalSkill.create({ skill_id: payload.skills[i], professional_id: professional.id });
                }  
                return  {
                            success: true,
                            code: GetStatusResponse("success").code,
                            msg: GetStatusResponse("success").msg,
                            data: null
                        }
            } 
            catch (error:any) {

                Logger('engine', "Failed execution: failed to create new professional: "+ error.message); // log error message to .log file 
                
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