import { IsEmail, IsString, MinLength,IsNotEmpty} from "class-validator";

export class RegistroDto{
    @IsString()
    @IsNotEmpty()
    @MinLength(3,{message:"el username debe tener al menos 3 caracteres"})
    username!: string;

    @IsEmail({},{message:"El email es invalido"})
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8,{message:"La contraseña debe tener almenos 8 caracteres"})
    password!: string;
}

export class LoginDto{
    @IsEmail({},{message:"El email es invalido"})
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8,{message:"La contraseña debe tener almenos 8 caracteres"})
    password!: string;
}