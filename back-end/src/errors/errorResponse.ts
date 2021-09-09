
export  class ErorrResponse extends Error{
    constructor(message:any ,public statusCode:any){
        super(message);
        statusCode = this.statusCode
    
    }

}