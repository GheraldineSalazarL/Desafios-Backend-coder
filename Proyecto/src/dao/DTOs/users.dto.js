export default class UsersDto {
    constructor (user){
        this.name = user.name ? user.name : `${user.first_name} ${user.last_name}` ; 
        this.email = user.email; 
        this.age = user.age;
        this.rol = user.rol;
    }
}