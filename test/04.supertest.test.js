import chai from "chai";
import supertest from "supertest";
import productsModel from "../src/dao/models/products.models.js";
import cartsModel from "../src/dao/models/cart.models.js";
import {createHash, isValidPassword } from '../src/utils.js';
import { app } from "../src/app.js";
import userModel from "../src/dao/models/Users.model.js";

const expect = chai.expect;
const requester = supertest(app);


describe( "Testing eccommerce", ()=>{

    describe("Test del modulo products", ()=>{
        //beforeEach(async function(){
          //  await productsModel.deleteMany({});
       // })

        it("El endpoint post /api/products crea un nuevo producto correctamente", async function(){
            const productMock = {
                    "title": "Mother",
                    "description": "mother negra",
                    "price": 20430,
                    "thumbnail": "Sin imagen",
                    "code": "mot123",
                    "stock": 101,
                    "category":"UNO DOS TRES"
            }
            const result = await requester.post("/api/products/").send(productMock);
            const { statusCode, _body } = result;
            expect(statusCode).to.be.equal(200);
            expect(_body.status).to.be.equal("success");
        })
        
        it("Si se desea crear un producto sin algunos campos, el módulo debe responder con un status 400.", async function(){
            const productMock = {
                "title": "Mother",
                "description": "mother negra",
                "price": 20430,
                "thumbnail": "Sin imagen",
                "code": "mot123",
                "stock": 101
        }
            const response = await requester.post("/api/products/").send(productMock);
            expect(response.statusCode).to.be.equal(400)
        })

        it("Al obtener a los productos con el método GET, la respuesta debe tener los campos status y products. Además, products debe ser de tipo arreglo.", async function(){
            const response = await requester.get("/api/products/");
            expect(response.statusCode).to.be.equal(200);
            expect(response.body).to.haveOwnProperty("status");
            expect(Array.isArray(response.body.products.docs)).to.deep.equal(true)
            
        })
      
        it("GET BY", async function(){
            const productMock = {
                "title": "Mother",
                "description": "mother negra",
                "price": 20430,
                "thumbnail": "Sin imagen",
                "code": "mot123",
                "stock": 101,
                "category":"UNO DOS TRES"
            }
            const {body} = await requester.post('/api/products').send(productMock)
            const response = await requester.get(`/api/products/${body.productos._id}`);
            expect(response.body.status).to.be.equal("success");
        })  
    
        it("PUT /api/products/:pid most return 200", async function(){
            const productMock = {
                "title": "Mother",
                "description": "mother negra",
                "price": 20430,
                "thumbnail": "Sin imagen",
                "code": "mot123",
                "stock": 101,
                "category":"UNO DOS TRES"
            }
            const {body} = await requester.post('/api/products').send(productMock)
            const response = await requester.put(`/api/products/${body.productos._id}`).send({title:"Firulais"});
            expect(response.body.name).to.not.be.equal(productMock.title);
        })   

        it("DELETE /api/products/:pid most return 200", async function(){
            const productMock = {
                "title": "Mother",
                "description": "mother negra",
                "price": 20430,
                "thumbnail": "Sin imagen",
                "code": "mot123",
                "stock": 101,
                "category":"UNO DOS TRES"
            }
            const {body, statusCode, ok} = await requester.post("/api/products").send(productMock);
            const responseDelete = await requester.delete(`/api/products/${body.productos._id}`)

            const response = await requester.get(`/api/products/${body.productos._id}`)

            expect(response.body.productos).to.be.equal(undefined);

        })
        

    })



    describe("Test del modulo carts", ()=>{
        
     /*   before(async function(){
            await userModel.deleteMany({});
        })*/

        it("El endpoint post /api/carts crea un nuevo carrito correctamente", async function(){
            const cartMock = {}
            const result = await requester.post("/api/carts/").send(cartMock);
            const { statusCode, _body } = result;
            expect(statusCode).to.be.equal(200);
            expect(_body.status).to.be.equal("success");
        })


        it("Al obtener a los carritos con el método GET, la respuesta debe tener los campos status y carts. Además, carts debe ser de tipo arreglo.", async function(){
            const response = await requester.get("/api/carts/");
            expect(response.statusCode).to.be.equal(200);
            expect(response.body).to.haveOwnProperty("status");
            expect(Array.isArray(response.body.carritos)).to.deep.equal(true)
            
        })  

        it("GET BY", async function(){
            const cartMock = {}
            const {body} = await requester.post('/api/carts').send(cartMock)
            const response = await requester.get(`/api/carts/${body.cart._id}`);
            expect(response.body.status).to.be.equal("success");
        })     


        it("PUT /api/carts/:cid most return 200", async function(){
            const cartMock = {
                "title": "Mother",
                "description": "mother negra",
                "price": 20430,
                "thumbnail": "Sin imagen",
                "code": "mot123",
                "stock": 101,
                "category":"UNO DOS TRES"
            }
            const {body} = await requester.post('/api/carts').send(cartMock)
            const response = await requester.put(`/api/carts/${body.cart._id}`).send(cartMock);
            expect(response.body.status).to.be.equal("success");
        })   


        it("DELETE /api/carts/:cid most return 200", async function(){
            const cartMock = {}
            const {body, statusCode, ok} = await requester.post("/api/carts").send(cartMock);
            const responseDelete = await requester.delete(`/api/carts/${body.cart._id}`)

            const response = await requester.get(`/api/carts/${body.cart._id}`)

            expect(response.body.status).to.be.equal("success");

        })
        
       

        it("POST Crear carrito y agregarle un producto /api/carts/:cid/product/pid most return 200", async function(){
            const productMock = {
                "title": "Mother",
                "description": "mother negra",
                "price": 20430,
                "thumbnail": "Sin imagen",
                "code": "mot123",
                "stock": 101,
                "category":"UNO DOS TRES"
        }
            const resultProd = await requester.post('/api/products/').send(productMock)
            const cartMock = {}
            const {body, statusCode, ok} = await requester.post("/api/carts").send(cartMock);
            const responsePost = await requester.post(`/api/carts/${body.cart._id}/product/${resultProd.body.productos._id}`)
            expect(responsePost.status).to.be.equal(200);

        })

        it("DELETE /api/carts/:cid/product/pid most return 200", async function(){
            const productMock = {
                "title": "Mother",
                "description": "mother negra",
                "price": 20430,
                "thumbnail": "Sin imagen",
                "code": "mot123",
                "stock": 101,
                "category":"UNO DOS TRES"
        }
            const resultProd = await requester.post('/api/products/').send(productMock)
            const cartMock = {}
            const {body, statusCode, ok} = await requester.post("/api/carts").send(cartMock);
            const responsePost = await requester.post(`/api/carts/${body.cart._id}/product/${resultProd.body.productos._id}`)
            const responseDelete = await requester.delete(`/api/carts/${body.cart._id}/product/${resultProd.body.productos._id}`)
            const response = await requester.get(`/api/carts/${body.cart._id}/product/${resultProd.body.productos._id}`)

            expect(response.status).to.be.equal(404);

        })

        it("PUT /api/carts/:cid/product/pid most return 200", async function(){
            const productMock = {
                "title": "Mother",
                "description": "mother negra",
                "price": 20430,
                "thumbnail": "Sin imagen",
                "code": "mot123",
                "stock": 101,
                "category":"UNO DOS TRES"
        }
            const resultProd = await requester.post('/api/products/').send(productMock)
            const cartMock = {}
            const {body, statusCode, ok} = await requester.post("/api/carts").send(cartMock);
            const responsePost = await requester.post(`/api/carts/${body.cart._id}/product/${resultProd.body.productos._id}`)
            const responsePut = await requester.put(`/api/carts/${body.cart._id}/product/${resultProd.body.productos._id}`).send({quantity:100})
            expect(responsePut.status).to.be.equal(200);

        })


        describe("Test flujo Usuarios", ()=>{
        
            before(async function(){
                await userModel.deleteMany({});
            })
        
            it("registro de usuario", async function(){
                const mockUser = {
                    first_name:'Pedro',
                    email:'pedro@gmail.com',
                    password:1234,
                    rol:'user'
                };
                const responseSigned = await requester.post("/api/sessions/register").send(mockUser);
                expect(responseSigned.statusCode).to.be.equal(200)
    
            })
            

/*
            
    
            it("Debe loguear al usuario y devolver una cookie", async function () {
                const mockUserLogin = {
                    email:"pedro@gmail.com",
                    password:"1234"
                };
                const responseLogin = await requester.post("/api/sessions/login").send(mockUserLogin);
                const cookiResponse = responseLogin.headers["set-cookie"][0];
                const cookieData = {
                    name: cookiResponse.split("=")[0],
                    value: cookiResponse.split("=")[1]
                }
                this.cookie = cookieData;
                expect(this.cookie.name).to.be.equal("coderCookie");
            })
            */
    /*
            it("Al llamar /current obtenemos la cookie y la informacion del usuario", async function () {
                const currentResponse = await requester.get("/api/sessions/current").set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);
                expect(currentResponse.body.payload.email).to.be.equal("pedro@gmail.com")
            })
            */
    /*
            it("Que el endpoint de unprotectedLogin devuelva una cookie de nombre unprotectedCookie.", async function (){
                const credentialMock2 = {
                    email: "pedro@gmail.com",
                    password:"1234"
                }
                const response = await requester.get("/api/sessions/unprotectedLogin").send(credentialMock2);
                const cookiesResult = response.headers['set-cookie'][0];
                //expect(cookiesResult).to.be.ok;
    
                this.cookie ={
                   name: cookiesResult.split('=')[0],
                   value: cookiesResult.split('=')[1]
                }

    
                expect(this.cookie.value).to.be.ok;
                expect(this.cookie.name).to.be.equal('unprotectedCookie')
            })
    */
   /*
            it("Que el endpoint unprotectedCurrent devuelva al usuario completo.", async function (){
                //const response = await requester.get("/api/sessions/unprotectedCurrent").set('Cookie',[`${this.cookie.name}=${this.cookie.value}`])
                //expect(response.body.payload.email).to.be.equal("pedro@gmail.com")
                
                const { _body: { payload } } = await requester.get("/api/sessions/unprotectedCurrent").set('Cookie',[`${this.cookie.name}=${this.cookie.value}`])
                expect(payload.email).to.be.equal("pedro@gmail.com")
                
            })
     */       
    
        })
    




    })







})