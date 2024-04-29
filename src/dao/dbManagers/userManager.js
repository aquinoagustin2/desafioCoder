import userModel from "../models/Users.model.js";
import {CartManagerDB} from './CartManagerDB.js';
import { usersError } from "../../errores.js";

export class Users {

    constructor(){
        this.modelUser = userModel;
        this.managerCart = CartManagerDB;
    }

    getAll = async () => {
        try {
            let users = await this.modelUser.find().lean().populate('cart');
            return users;   
        } catch (error) {
            return({
                status:"error",
                message:usersError.getAll
            })
        }

    }
    saveUser = async (user) => {
        try {
            const cart = await this.managerCart.saveCart();
            user.cart = cart;
            let result = await this.modelUser.create(user);
            return result;    
        } catch (error) {
            return({
                status:"error",
                message:usersError.saveUser
            })
        }

    }
    getBy = async (params) => {
        try {
            let result = await this.modelUser.findOne(params).populate('cart');
            return result;    
        } catch (error) {
            return({
                status:"error",
                message:usersError.getBy
            })
        }

    }
    updateUser = async (id,user) => {
        try {
            delete user._id;
            let result = await this.modelUser.updateOne({_id:id},{$set:user})
            return result
        } catch (error) {
            return({
                status:"error",
                message:usersError.saveProduct
            })
        }
    }
}