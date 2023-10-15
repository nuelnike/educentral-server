import { IfEmpty, CheckPlural } from ".";

export const GetTime = ():string =>{
    let ndate:any = new Date();
    let hr:number = ndate.getHours();
    return hr < 12 ? 'morning' : hr < 18 ? 'afternoon' :'evening';
}

export const FormatDate = (date:any):string => {
    let d:any = new Date(date);
    let month:string = '' + (d.getMonth() + 1);
    let day:string = '' + d.getDate();
    let year:number = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

export const ServerTime = ():string =>{
    let date:any = new Date; 
    let hour:number = date.getHours();
    let mins:number = date.getMinutes();
    let ampm:string = hour >= 12 ? 'pm' : 'am';
    
    hour = hour % 12;
    hour = hour ? hour : 12;
    mins < 10 ? '0'+mins : mins
    return hour + ':' + mins + ' ' +ampm;
}

export const GetCurrentWeek = (curr:any = new Date()):Array<any> =>{ 
    let week:Array<any> = [] 
    for (let i:number = 0; i <= 6; i++) {
        let first:any = curr.getDate() - curr.getDay() + i 
        let day:any = new Date(curr.setDate(first)).toISOString().slice(0, 10)
        week.push(day)
    } 
    return week;
}

export const WeekNumber = (date = new Date()):number => {  
    let d:any = new Date(date);
    let startDate:any = new Date(d.getFullYear(), 0, 1);
    let days:number = Math.floor((d - startDate) / (24 * 60 * 60 * 1000));
          
    return Math.ceil(days / 7); 
}

export const GetAge = (y1:number, y2:number):string => { 
    let dif:number = Number(y2) - Number(y1);
    return dif + ' year'+CheckPlural(dif);
}

export const DateToTimestamp = (date:any):number => { // CONVERT DAYS TO MILLI SECONDS
    const datum:any = Date.parse(date); // milliseconds for a day  
    return datum / 1000;
}

export const FullMonthName:string[] = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

export const ShortMonthName:string[] = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
   
export const WeekDay:string[] = [
    "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
];

export const GetDayFromDate = (date:any):number => { 
    let new_date:any = new Date(date);
    return new_date.getDay();
}

export const Hours12 = ():number => { 
    let hrs:Array<any> = [];
    for (let i:number = 1; i < 13; i++) {
        i.toString().length == 1 ? hrs.push('0'+i) : hrs.push(i);    
    } 
    return Number(hrs);
}

export const Hours24 = ():number => { 
    let hrs:Array<any> = [];
    for (let i:number = 0; i < 24; i++) {
        i.toString().length == 1 ? hrs.push('0'+i) : hrs.push(i);    
    } 
 return Number(hrs);
}

export const Minutes = ():number => { 
    let mins:Array<any> = [];
    for (let i:number = 0; i < 60; i++)
    {
        i.toString().length == 1 ? mins.push('0'+i) : mins.push(i);    
    } 
 return Number(mins);
}
   
 
export const FutureDateMilliSecs = (date:any, days:number) => date.setDate(date.getDate() + Number(days)); 

export const GetMilliSec = (typ:string = "mins", x:number = 5):number => {
    switch (typ) {
        case "secs":
        return x * 1000;

        case "mins":
        return (60 * x) * 1000;
        
        case "hrs":
        return ((60*60) * x) * 1000;

        case "days":
        return ((60*60*24) * x) * 1000;

        case "years":
        return ((60*60*24*365) * x) * 1000;
    
        default:
        return 0;
    }
} 


export const GetFutureDateTimeStamp = (date:any = "", days:number = 7) => {
    let now = new Date(date);
    return GetDateFromTimeStamp(now.setDate(now.getDate() + days));
}

export const GetDateFromTimeStamp = (timestamp:any) => {
    let dateFormat= new Date(timestamp);
    return dateFormat.getFullYear()+'-'+(dateFormat.getMonth()+1)+'-'+dateFormat.getDate()+' '+dateFormat.getHours()+":"+dateFormat.getMinutes()+":"+dateFormat.getSeconds();
}
  
export const ReadableDate = (d:any):string => {  
    const dd:any = new Date(`${d}`) 
    return dd.toDateString();
}
 
export const FormatTime = (d:string, typ:string):any => { 
    const dd:any = new Date(`${d}`)
    const dd2:any = Date.parse(d); // milliseconds for a day  
    if(typ == 'am_pm') return dd.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    if(typ == 'timestamp') return dd2 / 1000;
}
 
export const ExtractDate = (d:string, typ:string):any => {  

    const date:any = IfEmpty(d) ? new Date() : new Date(`${d}`);

    if(typ == "year") return date.getFullYear() 
    
    if(typ == "month") return (Number(date.getMonth()) + Number(1)).toString().length > 1 ? Number(date.getMonth()) + Number(1) : Number(date.getMonth()) + Number(1)
    
    if(typ == "month_short_name") return ShortMonthName[date.getMonth()]
    
    if(typ == "month_name") return FullMonthName[date.getMonth()]
    
    if(typ == "day") return date.getDate().toString().length > 1 ? date.getDate() : '0'+date.getDate()

    if(typ == "hour"){
        let hr:any = date.getHours();
        let x:any; 
        hr.toString().length == 1 ? x = '0'+hr : x = hr;
        return x;
    } 
    
    if(typ == "mins"){
        let mins = date.getMinutes();
        let x; 
        mins.toString().length == 1 ? x = '0'+mins : x = mins;
        return x;
    } 
    
}

export const CALCU_FUTURE_DATE = (start_date:string, days:number):string => {
    let date:any = new Date(start_date);
    let f_date:any = new Date(date.setDate(date.getDate() + days)); 
    return ExtractDate(f_date, 'year') + '-' +ExtractDate(f_date, 'month') + '-' +ExtractDate(f_date, 'day');  
}

export const CountDown = (date:number, otherDate:number):number => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));