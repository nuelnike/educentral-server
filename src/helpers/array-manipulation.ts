export const SearchArray = (keyword:any, arr:Array<any>):Array<any> => {
    let i:number = 0;
    let new_arr:Array<any> = [];
    if(keyword.length > 1)
    {
        while(i < arr.length) {
            // do stuff
            if(arr[i].name.includes(keyword.toLowerCase())) new_arr.push(arr[i]);
            ++i;
        }
    }
    else if(keyword.length == 0 ) new_arr = arr;
    return new_arr;
} 

export const DeleteItemByIndex = (i:number, arr:Array<any>):Array<any> => {
    arr.splice(i, 1);
    return arr;
}

export const DeleteItemByID = (id:any, arr:Array<any>):Array<any> => {
    arr.splice(arr.findIndex(function(item){
        return item.id === id;
    }), 1);
    return arr;
}

export const GetItemByID = (id:any, arr:Array<any>):any => {
    let i:number = 0;
    while (i < arr.length) { 
        if(arr[i].id == id) return arr[i];
        ++i;
    }
    return null;
}

export const GetItemByKey = (key:string, ref:any, arr:Array<any>):any => {
    let i:number = 0;
    while (i < arr.length) { 
        if(arr[i][key] == ref) return arr[i];
        ++i;
    }
    return null;
}

export const SortArrayByKey = (key:string, ref:any, arr:Array<any>):any => {
    let i:number = 0;
    let new_arr = [];
    while (i < arr.length){ 
        if(arr[i][key] == ref) new_arr.push(arr[i]);
        ++i;
    }
    return new_arr;
}