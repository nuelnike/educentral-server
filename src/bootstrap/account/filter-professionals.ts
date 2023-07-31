import { SortArrayByKey } from "../../helpers/array-manipulation";
const { Account, Professional, ProfessionalSkill, Skill, Country, City, State, Status } = require("../../core/database/model-listings"); // import DataHive model selector
const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
const { Logger } = require("../../log"); // import logger function
const { IfEmpty} = require("../../helpers"); // import IfEmpty function
const { Encrypt } = require("../../core/security"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
// let cache_professionals:any = [];
const { Op } = require("sequelize"); // import operation function from sequalize
let professionals:any = [];

export const FilterProfessionals = async (id:any) => {
    
    const DBOps = async () => { 
        let arr:any = [];
        try {

                professionals =     await   ProfessionalSkill.findAll({
                                                order: [["created_at", "DESC"]],
                                                attributes: ["professional_id"],
                                                where: { skill_id: id},
                                                include: [{
                                                    model: Professional,
                                                    attributes: ["account_id"],
                                                    required: false,
                                                    include: [ 
                                                        {
                                                            model: Account,
                                                            required: false,
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
                                                        }
                                                    ]
                                                }]
                                            });

                // professionals = await SortArrayByKey("acct_typ", "professional", professionals);

            for (let i = 0; i < professionals.length; i++) arr.push(professionals[i].professional.account);

            return {
                success: true,
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data: Encrypt(arr)
            }

        } 
        catch (error:any) {
            Logger('engine', "Failed execution: failed to fetch professionals: "+ error.message); // log error message to .log file 
            return { code: GetStatusResponse("internal_server_err").code, success: false, msg: GetStatusResponse("internal_server_err").msg }; // return a 500 response to requester;
        }
    };

    return await DBOps();
}