import fs from "fs";
import NodeMailer from "nodemailer";
import { Logger } from "../../helpers/logger";
import { IfEmpty } from "../../helpers";
import { company, email, support, email_password } from "../data/system-info";

const MailTemplate = (typ:string, payload:any) => {
    let _path:string = `${__dirname}/./templates/`;
    let template:any;
    fs.readdirSync(_path).forEach(name => {
        let _ext = name.indexOf('.'); // find .
        let _email = name.substring(0, _ext); // remove .js / ts from filename 
        if(typ === _email) template = require(`${_path+name}`).Template(payload);
    });

    return template;

}

const MailTransporter = NodeMailer.createTransport({
    service: 'Gmail', //smtp.gmail.com  //in place of service use host...
    host: 'smtp.gmail.com',
    secure: true,
    port: 587,
    auth: {
        user: email,
        pass: email_password
    }
})

export const SendMail = (typ:string, payload:any, to:string) => {
    let mailOption:any = {
        from: company + ' <' + support + '>',
        to,
        subject: payload.subject,
        html: MailTemplate(typ, payload.payload),
    };

    (async () => {
        try
        {
            return  MailTransporter.sendMail(mailOption, function(error) { 
                        return !IfEmpty(error) ? false : true;
                    });
        }
        catch(err:any){
            Logger('email_service', `Failed to send ${typ} email: ${err.message}`);
            console.log(err.message);
        }
    })();
    
}