export interface TokenPayload{
    id:number;
    username:string;
    email:string;
}

export interface AuthResponse{
    user:{
        id:number;
        username:string;
        email:string;
    },
    token:string;
}