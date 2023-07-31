const fs = require("fs"); 
export const Logger = (resource:string, message:string) => {
    // console.log(resource)
    fs.appendFile(__dirname + '/../log/logs/'+resource+'.log',
    message + ' on ' + new Date(Date.now()) + '\n',
    (error:any) => {
        if (error) console.log(error.message)
    })
}