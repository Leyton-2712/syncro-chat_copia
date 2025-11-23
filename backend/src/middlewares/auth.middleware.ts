import jwt from "jsonwebtoken";
import {Request,Response,NextFunction} from "express";
import { TokenPayload } from "../interfaces/auth.interface";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "holaMundo2025";

// extender el tipo User de Express para incluir tokenpayload 
declare global {
    namespace Express {
        interface User extends TokenPayload {}
    }
}

export const authMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"token no encontrado",
            status:401,
            error:"No autorizado"
        });
    }
    try {
        const payload = jwt.verify(token,jwtSecret) as TokenPayload;
        req.user = payload;
        next();
    } catch (error) {
        console.log("error en auth middleware:", error);
        return res.status(401).json({
            message:"token invalido",
            status:401,
            error:"Autenticación fallida"
        });
    }
}

