import { CapString, IfEmpty } from "../../../helpers";
import { company, physical_address } from "../../data/system-info";
export const Template = (payload:any) => {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

    <head>
        <title>
    
        </title>
        <!--[if !mso]><!-- -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
            #outlook a {
                padding: 0;
            }
    
            .ReadMsgBody {
                width: 100%;
            }
    
            .ExternalClass {
                width: 100%;
            }
    
            .ExternalClass * {
                line-height: 100%;
            }
    
            body {
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
    
            table,
            td {
                border-collapse: collapse;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }

            .padTop{
                padding-top:0px !important;
            }
    
            img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
                -ms-interpolation-mode: bicubic;
            }
    
            p {
                display: block;
                margin: 13px 0;
            }
        </style>
        <!--[if !mso]><!-->
        <style type="text/css">
            @media only screen and (max-width:480px) {
                @-ms-viewport {
                    width: 320px;
                }
                @viewport {
                    width: 320px;
                }

                .padTop{
                    padding-top:50px !important;
                }
            }
        </style>
        <!--<![endif]-->
        <!--[if mso]>
            <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
        <!--[if lte mso 11]>
            <style type="text/css">
              .outlook-group-fix { width:100% !important; }
            </style>
            <![endif]-->
    
    
        <style type="text/css">
            @media only screen and (min-width:480px) {
                .mj-column-per-100 {
                    width: 100% !important;
                }
                .padTop{
                    padding-top:50px !important;
                }
            }
        </style>
    
    
        <style type="text/css">
        </style>
    
    </head>
    
    <body class="padTop" style="background-color:#f9f9f9;"> 
        <table align="center" cellpadding="0" cellspacing="0" style="width:800px; border: none !important;" width="600" >
            <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                <![endif]--> 

                    <div style="background:#fff;background-color:#fff;margin-top:20px auto;max-width:800px;border-top:#7239EA solid 5px;">
 
                        <table cellpadding="0" cellspacing="0" role="presentation" style="background:#fff;background-color:#fff;width:100%;">
                            
                            <tbody>
                                
                                <tr>
                                    <td style="border:#dddddd solid 1px;border-top:0px;direction:ltr;font-size:0px;padding:10px 0;text-align:center;vertical-align:top;">
                                    <!--[if mso | IE]>

                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                    
                                            <tr>

                                                <td style="vertical-align:bottom;width:800px;" >
                                                <![endif]-->
    
                                                    <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
                        
                                                        <table cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;" width="100%">

                                                            
    
                                                            <tr>
                                                                <td style="font-size:0px;padding:10px 10px;word-break:break-word;">
                                                                    <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:22px;color:#555;">
                                                                        Hi ${payload.name},  <br/><br/>
                                                                        ${payload.msg}
                                                                    </div> 
                                                                </td>
                                                            </tr>

                                                        </table>

                                                    </div>

                                                <!--[if mso | IE]>
                                                </td>

                                            </tr>
          
                                        </table>

                                    <![endif]-->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
    
                    </div>
    
    
                <!--[if mso | IE]>
                </td>
            </tr>
        </table>
      
        <table align="center" cellpadding="0" cellspacing="0" style="width:800px;" width="600">     
            <tr>

                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                <![endif]-->

                    <div style="Margin:0px auto;max-width:800px;">

                        <table align="center" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                            
                            <tbody>
                                
                                <tr>
                                    
                                    <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                    <!--[if mso | IE]>

                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                            
                                            <tr>
                                                
                                                <td style="vertical-align:bottom;width:800px;">
                                                <![endif]-->

                                                   <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">

                                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="vertical-align:bottom;padding:0;">

                                                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">

                                                                            <tr>
                                                                                <td align="center" style="font-size:0px;padding:0;word-break:break-word;">

                                                                                    <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                                      ${ company }, ${ physical_address }
                                                                                    </div>

                                                                                </td>
                                                                            </tr>

                                                                            <tr>
                                                                                <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">

                                                                                    <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                                        click here if you wish to <a href="/" style="color:#009BF3;">unsubscribe</a>. 
                                                                                    </div> 

                                                                                </td>
                                                                            </tr>

                                                                        </table>

                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                    </div>

                                                <!--[if mso | IE]>
                                                </td>

                                            </tr>

                                        </table>

                                    <![endif]-->
                                    </td>
                                </tr>

                            </tbody>

                        </table>
            
                    </div>

                <!--[if mso | IE]>
                </td>
            </tr>
        </table>
        <![endif]--> 
    </body>
    </html>`;
}