export const GetAccount = async (typ:string, ref:string) => {

    const { Account, School, Professional, ProfessionalSkill, Skill, Status, SchoolCategory, Category, City, State, Country } = require("../../core/database/model-listings"); // import DataHive model selector
    const { Logger } = require("../../log"); // import logger function
    const { IfEmpty } = require("../../helpers"); // import IfEmpty function
    const { GetStatusResponse } = require("../../core/data/status-response"); // import custom status response data
    // const { Op } = require("sequelize"); // import operation function from sequalize
    let cache_account:any = {};
    
    // Check redis for resource requested
    // const RedisGet = async () => {

    //     if(IfEmpty(ref)) return { success: false, code: GetStatusResponse("bad_request").code, msg: GetStatusResponse("bad_request").msg }; // return a 500 response to requester;

    //     else
    //     {
    //         if(typ == "id")
    //         {
    //             cache_account = await Get("account_"+ref); // get cache accounts from redis
    //             if(!IfEmpty(cache_account))
    //             {
    //                 cache_account = Decrypt(cache_account);
    //                 if(cache_account[typ] == ref)
    //                 {
    //                     return { code: GetStatusResponse("success").code, success: true, msg: GetStatusResponse("success").msg, data: cache_account } // return response to requester
    //                 }
    //                 else return DBOps();
    //             }
    //             return DBOps();
    //         } 
    //         else return DBOps();

    //     }
    // }
    
    // Query the database to get resource
    const DBOps = async () => {
        try {

            let qry:any;
            if (typ == "id") qry = {id: ref};
            if (typ == "email") qry = {email: ref};
            if (typ == "username") qry = {username: ref}; 
            
            let account:any = await Account.findOne({ 
                                                where: qry,
                                                include: [
                                                    {
                                                        model: School,
                                                        attributes: ["id", "reg_code", "reg_date"],
                                                        required: false,
                                                        include: [{
                                                                    model: SchoolCategory,
                                                                    attributes: ["id", "category_id"],
                                                                    required: false,
                                                                    include: [
                                                                        {
                                                                            model: Category,
                                                                            attributes: ["name"],
                                                                            required: false
                                                                        }
                                                                    ]
                                                                }]
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
                                                    {
                                                        model: Status,
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
                                                        model: Country,
                                                        attributes: ["name"],
                                                        required: false
                                                    }  
                                                ]
                                            })

            if(!IfEmpty(account)) // if data is not empty
            {
                // Save("account_"+account.id, Encrypt(account), null, false); // cache session for 24 hours
                return { 
                    success: true,
                    code: GetStatusResponse("success").code, 
                    msg: GetStatusResponse("success").msg, 
                    data: account 
                }
            }

            else return { code: GetStatusResponse("not_found").code, success: false, msg: GetStatusResponse("not_found").msg, data: null } // return a 404 response to requester

        } 
        catch (error:any) {
            Logger('engine', "Failed execution: failed to confirm account: "+ error.message); // log error message to .log file 
            return { code: GetStatusResponse("internal_server_err").code, success: false, msg: GetStatusResponse("internal_server_err").msg }; // return a 500 response to requester;
        }
 
    }

    return await DBOps(); // Init redis function 

}