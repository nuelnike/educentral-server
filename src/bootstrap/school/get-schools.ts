const { Account, School, Country, City, State, Status, SchoolCategory, Category } = require("../../core/database/model-listings"); // import DataHive model selector
const { Get, Save } = require("../../libs/redis"); // import Redis Get & Save functions
const { Logger } = require("../../log"); // import logger function
const { IfEmpty} = require("../../helpers"); // import IfEmpty function
const { Encrypt } = require("../../core/security"); // import IfEmpty function
const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
// let cache_schools:any = [];
let schools:any = [];

export const GetSchools = async (payload:any) => {
    
    const DBOps = async () => { 
        try { 

            let query:any = {}; 

            if(payload.filter && !IfEmpty(payload.city_id)){
                if(IfEmpty(payload.rating) || payload.rating == 0) query = { city_id: payload.city_id, acct_typ: 'school' };
                else query = { city_id: payload.city_id, acct_typ: 'school', ratings: payload.rating };
            }
            else if(payload.filter && !IfEmpty(payload.state_id) && IfEmpty(payload.city_id)){
                if(IfEmpty(payload.rating) || payload.rating == 0) query = { state_id: payload.state_id, acct_typ: 'school' };
                else query = { state_id: payload.state_id, acct_typ: 'school', ratings: payload.rating };
            }
            else if(payload.filter && IfEmpty(payload.state_id) && IfEmpty(payload.city_id) && !IfEmpty(payload.country_id) ){
                if(IfEmpty(payload.rating) || payload.rating == 0) query = { country_id: payload.country_id, acct_typ: 'school' };
                else query = { country_id: payload.country_id, acct_typ: 'school', ratings: payload.rating };
            }
            else query = null;  
            
            schools = await    Account.findAll({
                                                order: [["created_at", "DESC"]],
                                                where: query,
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
                                                    }
                                                ]
                                            });
            return {
                success: true,
                code: GetStatusResponse("success").code, 
                msg: GetStatusResponse("success").msg, 
                data: Encrypt(schools)
            }

        } 
        catch (error:any) {
            Logger('engine', "Failed execution: failed to fetch schools: "+ error.message); // log error message to .log file 
            return { code: GetStatusResponse("internal_server_err").code, success: false, msg: GetStatusResponse("internal_server_err").msg }; // return a 500 response to requester;
        }
    };

    return await DBOps();
}