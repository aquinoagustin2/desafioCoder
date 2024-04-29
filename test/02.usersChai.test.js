import mongoose from "mongoose";
import Users from "../src/dao/Users.dao.js";
import userModel from "../src/dao/models/User.js";

import chai from "chai";

const MONGO_URL="mongodb+srv://bidabehere:bidabehere@cluster0.a5dcy.mongodb.net/CoderAdopme";

const expect = chai.expect;


//Generar el contexto describe
describe("Testing para la clase Users Dao", ()=>{

    before( async function(){
        await mongoose.connect(MONGO_URL);
        this.usersDao = new Users();
    })

    beforeEach( async function(){
        await userModel.deleteMany();
        this.timeout(5000);
    })

    after(async function(){
        await mongoose.connection.close();
    })

    it("El metodo get de la clase Users debe obtener los usuarios en formato de arreglo", async function(){

        const result = await this.usersDao.get();

        expect(result).to.be.deep.equal([]);

    })

    it("El dao debe agregar un usuario correctamente en la base de datos", async function(){

        let mockUser = {
            first_name:"pepe",
            last_name:"perez",
            email:"pepe@gmail.com",
            password:"1234"
        };

        const result = await this.usersDao.save(mockUser);

        expect(result).to.have.property("_id");

    })

    it("Al agregar un nuevo usuario, éste debe crearse con un arreglo de mascotas vacío por defecto", async function(){
        let mockUser = {
            first_name:"pepe",
            last_name:"perez",
            email:"pepe@gmail.com",
            password:"1234"
        };
        const result = await this.usersDao.save(mockUser);
        const userDB = await this.usersDao.getBy({email:result.email});
        expect(userDB.pets).to.be.deep.equal([]);
    })
    it("el dao puede actualizar un usuario por id", async function(){
        let mockUser = {
            first_name:"pepe",
            last_name:"perez",
            email:"pepe@gmail.com",
            password:"1234"
        };
        const result = await this.usersDao.save(mockUser);
        const userDB = await this.usersDao.getBy({email:result.email});
        userDB.first_name = "Pepe Modificado";
        const userUpdate = await this.usersDao.update(userDB._id,userDB);
        expect(userUpdate.first_name).to.be.equal("Pepe Modificado");
    })

  /*   it("Descripcion", async function(){

    }) */
})