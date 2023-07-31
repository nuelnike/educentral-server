import {IfEmpty} from '../../helpers';
import { UserRole } from '../data';

export const GrantAccess = (role:any, priviledges:Array<number>) => 
{
    if(IfEmpty(role)) return false; // return false if role is empty
    
    if(role === UserRole.super_admin) return true; // return true if user has super_admin role
    
    for (let i = 0; i < priviledges.length; i++) 
    { 
        if(role === priviledges[i]) return true;
        return false
    }  
}
