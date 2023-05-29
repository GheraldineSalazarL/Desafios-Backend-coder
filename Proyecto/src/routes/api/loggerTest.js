export const loggerTest = (req, res) => {
    req.logger.fatal('Prueba fatal')
    req.logger.error('Prueba error')
    req.logger.warning('Prueba warning')
    req.logger.info('Prueba info')
    req.logger.debug('Prueba debug')
    req.logger.http('Prueba http')
    
    res.send({message: 'Prueba Logger'})
};
