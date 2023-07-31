//Set REDIS CACHE
import redis from "ioredis";
import { Logger } from "../../log";

const port:number = 6379;
const password:string = "2580";
const host:string = "127.0.0.1";

let client:any;

try 
{
    client = new redis({ host, port, password});

    if(!client)
    {
        console.log("Redis connection failed.");
        Logger('engine', "Failed connection: failed to connect to redis server: "); // log error message to .log file 
    }
} 
catch (error:any) 
{
    console.log("Redis connection failed.");
    Logger('engine', "Failed connection: failed to connect to redis server: "+ error.message); // log error message to .log file 
}

// client.connect();  
// _client.zadd("movie-ratings", 5, "marvel")

export const Increment = async (val: string, time: number, expire:boolean = true) =>
{
    await client.incr(val)
    .then(() => {
        if(expire) Expiry(val, time); // init cache lifespan if key needs to expire.
        return true; // return resp
    })
    .catch(() => {
        return false;
    }); 
}

export const Save = async (key:string, val:string, time:number, expire:boolean = true) =>
{
    // await client.set(key, (typeof val === "object") ? JSON.stringify(val) : val)
    // .then(() => {
    //     if(expire) Expiry(key, time); // init cache lifespan if key needs to expire.
    //     return true; // return resp
    // })
    // .catch(() => {
    //     return false;
    // }); 

    await client.set(key, (typeof val === "object") ? JSON.stringify(val) : val)
    .then(() => {
        if(expire) Expiry(key, time); // init cache lifespan if key needs to expire.
        return true; // return resp
    })
    .catch(() => {
        return false;
    }); 
}

export const CacheSet = async (set:string, key:string):Promise<boolean> =>
{
    client.zadd(set, 1, key)
    .then(() => {
        return true; // return resp
    })
    .catch(() => {
        return false;
    });

    return false;
}

export const Get = async (key:string) =>
{
    let res:any;
    await client.get(key)
    .then((data:any) => { 
        if(data === null) res = null;
        else if(data.includes("/")) res = JSON.parse(data);
        else res = data;
    })
    .catch((err:any) => {
        return err.message;
    });

    return res;
}

export const Remove = async (key:string) => { 
    return await client.del(key);
}

export const Expiry = async (key:string, time:number = 300) => {
    return client.expire(key, time);
}

// export const InitRedisServer = async ():Promise<any> => {
//     client = new redis({port, password, host});
//     await client.connect();
//     if(client.isOpen) console.log("Redis server is running on port: "+port);
//     else console.log("Redis server failed to run.");
// }

// export const CloseConnection = async ():Promise<any> => {
//     let dd = await Get("auth_instance");
//     console.log(dd)
//     // client = null;
//     // let dd = redis.disconnect();
//     // console.log(dd)
// }



// module.exports = { Set, Remove, Get, Expiry }