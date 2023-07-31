interface DataModel
{
    code:number;
    status:string;
    msg:string;
}

export const status_response:Array<DataModel> =  [
    { 
        code: 200, 
        status: "success",
        msg: 'operation successfull'
    },
    { 
        code: 201, 
        status: "created", 
        msg: 'resource was created'
    },
    { 
        code: 202,
        status: "accepted",
        msg: 'request was recived successfully'
    },
    { 
        code: 204,
        status: "empty",
        msg: 'this request content is empty.'
    },
    { 
        code: 249,
        status: "too_many",
        msg: 'too many request at this time.'
    },
    { 
        code: 400,
        status: "bad_request",
        msg: 'this request is not allowed.'
    },
    { 
        code: 401,
        status: "unauthorized",
        msg: 'you are not authorized to perform this action, contact support.'
    },
    { 
        code: 403,
        status: "forbidden",
        msg: 'this action is forbidden at this time, contact support.'
    },
    { 
        code: 404,
        status: "not_found",
        msg: 'the resource requested was not found.'
    },
    { 
        code: 405,
        status: "method_not_allowed",
        msg: 'this request method is not allowed.'
    },
    { 
        code: 406,
        status: "resource_exist",
        msg: 'this resource already exists.'
    },
    { 
        code: 413,
        status: "too_heavy",
        msg: 'request payload is too heavy.'
    },
    { 
        code: 500,
        status: "internal_server_err",
        msg: 'encountered an internal server error.'
    },
    { 
        code: 502,
        status: "bad_gateway",
        msg: 'bad gateway error encountered.'
    },
    { 
        code: 503, 
        status: "unavailable",
        msg: 'this service requested is currently unavailable.'
    },
    {   
        code: 504,
        status: "timeout",
        msg: 'server request timeout error occured.'
    }
]

export const GetStatusResponse = (x:string):DataModel => 
{
    let resp:any = status_response.find((item) => item.status == x );
    return resp;
}