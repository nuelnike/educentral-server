const { Account, Professional, Country, City, State, Status, ProfessionalSkill, Skill } = require("../../core/database/model-listings"); // import DataHive model selector
const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
const { Logger } = require("../../log"); // import logger function
const { Encrypt } = require("../../core/security"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
// let cache_professionals:any = [];
let professionals:any = [];

export const GetProfessionals = async (payload:any) => {
    
    const DBOps = async () => { 
        try { 
 
            professionals = await    Account.findAll({
                                                order: [["created_at", "DESC"]],
                                                where: { acct_typ: "professional" },
                                                include: [
                                                    {
                                                        model: Country,
                                                        attributes: ["name"],
                                                        required: false
                                                    },
                                                    {
                                                        model: State,
                                                        attributes: ["name"],
                                                        required: false
                                                    },
                                                    {
                                                        model: City,
                                                        attributes: ["name"],
                                                        required: false
                                                    },
                                                    {
                                                        model: Status,
                                                        attributes: ["name"],
                                                        required: false
                                                    },
                                                    {
                                                        model: Professional,
                                                        attributes: ["id"],
                                                        required: false,
                                                        include: [
                                                            {
                                                                model: ProfessionalSkill,
                                                                attributes: ["skill_id"],
                                                                required: false,
                                                                include: [
                                                                    {
                                                                        model: Skill,
                                                                        attributes: ["name"],
                                                                        required: false
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            });
            return {
                success: true,
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data: Encrypt(professionals)
            }

        } 
        catch (error:any) {
            Logger('engine', "Failed execution: failed to fetch professionals: "+ error.message); // log error message to .log file 
            return { 
                code: GetStatusResponse("internal_server_err").code,
                success: false,
                data: null,
                msg: GetStatusResponse("internal_server_err").msg
            };
        }
    };

    return await DBOps();
}