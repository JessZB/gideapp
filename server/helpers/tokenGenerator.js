import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
export const tokenGenerator = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN})
}