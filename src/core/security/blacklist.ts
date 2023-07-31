import fs  from 'fs';
import {IfEmpty} from '../../helpers';

export const Blacklist = (data:any) =>
{

    let load_file:any = fs.readFileSync(__dirname + '/../files/blacklist.json', 'utf-8'); 

    let _file:any = IfEmpty(load_file) ? [] : JSON.parse(load_file);

    _file.push(data);

    fs.writeFile(__dirname + '/../files/blacklist.json', JSON.stringify(_file, null, 1),
    (error) => {
        if (error) console.log(error)
    })
}