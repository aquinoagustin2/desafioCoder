import { connectDB } from "../config/dbConnection.js";
import { CartManagerDB } from "./dbManagers/CartManagerDB.js"; 
import { ProductManagerDB } from "./dbManagers/ProductManagerDB.js";
import { Users } from "./dbManagers/userManager.js";

connectDB();
export const cartsDao = new CartManagerDB();
export const productsDao = new ProductManagerDB();
export const usersDao = new Users(); 