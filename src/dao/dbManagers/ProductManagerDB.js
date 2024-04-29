import productsModel from "../models/products.models.js";
import userModel from "../models/Users.model.js";
import { prodsError } from "../../errores.js";
export class ProductManagerDB {
  constructor() {
    this.model = productsModel;
    this.userModel = userModel;
  }

  saveProduct = async (prod) => {
    try {
      let result = await this.model.create(prod);
      return result; 
  }
     catch (error) {
      return error.error
    }
  };

  getAll = async (limit, page, sort, category, availability, query) => {
    try {
      const filter = {};
      if (category) {
        filter.category = category;
      }
      if (availability) {
        filter.stock = { $gt: 0 };
      }

      if (query) {
        filter.$or = [{ title: { $regex: new RegExp(query, "i") } }];
      }

      const options = {
        limit: limit ?? 5,
        page: page ?? 1,
        sort: { price: sort === "asc" ? 1 : -1 },
        lean: true,
      };
      const products = await this.model.paginate(filter, options);
      const queryy = {
        limit,
        page: products.hasPrevPage && products.prevPage,
        sort,
        category,
        availability,
        query,
      };
      Object.keys(queryy).forEach(
        (key) => queryy[key] === undefined && delete queryy[key]
      );
      let prevLink = null;
      let nextLink = null;
      if (products.hasPrevPage) {
        prevLink = `/api/products?${new URLSearchParams(queryy).toString()}`;
      }

      if (products.hasNextPage) {
        queryy.page = products.nextPage;
        nextLink = `/api/products?${new URLSearchParams(queryy).toString()}`;
      }

      products.prevLink = prevLink;
      products.nextLink = nextLink;
      return {
        status: "success",
        msg: products,
      };
    } catch (error) {
      return {
        status: "error",
        message: prodsError.getAll,
      };
    }
  };
  /*
  getBy = async (pid) => {
    try {
      let result = await this.model.findOne(params);
      return result;
    } catch (error) {
      return error
    }
  };
*/

async getBy(params) {
  try {
    let result = await this.model.findOne(params);
    return result;
  } catch (error) {
    return error.error
  }
}


  updateProduct = async (id, prod) => {
    try {
      delete prod._id;
      const product = await this.getBy({ _id: id });
      if (!product) {
        console.log('Error, el producto no exíste')
      }
      if (true) {
        let prodModify = await this.model.updateOne({_id:id},{$set:prod})
        if (!prodModify)
          console.log('No se pudo modificar el producto')
        return product;
      }


    } catch (error) {
      return error.error
    }
  };
  deleteProduct = async (pid) => {
    try {
      const prod = await this.getBy({ _id: pid });
      if (!prod) {
        console.log('El producto no existe')
      const user = await this.userModel.findOne({ _id: pid });
      if (user.rol === "admin") {
        const prodDelete = await prod.deleteOne({ _id: pid });
        if (!prodDelete)
          console.log('El producto no se pudo eliminar')
        return prod;
      }
      if (user._id === prod.owner) {
        const prodDelete = await prod.deleteOne({ _id: pid });
        if (!prodDelete)
          console.log('El producto no se pudo eliminar')
      }
      console.log('Usted no tiene suficientes permisos')
    } 
  } catch (error) {
    
      return error.error
    }
  };
}
