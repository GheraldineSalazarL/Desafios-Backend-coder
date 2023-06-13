import { current, roleChange } from '../../controllers/api/users.controller.js';
import Router from './router.js';

export default class UsersRouter extends Router {
    init() {
        this.get('/currentUser', ['ADMIN'], current);
        this.post('/premium/:uid', ['ADMIN'], roleChange);
    }
}