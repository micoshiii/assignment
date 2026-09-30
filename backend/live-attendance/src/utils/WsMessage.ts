export class WsMessage<T>{  //<T> means "I don't know yet what type data will be. Let whoever uses this class decide."
    event :string;
    data: T;

    constructor(event:string , data:T){
        this.event = event;
        this.data = data
    }

}