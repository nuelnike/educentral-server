import {IfEmpty} from '../../helpers';
import { Decrypt } from '.';

export const ValidatePostRequest = (req:any):boolean => { 
    if (IfEmpty(req.headers)) return false;
    if (IfEmpty(Decrypt(req.headers).uid) || IfEmpty(Decrypt(req.headers).token)) return false;
    if (IfEmpty(req.body)) return false
    return true;
}

export const ValidateGetRequest = (req:any) => {
    if (IfEmpty(req.headers)) return false;
    if (IfEmpty(Decrypt(req.headers).uid) || IfEmpty(Decrypt(req.headers).token)) return false;
    if (IfEmpty(req.params)) return false
    return true;
}

