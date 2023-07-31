import { GetService } from "../core/data/services";

export const LoadBalancer = (service:string, i:number) =>
{
    let _service = GetService(service);
    let port:number = _service.port_range+i;
    return _service.ip + ":" + port + _service.path;
}