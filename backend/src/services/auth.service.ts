import { AuthResponse, TokenPayload } from "../interfaces/auth.interface";
import { RegistroDto, LoginDto } from "../dtos/auth.dto";
import prisma from "../db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "holaMundo2025";

export const registro = async(dto:RegistroDto)=>{
    try {
        // primero buscamos si el usuario existe ya que los campos username y email son unicos
        const userExistente = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: dto.username },
                    { email: dto.email }
                ]
            }
        });

        if (userExistente) {
            return {
                message: "El usuario ya existe",
                status: 400
            };
        }

        const { username, password, email } = dto;

        // generamos el hash de la contraseña
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // creamos el usuario
        const user = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword
            },
            select: {
                id: true,
                username: true,
                email: true
            }//aqui decido que datos mostrar y ovio no mostramos la contraseña
        });

        return {
            message: "Usuario registrado exitosamente",
            status: 201,
            data: user
        };

    } catch (error) {
        console.log(`error en registro: ${error}`);
        return {
            message: "error al registrar el usuario",
            status: 500
        };
    }
}

export const login = async(dto:LoginDto)  =>{
    const user= await prisma.user.findUnique({
        where:{
            email:dto.email
        }
    })

    if(!user){
        return {
            message: "el usuario no existe",
            status: 404
        };
    }

    const isPasswordValid = await bcrypt.compare(dto.password, String(user.password)); 
    if(!isPasswordValid){
        return {
            message: "contraseña invalida",
            status: 401
        };
    }

    const payload: TokenPayload = {
        id:user.id,
        username:user.username,
        email:user.email
    }

    const token = jwt.sign(payload,jwtSecret,{
        expiresIn:"1h"
    })
    

    return{
        user:{
            id:user.id,
            username:user.username,
            email:user.email
        },
        token: token
    }
}