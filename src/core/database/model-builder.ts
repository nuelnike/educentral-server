import { DBConnection } from '.';

export const SelectModel = (model:string) => { 

    const model_path:string = `./models`; 
    const { ModelBuilder } = require(model_path+'/'+model); // load required model  
 
    try {
      return DBConnection.sequelize.define( ModelBuilder(model).tbl, ModelBuilder(model).structure, ModelBuilder(model).spec ); // connect to db table.
    } 
    catch (err:any) {
      console.error(err)
    }
  
}