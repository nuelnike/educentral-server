const { IfEmpty } = require(".");
const { GetStatusResponse } = require("../core/data/status-response");
const { Logger } = require("../log");

export const CrashHandler = (req:any, next:any):any => {
    const ip:any = req.headers['x-forwarded-for'] || req.headers['forwarded-for'] || req.headers['forwarded'] || req.headers['x-client-ip'] || req.socket.remoteAddress || req.connection.remoteAddress;
    let res:any = req.res;
    if(!IfEmpty(req))
    { 
        Logger('exceptions', ip+" tried to access "+req.path+" endpoint that caused unexpected server crash.");
        return  res.json({ 
                    success: false, 
                    code: GetStatusResponse("internal_server_err").code, 
                    msg: GetStatusResponse("internal_server_err").msg,
                    data: null
                });
    }
    else return next();
}