export class ApiError{
    success:boolean
    error: string

    constructor(error:string){
        this.success= false,
        this.error = error 
    }
}