import { current, roleChange, uploaderDocuments, getUsers, deleteUsersInactive, deleteUserId } from '../../controllers/api/users.controller.js';
import uploader from '../../utils/uploader.js';
import Router from './router.js';

export default class UsersRouter extends Router {
    init() {
        this.get('/currentUser', ['ADMIN'], current);
        this.post('/premium/:uid', ['ADMIN'], roleChange);
        this.post('/:uid/documents', ['USER', 'PREMIUM', 'ADMIN'], uploader.array('document'), uploaderDocuments)
        this.get('/', ['ADMIN'], getUsers)
        this.delete('/', ['ADMIN'], deleteUsersInactive)
        this.delete('/:uid', ['ADMIN'], deleteUserId)
    }
}