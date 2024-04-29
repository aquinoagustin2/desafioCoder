import {cartsDao} from '../dao/index.js';
import {cartsError} from '../errores.js';

class CartController{
    static getCart = async (req,res)=>{
        try {
            const carts = await cartsDao.getAll();
            req.logger.info(carts)
            if(!carts)
                res.status(400).send({
                    status:'error',
                    msg:'No se encontraron los carritos'
            })
            res.status(200).send({
                status:"success",
                carritos: carts
            }) 

        } catch (error) {
            req.logger.error(cartsError.getCart)
            res.status(500).send({
                status:'error',
                error:error.message,
                msg:cartsError.getCart
            })
        }

    }

    static getBy = async (req,res)=>{
        try {
            const cid = req.params.cid;
            const cart = await cartsDao.getBy({_id:cid})
            req.logger.info(`CID: ${cid}  ${cart} `)
            if(!cart)
            res.status(400).send({
                status:'error',
                msg:'No se encontro el carrito'
            })
            res.status(200).send({
                status:"success",
                cart
            })
        } catch (error) {
            req.logger.error(cartsError.getBy)
            res.status(500).send({
                status:'error',
                error:error.message,
                msg:cartsError.getBy
            })
        }

    }
    static saveCart = async (req,res)=>{
        try {
            const cart = await cartsDao.saveCart()
            req.logger.info(`${cart} `)
            if(!cart)
            res.status(400).send({
                status:'error',
                msg:'No se pudo guardar el carrito'
            })
            res.status(200).send({
                status:"success",
                cart
            })      
        } catch (error) {
            req.logger.error(cartsError.saveCart)
            res.status(500).send({
                status:'error',
                error:error.message,
                msg:cartsError.saveCart
            })
        }

    }
    static addProductInCart = async (req,res)=>{
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const quantity = req.body.quantity
            const carts = await cartsDao.addProductInCart(cid,pid,quantity)
            req.logger.info(`CID: ${cid}  PID: ${pid}  QUANTITY:${quantity} ${carts}`)
            if(!carts)
                res.status(400).send({
                    status:'error',
                    msg:'No se pudo realizar la operacion'
                })
            res.status(200).send({
                status:'success',
                carts
            })  
        } catch (error) {
            req.logger.error(cartsError.addProductInCart)
            res.status(500).send({
                status:'error',
                error:error.message,
                msg:cartsError.addProductInCart
            })
        }

    }
    static editCart = async (req, res) =>{
        const { cid } = req.params;
        const updatedProducts = req.body;
        try {
          const updatedCart = await cartsDao.editCart(cid, updatedProducts);
          if(!updatedCart)
            res.status(400).send({
                status:'error',
                msg:'No se pudo realizar la operacion'
            })
          res.status(200).send({
            status:'success',
            updatedCart
          })
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
    static editProductCartQuantity = async (req,res)=>{
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const quantity = req.body.quantity;
            const carts = await cartsDao.editProductCartQuantity(cid,pid,quantity);
            req.logger.info(`CID: ${cid}   PID: ${pid} QUANTITY:${quantity} ${carts} `)
            if(!carts)
                res.status(400).send({
                    status:'error',
                    msg:'No se pudo realizar la operacion'
                })
            res.status(200).send({
                status:"success",
                 carts
            })    
        } catch (error) {
            req.logger.error(cartsError.editProductCartQuantity)
            res.status(500).send({
                status:'error',
                error:error.message,
                msg:cartsError.editProductCartQuantity
            })
        }

    }
    static deleteProductCart = async (req,res)=>{
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const cart = await cartsDao.deleteProductCart(cid,pid)
            req.logger.info(`CID: ${cid}   PID: ${pid}  ${cart} `)
            if(!cart)
                res.status(400).send({
                    status:'error',
                    msg:'No se pudo realizar la operacion'
                })
            res.status(200).send({
                status:'success',
                cart
            }) 
        } catch (error) {
            req.logger.error(cartsError.deleteProductCart)
            res.status(500).send({
                status:'error',
                error:error.message,
                msg:cartsError.deleteProductCart
            })
        }

    }
    static deleteProductCartAll = async (req,res)=>{
        try {
            const cid = req.params.cid;
            const cart = await cartsDao.deleteProductCartAll(cid)
            req.logger.info(`CID: ${cid}   ${cart} `)
            if(!cart)
            res.status(400).send({
                status:'error',
                msg:'No se pudo realizar la operacion'
            })
            res.status(200).send({
                status:'success',
                cart
            })    
        } catch (error) {
            req.logger.error(cartsError.deleteProductCartAll)
            res.status(500).send({
                status:'error',
                error:error.message,
                msg:cartsError.deleteProductCartAll
            })
        }

    }
    static finalizePurchase = async (req, res) => {
        try {
            const cid = req.params.cid;
            const email = req.body.email;
            const result = await cartsDao.finalizePurchase(cid,email)
            req.logger.info(`CID: ${cid}   EMAIL: ${email} PURCHASE:${result}  `)
            if(!result)
            res.status(400).send({
                status:'error',
                msg:'No se pudo realizar la operacion'
            })
            res.status(200).send({
                status:'success',
                txt:'Compra realizada',
                result
            })   
        } catch (error) {
            req.logger.error(cartsError.finalizePurchase)
            res.status(500).send({
                status:'error',
                error:error.message,
                msg:cartsError.finalizePurchase
            })
        }


    }
}
export {CartController};