import * as sessionsService from '../../services/sessions.service.js';
import { __dirname } from '../../utils.js';

const current = async (req, res) => {
    res.sendSuccess(req.user); 
};

const roleChange = async (req, res) => {
    try {
        const {uid} = req.params;

        const user= await sessionsService.getById(uid);

        if(user.rol==='ADMIN') return res.status(400).send({status: "error", error: "el rol ADMIN no puede cambiarse"});

        const requiredDocuments = ['Identificacion', 'ComprobanteDomicilio', 'ComprobanteEstadoCuenta'];
        const missingDocuments = requiredDocuments.filter(document => user.documents.some(doc => doc.name.split(/[.-]/)[1] === document));
        console.log(missingDocuments)

        let rol; 
        
        if (user.rol === 'USER'){
            if( missingDocuments.length === requiredDocuments.length) {
                rol = 'PREMIUM'
            } else { return res.status(400).send({status: "error", error: "el usuario no ha terminado de procesar su documentación"})}
        } else { rol = 'USER'}

        // let rol = user.rol==='USER' ? 'PREMIUM' : 'USER'

        const result = await sessionsService.updateUserRol(uid, rol);
        res.send({status: 'sucess', message:`Rol ${user.rol} modificado por ${rol}`});
        return req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch (error) {
        res.status(500).send({error});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
    }
};

const uploaderDocuments = async (req, res) => {
    try {
        const uid = req.params.uid;
        const files = req.files;

        if (!files || files.length === 0) { 
        return res.status(400).send({status:"error", error:"No se han subido archivos."})
        }

        let folder;
    
        if (req.body.type === 'profile') {
        folder = 'profiles';
        } else if (req.body.type === 'product') {
        folder = 'products';
        } else {
        folder = 'documents';
        }

        const documents = files.map(file => ({
            name: file.filename,
            reference: `${__dirname}/public/${folder}/${file.filename}`
        }))

        const user = await sessionsService.saveDocuments(uid, documents);

        res.status(200).json({ message: 'Archivos subidos exitosamente.', user });
    } catch (error) {
        res.status(500).send({error});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
    }
};

export { 
    current,
    roleChange, 
    uploaderDocuments
}