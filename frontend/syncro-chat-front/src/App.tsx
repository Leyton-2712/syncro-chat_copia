// App.tsx
import { useState, useEffect } from "react"
import { Header } from "./components/Header"
import { ToastProvider } from "./components/ToastProvider"
import type { IUser } from "./types/user"
import RoutesConfig from "./routes/Routes"
import { useNavigate } from "react-router-dom"
import type { CredentialResponse } from "@react-oauth/google"

function App() {

  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true); // Cambiar a true para verificar sesión

  // Restaurar sesión al cargar la aplicación
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log("✅ Sesión restaurada desde localStorage");
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  // Función que envía el token de Google al backend
  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    
    if (credentialResponse.credential) {
      const tokenGoogle = credentialResponse.credential;
      console.log("1. Google nos autenticó. Enviando token al backend...");
      
      setLoading(true);
      try {
        // Enviamos el token al backend
        const response = await fetch("http://localhost:3000/api/auth/google/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: tokenGoogle
          })
        });

        if (!response.ok) {
          throw new Error("Error en la autenticación con Google");
        }

        const data = await response.json();
        console.log("2. Backend respondió:", data);

        // Guardamos el token y usuario en localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Actualizamos el estado
        setUser(data.data.user);
        
        console.log("3. Autenticación exitosa, redirigiendo a chat...");
        // Redirigimos a la página de chat
        navigate("/chat");
        
      } catch (error) {
        console.error("Error en login con Google:", error);
        alert("Error al iniciar sesión con Google");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <ToastProvider />
      <Header
        user={user}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        isLoading={loading}
      />
      <main className="pt-16">
        <div className="max-w-7xl w-full mx-auto px-4 lg:px-8">
          <RoutesConfig user={user} isLoading={loading} />
        </div>
      </main>
    </>
  )
}

export default App