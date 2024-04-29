import fs from "fs";
import path from "path";
import __dirname from "../utils.js";

class ProductManagerFile {
    constructor(pathFile){
        this.path = path.join(__dirname,`/files/${pathFile}`);
    }
    getProducts = async () => {
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path,'utf-8');
            const products = JSON.parse(data);
            return products;
        }else{
            return [];
        }
    }
    createProduct = async (product) => {
        const products = await this.getProducts();
        if(products.length === 0){
            product.id = 1;
        }else{
            product.id = products[products.length-1].id + 1;
        }

        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products,null,'\t'))
        return products
    }
}

export {ProductManagerFile};