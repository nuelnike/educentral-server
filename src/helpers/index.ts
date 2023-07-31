export const Limiter = (typ:string):number =>
{
    if(typ == 'login') return 5;

    if(typ == 'registration') return 5;

    return 0;
    
}

export const RoundOff =(num:number, precision:number) => {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(num * multiplier) / multiplier;
}

export const IfEmpty = (v:any):boolean => {

    let type = typeof v;

    if (type === 'undefined') return true;

    if (type === 'boolean') return v;

    if (v === null) return true;

    if (v === undefined) return true;

    if (v instanceof Array) {
        if (v.length < 1) return true;
    } 

    if (type === 'string') {
        if (v.length < 1 || v === '0') return true;
    } 

    if (type === 'object' && Object.keys(v).length < 1) return true; 

    if (type === 'number' && v === 0) return true; 

    return false
}

export const ValidEmailAddress = (email:string) => 
{
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export const ServerState:string = "dev";

export const Host = (req:any) => req.protocol + '://' + req.get('host');

export const CheckDataType:any = (str:any) =>  typeof str;

export const CapString = (str:string):string => { 
    if(CheckDataType(str) != "string") return str;
    else if(CheckDataType(str) == "") return str;
    else return str[0].toUpperCase() + str.substring(1);
}

export const GetAfterChar = (char:string, str:any):any => {
    return str.split(char)[1];
} 

export const CheckPlural = (num:number):string => num > 1 ? 's' : ''; 

export const PageSize:number = 20;

export const PageOffset = (num:number):number => (num - 1) * PageSize;

export const PageRemaining = (total:number, page:number):number => Number(total) - Number(PageSize * page);