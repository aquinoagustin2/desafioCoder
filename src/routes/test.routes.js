import { Router } from "express";

const router = Router();

router.get("/",(req,res)=>{
    try {
        req.logger.error('error N-1') 
        req.logger.warn('warning N-2')
        req.logger.info('info N-3') 
        req.logger.http('http N-4')        
        req.logger.debug('debug N-5') 
        res.send({
            msg:'En este endpoint podrás ver todos los logs'
        }) 
    } catch (error) {
        req.logger.fatal('error N-0') 
    }

})

export default router;