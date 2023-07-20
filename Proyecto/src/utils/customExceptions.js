export class ResultNotFound extends Error{
    constructor(message){
        super(message);
        this.name = this.constructor.name; 
    }
}

export class IncorrectLoginCredentials extends Error{
    constructor(message) {
        super(message);
        this.name = this.constructor.name; 
    }
}

export class UserExists extends Error{
    constructor(message){
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

export class UserCannotChanged extends Error{
    constructor(message){
        super(message);
        this.name = this.constructor.name; 
    }
}


export class NotDocuments extends Error{
    constructor(message){
        super(message);
        this.name = this.constructor.name; 
    }
}

