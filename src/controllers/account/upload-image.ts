import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { SaveAcctPhoto } = require("../../bootstrap/account/save-acct-photo");
const { SaveListingPhoto } = require("../../bootstrap/account/save-listing-photo");
const { GetAccount } = require("../../bootstrap/account/get-account");
const { ValidateSession } = require(`../../core/middlewares/validate-req`);
// const { GetAfterChar } = require("../../helpers");
const multer = require("multer");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary  = require('cloudinary').v2;
cloudinary.config({
  cloud_name: "tasquik",
  api_key: "523326972479674",
  api_secret: "uxEcvlqlXO4lzWT0kvwPOlLWrck"
}); 


module.exports = (router:any) => {  
 
    //Get reviews
    router.post('/upload-photo/:typ/:id', ValidateSession, 
    multer({ 
        storage: new CloudinaryStorage({
          cloudinary: cloudinary,
          params: { 
            width: 800, 
            height: 800, 
            crop: "fill",
            resource_type: "image",
            overwrite:true,   
            folder: (req:any) => '/resource/gallery', // specify resource folder
            public_id: (req:any, file:any) => Date.now(), 
          },
            
        })
    }).single('image'), ( req:any, res:any )=>{ 

        let typ:string = req.params.typ;
        let id:string = Decrypt(req.params.id);
        let result:any;

        (async () => {
            try{
                result = await GetAccount(id);
                if(result.success)
                {
                    try{
                            if(typ == "account") result = await SaveAcctPhoto({id, photo: req.file.path});
                            if(typ == "listing") result = await SaveListingPhoto({id, image: req.file.path});
                            return res.json(result);
                    }
                    catch (err:any){
                        Logger('error', `Failed to save file details to database: ${err.message}`);
                        return  res.json({
                                    success: false,
                                    data: null,
                                    code: GetStatusResponse("internal_server_err").code,
                                    msg: GetStatusResponse("internal_server_err").msg
                                });
                    }
                }
                else return res.json(result)
            }
            catch (err:any){
                Logger('error', `Failed to save file details to database: ${err.message}`);
                return  res.json({
                            success: false,
                            data: null,
                            code: GetStatusResponse("internal_server_err").code,
                            msg: GetStatusResponse("internal_server_err").msg
                        });
            }
        })();

    });

}


