import {Router} from "express";
import { CartController } from "../controller/carts.controller.js";
import { checkRole } from "../middlewares/auth.js";

const router = Router();

router.get('/', CartController.getCart) //

router.get('/:cid', CartController.getBy) //
router.put("/:cid", CartController.editCart); //
router.delete('/:cid', CartController.deleteProductCartAll) //
//router.post('/',  checkRole(['user']), CartController.saveCart)
router.post('/',CartController.saveCart) //
//router.post("/:cid/product/:pid",checkRole(['user']),CartController.addProductInCart )
router.post("/:cid/product/:pid",CartController.addProductInCart )//
router.put('/:cid/product/:pid', CartController.editProductCartQuantity) //
router.delete('/:cid/product/:pid', CartController.deleteProductCart) //



router.post('/:cid/purchase',CartController.finalizePurchase) 





export {router as cartRouter};