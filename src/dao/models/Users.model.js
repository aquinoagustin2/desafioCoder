import mongoose from "mongoose";

 const collection = 'Users';

 const schema = new mongoose.Schema({
    first_name: String,
    last_name:String,
    email:String,
    age:Number,
    password:String,
    last_connection: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'cart' }, 
    documents: [
      {
        name: String,
        reference: String
      }
    ],
    rol:{
      type:String,
      enum:["user","admin","premium"],
      default:"user"
    },
    documents:{
      type:[
        {
          name:{
            type: String
          },
          ref:{
            type: String,
          }
        }
      ]
    },
    
 })

 const userModel = mongoose.model(collection,schema);

 export default userModel;