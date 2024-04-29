import {productsDao,cartsDao} from '../dao/index.js';



class ViewsController{
    static products = async (req, res) => {
        try {
            const { limit, page, sort, category, availability, query} = req.query
            const products = await productsDao.getAll(limit, page, sort, category, availability, query);
            res.render('products',{products: products.msg.docs,user:req.session.user}); 
           // res.render('products', {products:products.msg.docs, user: req.session.user}); 
        } catch (error) {
            req.logger.error('No se encontraron los productos')
            res.status(500).send({
                error:error.message,
                msg:'No se encontraron los productos'
            })
        }

    }

    static cart = async(req,res)=>{
        try {
            const cid = req.params.cid;
            const cart = await cartsDao.getBy({_id:cid})
            res.render('cart',{cart})       
            console.log(cart)
        } catch (error) {
            req.logger.error('No se encontro el carrito')
            res.status(500).send({
                error:error.message,
                msg:'No se encontro el carrito'
            })
        }

     }

     static register = (req,res)=>{
        try {
            res.render('register');  
        } catch (error) {
            req.logger.error('No se registro')
            res.status(500).send({
                error:error.message,
                msg:'Error'
            })
        }

    }

    static login = (req,res)=>{
        try {
            res.render('login');
        } catch (error) {
            req.logger.error('No se pudo loguear')
            res.status(500).send({error:error.message})
        }

    }


    static dbCart = async (req, res) => {
        const { cartId } = req.params;
        try {
          const cart = await productsDao.getBy({_id:cartId});
          if (cart) {
            res.render('dbCart', { cart });
          } else {
            res.status(404).json({ error: `Carrito con ID ${cartId} no encontrado` });
          }
        } catch (error) {
          console.error('Error al obtener detalles del carrito:', error.message);
          res.status(500).send('Error interno del servidor');
        }
      };
      


}

export {ViewsController};