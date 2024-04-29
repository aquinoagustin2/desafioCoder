import {Router} from 'express';
import { generateUser } from '../utils.js';

const router = Router();

router.get('/',(req,res)=>{
    const cant =  100;
    let users = [];
    for (let i = 0; i < cant; i++) {
        const user = generateUser();
        users.push(user);
    }
    res.json({status:'success',payload:users})
})


export {router as mockingRouter}