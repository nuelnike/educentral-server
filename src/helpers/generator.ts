
export const GenerateRandomString = (length:number = 6) =>
{
    const strings:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return [...Array(length)].reduce(a=>a+strings[~~(Math.random()*strings.length)],'');
}

export const GenerateUUID = () =>
{   
    const Gen = (length:number) =>
    {
        const strings:string = "abcdefghijklmnopqrstuvwxyz0123456789";
        return [...Array(length)].reduce(a=>a+strings[~~(Math.random()*strings.length)],'');
    }

    return Gen(8) +"-"+ Gen(8) +"-"+ Date.now().toString(36) +"-"+Gen(8)
}

export const GenerateToken = () => Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8) + Date.now().toString(36);

export const GenerateRandomInt = (length:number = 6) => (+new Date * Math.random()).toString(36).substring(0,length);

export const GenerateFutureDateInMilliSec = (date:any, days:any) => date.setDate(date.getDate() + Number(days));