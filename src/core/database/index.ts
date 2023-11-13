const Sequelize = require('sequelize');
const { GetDatabaseConnection } = require("./connections");

export const DBConnection:any = {}

export const InitDBConnection = async() => { 
 
    const db = GetDatabaseConnection("educentral_main");
    const sequelize = new Sequelize(db.database, db.user, db.password, 
    {
        host: db.host,
        port: db.port,
        dialect: db.dialect,
        logging: false,
        operatorAliases: false, 
        define:
        {
            timestamps: false,
            freezeTableName: true
        },
        pool:
        {
            max: db.max,
            min:db.min,
            acquire: db.acquire,
            idle: db.idle,
        }
    });
 
    // console.log("Main Database Connected!");
    DBConnection.sequelize = sequelize;
    return sequelize; 
}
