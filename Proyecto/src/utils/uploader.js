import {__dirname} from '../utils.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        let folder;
    
        if (req.body.type === 'profile') {
        folder = 'profiles/';
        } else if (req.body.type === 'product') {
        folder = 'products/';
        } else {
        folder = 'documents/';
        }

        cb(null,`${__dirname}/../src/public/doc/${folder}`)
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const uploader = multer({storage})

export default uploader;