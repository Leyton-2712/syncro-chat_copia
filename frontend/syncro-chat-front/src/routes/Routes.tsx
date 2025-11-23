import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { ChatPage } from "../pages/ChatPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import type { IUser } from "../types/user";

interface RoutesConfigProps {
  user: IUser | null;
  isLoading?: boolean;
}

export function RoutesConfig({ user, isLoading = false }: RoutesConfigProps) {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route 
        path="/chat" 
        element={<ProtectedRoute element={<ChatPage />} user={user} isLoading={isLoading} />} 
      />
    </Routes>
  );
}

export default RoutesConfig;
