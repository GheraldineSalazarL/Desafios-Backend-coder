import UsersDto from '../../dao/DTOs/users.dto.js';
import { generateToken } from '../../utils.js';

const authGithub = async (req, res) => {
    res.send({ status: 'succes', message:'user Registered'});
};

const authGithubCallback =  (req, res) => {
    const userDto = new UsersDto(req.user)
    const userLog = {...userDto}
    const accessToken = generateToken(userLog);

    res.cookie('token', accessToken);    
    res.redirect('/products');   
};

export {
    authGithub, 
    authGithubCallback, 
}