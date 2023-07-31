import express from 'express';
const bodyParser = require('body-parser');
const cors = require('cors');
const useragent = require('express-useragent');

const { GetService } = require("./core/data/services");
const { CrashHandler } = require("./helpers/crash-exceptions");

const {InitDBConnection } = require("./core/database");
InitDBConnection();

const router = require('./routes.ts'); // GET API ROUTE PATHS FOR THIS SERVER
const instance = GetService("main").instance;

let app: any = new Array(instance);
let port_range:number = GetService("main").port_range;

for(let i = 0; i < instance; i++)
{
    let port:number = port_range+i;
    app[i] = express(); // initiate new instance of express
    app[i].use(cors());
    app[i].use(useragent.express());
    app[i].use(bodyParser.json());
    app[i].use(bodyParser.urlencoded({ extended: false }));
    app[i].use("/api-v1", router);
    app[i].use(CrashHandler); // handle all server crash errors.
    app[i].listen(port, () => { 
        console.log(`Nodejs Server Currently Running On Port ${port}`)
    });
}