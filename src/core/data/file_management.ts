
export const StoragePaths = (rType:string, id:any) => {
     
    switch (rType) { // switch to define perfect api port
        case 'profile_photo': // if api request is for auth server
            return 'resource/employees/' + id + '/assets/img'; 

        case 'education_document': // if api request is for user server
            return 'resource/employees/' + id + '/documents/education';  

        case 'portfolio': // if api request is for subsidiary server
            return 'resource/portfolio/' + id + '/assets';  

        case 'utility': // if api request is for utility server
            return `5003`; 

        case 'chiefHR': // if api request is for chief HR server
            return `5004`; 

        default: // if api request is to general server
            return `9999`;
    }
}