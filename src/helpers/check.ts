
export const CheckBoolean = (x:any):boolean =>  x === 't' || x === 'true' || x === '0' || x === 0 ? true : false ;

export const CheckPlural = (num:number):string => num > 1 ? 's' : ''; 

export const CheckTotal = (x:any):number => !IfEmpty(x) ? x.length : 0;

export const CheckItemExist = (item:any, arr:Array<any>):boolean => {
    if(arr.indexOf(item) !== -1) return true 
    return false
}

export const CheckIDExist = (id:any, arr:Array<any>):boolean => {
    let i:number = 0;
    while(i < arr.length) {
        // do stuff
        if(id == arr[i].id) return true;
        i++;
    }
    return false
}

export const CheckVowel = (str:string):string => {  
    let res = ['a','e','i','o','u'].indexOf(str[0].toLowerCase()) !== -1;
        return res ? `an ${str}` : `a ${str}` ;
} 

export const CheckEmailFormat = (email:string):boolean => {  
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
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

export const CheckEven = (num:number):boolean =>  ( num % 2 == 0 ) ? true : false;

export const CheckTheme = ():string =>  window.matchMedia(`(prefers-color-scheme: dark)`) ? "light" : "dark";