import fs from "fs";
import path from "path";
import __dirname from "../utils.js";

class CartManagerFile {
    constructor(pathFile){
        this.path = path.join(__dirname,`/files/${pathFile}`);
    }
    getCarts = async () => {
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path,'utf-8');
            const carts = JSON.parse(data);
            return carts;
        }else{
            return [];
        }
    }
    
}

export {CartManagerFile};