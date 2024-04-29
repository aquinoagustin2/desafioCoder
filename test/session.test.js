/* eslint-disable no-undef */
import chai from "chai";
import supertest from "supertest";

import userModel from "../src/Dao/models/user.js";
import cartModel from "../src/Dao/models/cart.js";

import { app } from "../src/app.js";
import { createHash } from "../src/utils.js";

const expect = chai.expect;
const requester = supertest(app);

describe("Testing Sessions routes", () => {
  const passwordd = "123456";
  let userPremium;
  let newCart;
  let responseLogin;
  let sessionCookie;
  before(async function () {
    this.timeout(10000);
    try {
      //Creo un usuario para realizar las pruebas de los endpoint
      newCart = await cartModel.create({});
      userPremium = await userModel.create({
        email: "userTest2@userTest.com",
        first_name: "Test",
        last_nam: "SuperTest",
        password: createHash(passwordd),
        cart: newCart._id,
        role: "premium",
      });

      responseLogin = await requester
        .post("/api/session/login")
        .send({ email: userPremium.email, password: passwordd });
      sessionCookie = responseLogin.header["set-cookie"];
    } catch (error) {
      console.log(error);
    }
  });
  it("Registro de usuario exitoso", async function () {
    try {
      const newUser = {
        email: "nuevoUsuario@ejemplo.com",
        first_name: "Nuevo",
        last_name: "Usuario",
        password: "contraseña123",
        // Agrega otros campos necesarios para el registro
      };

      const response = await requester
        .post("/api/session/register")
        .send(newUser);

      expect(response.status).to.be.equal(401);
      // Verifica aquí el cuerpo de la respuesta si es necesario
    } catch (error) {
      console.log(error);
    }
  });

  it("Registro de usuario que ya existe en la base de datos", async function () {
    try {
      const existingUser = {
        email: userPremium.email,
        first_name: "Nombre",
        last_name: "Apellido",
        password: "nuevaContraseña",
      };

      const response = await requester
        .post("/api/session/register")
        .send(existingUser);

      expect(response.status).to.be.equal(401);
      // Verifica aquí el cuerpo de la respuesta si es necesario
    } catch (error) {
      console.log(error);
    }
  });

  it("Pruebo el login de manera correcta", async function () {
    try {
      const response = await requester
        .post("/api/session/login")
        .send({ email: userPremium.email, password: passwordd });
      expect(response.status).to.be.equal(200);
    } catch (error) {
      console.log(error);
    }
  });
  it("Intento acceder a la ruta current estando logueado", async function () {
    try {
      const response = await requester
        .get("/api/session/current")
        .set("Cookie", sessionCookie);
      expect(response.status).to.be.equal(200);
    } catch (error) {
      console.log(error);
    }
  });

  it("Intento de inicio de sesión con credenciales incorrectas", async function () {
    try {
      const response = await requester
        .post("/api/session/login")
        .send({ email: userPremium.email, password: "contraseñaIncorrecta" })
        .redirects(1);
      expect(response.status).to.be.equal(404);
    } catch (error) {
      console.log(error);
    }
  });
  it("Cerrar sesión después de haber iniciado sesión", async function () {
    try {
      const response = await requester
        .post("/api/session/logout")
        .set("Cookie", sessionCookie)
        .redirects(1); // Esta línea sigue una redirección (máximo 1 redirección)

      expect(response.status).to.be.equal(404);
      // Aquí puedes agregar expectativas adicionales según lo que devuelva tu front-end
    } catch (error) {
      console.log(error);
    }
  });

  it("Obtener información de un usuario logueado", async function () {
    try {
      const response = await requester
        .get("/api/session/current")
        .set("Cookie", sessionCookie);
      expect(response.status).to.be.equal(200);
      expect(response.body.payload.email).to.be.equal(userPremium.email);
    } catch (error) {
      console.log(error);
    }
  });

  it("Intento de obtener información de usuario sin haber iniciado sesión", async function () {
    try {
      const response = await requester.get("/api/session/current");
      expect(response.status).to.be.equal(401);
    } catch (error) {
      console.log(error);
    }
  });

  it("Intento acceder a la ruta current sin estar logueado", async function () {
    try {
      const response = await requester.get("/api/session/current");
      expect(response.status).to.be.equal(401);
    } catch (error) {
      console.log(error);
    }
  });

  //Borro los datos creados en la bd
  after(async function () {
    try {
      await userModel.findOneAndRemove({ email: userPremium.email });
      await cartModel.findByIdAndDelete(newCart._id);
      process.exit();
    } catch (error) {
      console.log(error);
    }
  });
});
