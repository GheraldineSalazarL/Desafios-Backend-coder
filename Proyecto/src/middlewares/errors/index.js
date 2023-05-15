import EErrors from '../../services/errors/enum.js'

export default (error, req, res, next) => {
    console.log(error);
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        default:
            res.send({
                status: 'error',
                error: 'unhandled error'
            });
            break;
    }
    next()
}