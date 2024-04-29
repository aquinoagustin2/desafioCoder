import mongoose from "mongoose";
import Users from "../src/dao/Users.dao.js";

import Assert from "assert";
import userModel from "../src/dao/models/User.js";

const MONGO_URL="mongodb+srv://bidabehere:bidabehere@cluster0.a5dcy.mongodb.net/CoderAdopme";

const assert = Assert.strict;

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


    it("El metodo get de la clase Users debe obtener los usuarios en formato de arreglo", async function(){
        const result = await this.usersDao.get();
        assert.strictEqual(Array.isArray(result),true)
    })

    it("El dao debe agregar un usuario correctamente en la base de datos", async function(){

        let mockUser = {
            first_name: "Pepe",
            last_name: "Perez",
            email: "peres@pepe.com",
            password: "1234"
        };

        const result = await this.usersDao.save(mockUser);

        assert.ok(result._id)

    })

    it("Al agregar un nuevo usuario, éste debe crearse con un arreglo de mascotas vacío por defecto", async function(){
        
        let mockUser = {
            first_name: "Pepe",
            last_name: "Perez",
            email: "peres@pepe.com",
            password: "1234"
        };

        const result = await this.usersDao.save(mockUser);

        const userDB = await this.usersDao.getBy({email:result.email});

        assert.strictEqual(userDB.pets.length, 0)


    })
    it("El Dao puede obtener a un usuario por email", async function(){
        
        let mockUser = {
            first_name: "Pepe",
            last_name: "Perez",
            email: "peres@pepe.com",
            password: "1234"
        };

        const result = await this.usersDao.save(mockUser);

        const userDB = await this.usersDao.getBy({email:result.email});

        assert.strictEqual(typeof userDB, 'object')
    })

  /*   it("Descripcion", async function(){

    }) */
})