import {Request, Response, NextFunction} from 'express';
// const {useragent} = require('express-useragent');
const { ConfirmAccountSession } = require('../../bootstrap/account/confirm-account-session');
const { Logger } = require(`../../log`);
const { Decrypt } = require('../security/index');
const { GetStatusResponse } = require("../data/status-response"); // import custom status response data 

export const ValidateSession = (req: Request, res: Response, next:NextFunction) =>
{

    let auth:any = req.headers?.authorization;
    // const device:any = req.headers['useragent'] ? 'desktop device' : req.useragent.isMobile ? 'mobile device' : req.useragent.isTablet ? 'tablet device' : 'unknow device';
    auth = Decrypt(auth);
    (async () => {
        try {

            let result:any = await ConfirmAccountSession(auth.id, auth.token); // check account session
            if(result.success) return next();
            else
            {
                Logger('engine', 'Unauthorized access: account tried accessing server using invalid auth data');
                return  res.json({
                            success: false,
                            code: GetStatusResponse("unauthorized").code,
                            msg: GetStatusResponse("unauthorized").msg,
                            data: null
                        });
            }
        } 
        catch (error:any) {
            Logger('engine', "Failed execution: failed to validate request: "+ error.message); // log error message to .log file 
            return  res.json({ 
                        success: false,
                        code: GetStatusResponse("internal_server_err").code, 
                        msg: GetStatusResponse("internal_server_err").msg,
                        data: null
                    }); // return a 500 response to requester;
        }
    })();

    
}