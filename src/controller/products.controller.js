import {productsDao} from '../dao/index.js';
import { prodsError } from '../errores.js';

class ProductController{
    static getProduct = async (req,res) =>{
            try {
                const { limit, page, sort, category, availability, query} = req.query
                const products = await productsDao.getAll(limit, page, sort, category, availability, query)
                req.logger.info(`products:${products}`)
                res.send({
                    status: "success",
                    products: products
                });
            } catch (error) {
                req.logger.error(prodsError.getProduct)
                res.status(500).send({
                    status:'error',
                    error:error.message,
                    msg:prodsError.getProduct
                })
            }
    }

    static saveProduct = async (req,res)=>{
        try {
            const product = req.body;
            console.log(product)
            const products = await productsDao.saveProduct(product);
            req.logger.info(`products:${products}`)
            res.send({
                status:"success",
                msg:"Producto creado",
                productos: products
            })
        } catch (error) {
            req.logger.error(prodsError.saveProduct)
            res.status(500).send({
                status:'error',
                error:error.message,
                msg:prodsError.saveProduct
            })
        }
    }

    static getBy = async (req,res)=>{
        try {
            const pid = req.params.pid;
            const result = await productsDao.getBy({_id:pid});
            req.logger.info(`PID:${pid} getProduct:${result}`)
            res.send({
                status:"success",
                msg:`Product ${pid} `,
                result
            })    
        } catch (error) {
            req.logger.error(prodsError.getBy)
            res.status(500).send({
                status:'error',
                error:error.message,
                msg:prodsError.getBy
            })
        }

    }

    static updateProduct = async (req,res)=>{
        try {
            const pid = req.params.pid;
            const prod = req.body;
            const result = await productsDao.updateProduct(pid,prod)
            req.logger.info(`PID:${pid} products:${result}`)
            if(result){
                res.send({
                    status:"success",
                    msg:`Ruta PUT de PRODUCTS con ID: ${pid}`,
                    result
                })  
            } 
        } catch (error) {
            req.logger.error(prodsError.updateProduct)
            res.status(500).send({
                status:'error',
                error:error.message,
                msg:prodsError.updateProduct
            })
        }

    }

    static deleteProduct = async (req,res)=>{
        try {
            const pid = req.params.pid;
            const result = await productsDao.deleteProduct(pid);  
          res.send({
                status:"success",
                msg:result
            })  
        } catch (error) {
            req.logger.error(prodsError.deleteProduct)
            res.status(500).send({
                status:'error',
                error:error.message,
                msg:prodsError.deleteProduct
            })
        }

    }


}

export {ProductController};