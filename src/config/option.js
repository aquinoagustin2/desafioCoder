import dotenv from "dotenv";

dotenv.config();

export const options = {
    server:{
        secretSession:process.env.SECRET_SESSION,
        PORT: process.env.PORT
    },
    gmail:{
        emailToken:process.env.SECRET_TOKEN_EMAIL,
        emailAdmin:process.env.ADMIN_EMAIL,
        emailPass:process.env.ADMIN_PASS
    },
    mongo:{
        url:process.env.MONGO_URL
    }
}
