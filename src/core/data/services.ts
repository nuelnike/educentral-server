export const MainServiceLive:boolean = false;
export const AuthServiceLive:boolean = false;
export const GOLangLive:boolean = false;
export const UtilityServiceLive:boolean = false;

interface ServicesDataModel  { 
    name: string;
    port_range: number;
    path?: string;
    ip: string;
    app_id: string;
    status: boolean;
    version: number;
    instance: number;
}


const services:Array<ServicesDataModel> =  [ 
    {
        instance: 1,
        status: MainServiceLive,
        version: 1,
        name: "main",
        app_id: "EduCentral",
        ip: !MainServiceLive ? `http://localhost` : `143.198.138.103`,
        port_range: 8000
    },
    {
        instance: 1,
        status: AuthServiceLive,
        version: 1,
        name: "auth",
        app_id: "authTQ",
        ip: !AuthServiceLive ? `http://localhost` : `143.198.138.103`,
        path: `/api-v1/auth`,
        port_range: 4500
    },
    {
        instance: 3,
        status: UtilityServiceLive,
        version: 1,
        name: "utility",
        app_id: "utilityTQ",
        ip: !UtilityServiceLive ? `http://localhost` : `143.198.138.103`,
        path: `/api/v1/utility`,
        port_range: 4300
    },
    {
        instance: 1,
        port_range: 3000,
        version: 1,
        status: GOLangLive,
        name: "golang",
        app_id: "mainTQ",
        ip: !GOLangLive ? `http://localhost` : `143.198.138.103`,
        path: `/api/v1/golang`,
    }
]

export const GetService = (x:string):ServicesDataModel => 
{
    let resp:any = services.find((item) => item.name == x );
    return resp;
}