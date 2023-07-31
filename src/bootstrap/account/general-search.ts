const { Account, Country, City, State, Status, School, SchoolCategory, Category, Professional, ProfessionalSkill, Skill, } = require("../../core/database/model-listings"); // import DataHive model selector
const { Logger } = require("../../log"); // import logger function
const { Encrypt } = require("../../core/security"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
// let cache_schools:any = [];
const { Op } = require("sequelize"); // import operation function from sequalize
let results:any = [];

export const GeneralSearch = async (keyword:any) => {
    
    const DBOps = async () => { 
        try {

            results = await    Account.findAll({
                                                order: [["created_at", "DESC"]],
                                                where: { 
                                                    fullname: { [Op.like]: '%' + keyword + '%' }
                                                    
                                                    // status_id: 1,
                                                    // [Op.or]: [
                                                    //     { fullname: { [Op.like]: '%' + keyword + '%' } }, 
                                                    //     { address: { [Op.like]: '%' + keyword + '%' } }
                                                    // ],
                                                    // [Op.or]: [
                                                    //     {acct_typ: "school"},
                                                    //     {acct_typ: "professional"}
                                                    // ]
                                                },
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
                                                        model: School,
                                                        attributes: ["reg_code", "reg_date"],
                                                        required: false,
                                                        include: [
                                                            {
                                                                model: SchoolCategory,
                                                                attributes: ["id"],
                                                                required: false,
                                                                include: [
                                                                    {
                                                                        model: Category,
                                                                        attributes: ["name"],
                                                                        required: false
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        model: Professional,
                                                        required: false,
                                                        include: [{
                                                                    model: ProfessionalSkill,
                                                                    required: false,
                                                                    include:    [{
                                                                                    model: Skill,
                                                                                    attributes: ["name"],
                                                                                    required: false
                                                                                }]
                                                                }]
                                                    },
                                                ]
                                            }); 

            return {
                success: true,
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data: Encrypt(results)
            }

        } 
        catch (error:any) {
            Logger('engine', "Failed execution: failed to fetch schools: "+ error.message); // log error message to .log file 
            return { code: GetStatusResponse("internal_server_err").code, success: false, msg: GetStatusResponse("internal_server_err").msg }; // return a 500 response to requester;
        }
    };

    return await DBOps();
}