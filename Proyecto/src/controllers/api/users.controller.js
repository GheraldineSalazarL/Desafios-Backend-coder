import * as sessionsService from '../../services/sessions.service.js';

const current = async (req, res) => {
    res.sendSuccess(req.user); 
};

const roleChange = async (req, res) => {
    try {
        const {uid} = req.params;

        const user= await sessionsService.getById(uid);

        let rol = user.rol==='USER' ? 'PREMIUM' : 'USER'

        const result = await sessionsService.updateUserRol(uid, rol);
        res.send({status: 'sucess', message:`Rol ${user.rol} modificado por ${rol}`});
        return req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch (error) {
        res.status(500).send({error});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
    }
};

export { 
    current,
    roleChange
}