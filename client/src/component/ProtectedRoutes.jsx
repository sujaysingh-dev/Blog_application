// components/ProtectedRoute.jsx
import { useUser } from "../context/UserContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
