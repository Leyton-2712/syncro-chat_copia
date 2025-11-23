// components/Header.tsx
import type { IUser } from "../types/user";
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    user: IUser | null;
    onLoginSuccess: (credentialResponse: CredentialResponse) => void; 
    onLogout: () => void;
    isLoading?: boolean;
}

export function Header({ user, onLoginSuccess, onLogout, isLoading = false }: HeaderProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // marcar logout intencional para que el ChatPage emita el evento "leave_chat"
        try {
            localStorage.setItem('isLoggingOut', '1');
        } catch {
            // si localStorage no está disponible, seguimos de todos modos
        }
        onLogout();
        navigate('/');
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md shadow-xs h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-lg">Syncro Chat</span>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-sm">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium">{user.name}</span>
                            </div>
                            <button
                                className="px-3 py-1 rounded-md border border-red-500 text-red-500 hover:bg-red-50 cursor-pointer transition"
                                onClick={handleLogout}
                            >
                                Salir
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            {!isLoading ? (
                                <GoogleLogin
                                    onSuccess={onLoginSuccess}
                                    onError={() => console.log('Login Failed')}
                                    theme="filled_black"
                                    shape="pill"
                                    text="signin_with"
                                />
                            ) : (
                                <div className="text-sm text-gray-500">Autenticando...</div>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}