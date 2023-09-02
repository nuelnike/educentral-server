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

export const SearchProfessionals = async (keyword:any) => {
    
    const DBOps = async () => {
        try {
                professionals =     await   Account.findAll({
                                                order: [["created_at", "DESC"]],
                                                where: {
                                                    fullname: { [Op.like]: '%' + keyword + '%' }, acct_typ: "professional"
                                                },
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

            return {
                success: true,
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data: Encrypt(professionals)
            }

        } 
        catch (error:any) {
            Logger('error', "Failed execution: failed to fetch professionals: "+ error.message); // log error message to .log file 
            return { code: GetStatusResponse("internal_server_err").code, success: false, msg: GetStatusResponse("internal_server_err").msg }; // return a 500 response to requester;
        }
    };

    return await DBOps();
}