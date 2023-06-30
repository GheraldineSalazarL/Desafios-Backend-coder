import { current, roleChange, uploaderDocuments } from '../../controllers/api/users.controller.js';
import uploader from '../../utils/uploader.js';
import Router from './router.js';

export default class UsersRouter extends Router {
    init() {
        this.get('/currentUser', ['ADMIN'], current);
        this.post('/premium/:uid', ['ADMIN'], roleChange);
        this.post('/:uid/documents', ['PUBLIC'], uploader.array('document'), uploaderDocuments)
    }
}