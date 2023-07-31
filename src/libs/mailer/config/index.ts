const fs = require("fs"); 
const NodeMailer = require("nodemailer");
import { email, email_password, name } from '../../../core/data/system-info';
import { IfEmpty } from '../../../helpers';
const email_folder_path = '../templates/';

const MailTransporter = () => { 
    NodeMailer.createTransport({
        service: 'Gmail', //smtp.gmail.com  //in place of service use host...
        host: 'smtp.gmail.com',
        secure: true,
        port: 587,
        auth: {
            user: email,
            pass: email_password
        }
    });
}

const MailTemplate = (typ:string, payload:any) => {
    //AUTH API UTILS   
    fs.readdirSync(email_folder_path).forEach((name:string) => {

        let findFileExt:number = name.indexOf('.'); // find .js extention
        let emailFile:string = name.substring(0, findFileExt); // remove .js from filename 
        if(typ === emailFile){   
            let { Template } = require(`${email_folder_path+name}`);
            return Template(payload);
        }
    })
}

export const SendMail = (mailType:string, payload:any, toAddress:string) => {
    let mailOptions:any = {
        from: name + ' <' + email + '>',
        to: toAddress,
        subject: payload.subject,
        html: MailTemplate(mailType, payload),
    };
    MailTransporter.sendMail(mailOptions, 
    (error:any, info:any) => { 
        console.log(info)
        console.log(error)
        return IfEmpty(error) ? true +' email sent successfully.' : false+" email not sent.";  
    });
}
