class ApiResponse{
    constructor(
        statusCode,
        data,
        message
    ){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = (this.statusCode<400);

    }

}

const value = new ApiResponse(500, "sapmle string", "success");
console.log(value);
