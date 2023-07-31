interface DataModel
{
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    dialect: string;
    max: number;
    min: number;
    acquire: number;
    idle: number;
}

const connections:Array<DataModel> = [{
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "2580",
    database: "educentral_main",
    dialect: "mysql",
    max: 25,
    min: 1,
    acquire: 25 * 1000,
    idle: 5000
}];

export const GetDatabaseConnection = (x:string):DataModel => 
{
    let conn:any = connections.find((item) => item.database == x );
    return conn;
}