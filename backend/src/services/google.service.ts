import prisma from "../db/prisma";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../interfaces/auth.interface";
import dotenv from "dotenv";
import { jwtDecode } from "jwt-decode";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "holaMundo2025";

export const googleLogin = async (accessToken: string, refreshToken: string, profile: any) => {
    try {
        const email = profile.emails[0].value;
        const username = profile.displayName;
        //buscamos al usuario por el email ya que es unico para cada usuario
        let user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        
        // Verifico si el usuario no existe
        if (!user) {
            user = await prisma.user.create({
                data: {
                    username: username,
                    email: email,
                    password: null  // usuarios de google no tienen contraseña
                }
            });
            console.log("Usuario creado con Google:", user.email);
        } else {
            console.log("Usuario existente inició sesión con Google:", user.email);
        }
        
        return user;
    } catch (error) {
        console.log(`Error en googleLogin: ${error}`);
        throw new Error("Error al autenticar con Google");
    }
};

// Nueva función para login desde el frontend (recibe el token de Google directamente)
export const googleLoginFromToken = async (googleToken: string) => {
    try {
        // Decodificar el token de Google (sin verificar firma, ya que confiamos en Google)
        const decoded: any = jwtDecode(googleToken);
        
        const email = decoded.email;
        const username = decoded.name;
        
        // Buscar o crear el usuario en la BD
        let user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        
        if (!user) {
            user = await prisma.user.create({
                data: {
                    username: username,
                    email: email,
                    password: null  // usuarios de google no tienen contraseña
                }
            });
            console.log("Usuario creado con Google (desde frontend):", user.email);
            
            // Crear o asignar el usuario al chat general (ID 1)
            // Primero verificar si el chat existe
            const defaultChat = await prisma.chat.findUnique({
                where: { id: 1 }
            });
            
            if (defaultChat) {
                // Agregar el usuario como participante del chat general
                await prisma.chatParticipant.create({
                    data: {
                        userId: user.id,
                        chatId: 1
                    }
                }).catch((err) => {
                    // Ignorar error si ya existe la relación
                    console.log("El usuario ya está en el chat general o error:", err.message);
                });
            }
        } else {
            console.log("Usuario existente inició sesión con Google (desde frontend):", user.email);
        }
        
        // Generar token JWT de la aplicación
        return generarTokenGoogle(user);
    } catch (error) {
        console.log(`Error en googleLoginFromToken: ${error}`);
        throw new Error("Error al autenticar con Google");
    }
};

// generamos el token JWT despues de autenticacion con Google
export const generarTokenGoogle = (user: any) => {
    const payload: TokenPayload = {
        id: user.id,
        username: user.username,
        email: user.email
    };
    
    const token = jwt.sign(payload, jwtSecret, {
        expiresIn: "1h"
    });
    
    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        },
        token: token
    };
};
