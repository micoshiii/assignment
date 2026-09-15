export class ApiResponse<T>{
    success:boolean;
    data:T;

    constructor(data:T){
        this.success= true;
        this.data= data
    }
}