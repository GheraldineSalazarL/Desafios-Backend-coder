import SessionsRepository from '../repository/sessions.repository.js';

const sessionsRepository = new SessionsRepository();

export const register = async (user) => {
    const result = await sessionsRepository.register(user);
    return result;
}

export const login = async (email, password) => {
    const result = await sessionsRepository.login(email, password);
    return result;
};