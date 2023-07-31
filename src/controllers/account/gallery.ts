import type {Request, Response} from 'express';
const { Logger } = require("../../log");
const { GetStatusResponse } = require("../../core/data/status-response");
const { Decrypt } = require("../../core/security");
const { SaveGallery } = require("../../bootstrap/account/save-gallery");
const { GetGallery } = require("../../bootstrap/account/get-gallery");
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
    router.post('/upload-gallery-files/:id', ValidateSession, 
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

        (async () => {
          try{

            let fType:string = req.file.mimetype;
            fType = fType.includes("image") ? "image" : "video"; 
            let result:any = await SaveGallery({account_id: Decrypt(req.params.id), ref_link: req.file.path, file_type: fType});
            return res.json(result);
          }
          catch (err:any){
              Logger('account', `Failed to save file details to database: ${err.message}`);
              return  res.json({
                          success: false,
                          data: null,
                          code: GetStatusResponse("internal_server_err").code,
                          msg: GetStatusResponse("internal_server_err").msg
                      });
          }
          })();

    });

    
    //Get galleries
    router.get('/get-galleries/:id', (req:Request, res:Response) => {

      let id:any = Decrypt(req.params.id);
      
      (async () => {
      try{
          let result:any = await GetGallery(id);
          return res.json(result);
      }
      catch (err:any){
          Logger('account', `Failed to fetch galleries: ${err.message}`);
          return  res.json({
                      success: false,
                      code: GetStatusResponse("internal_server_err").code,
                      msg: GetStatusResponse("internal_server_err").msg
                  });
      }
      })();  

  });

}


