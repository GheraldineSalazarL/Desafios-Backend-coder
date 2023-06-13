export class ResultNotFound extends Error{
    constructor(message){
        super(message);
        this.name = this.constructor.name; //para trabajar con el nombre de la clase especifica
    }
}

export class IncorrectLoginCredentials extends Error{
    constructor(message) {
        super(message);
        this.name = this.constructor.name; 
    }
}

export class TokenExpired extends Error{
    constructor(message) {
        super(message);
        this.name = this.constructor.name; 
    }
}

export class SamePassword extends Error{
    constructor(message) {
        super(message);
        this.name = this.constructor.name; 
    }
}

export class InputIncomplete extends Error{
    constructor(message) {
        super(message);
        this.name = this.constructor.name; 
    }
}

export class RolForbiden extends Error{
    constructor(message){
        super(message);
        this.name = this.constructor.name; 
    }
}

