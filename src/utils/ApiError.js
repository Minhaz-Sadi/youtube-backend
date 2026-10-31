class ApiError extends Error{
    constructor(
        statusCode,
        message = "something went wrong",
        errors = [],
        stack = "" // errors location
    ){
       super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;


        if(stack){
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

throw new ApiError(404, "server error");


