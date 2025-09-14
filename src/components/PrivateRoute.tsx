// src/components/PrivateRoute.tsx

import { Navigate, useLocation } from "react-router-dom";
import * as jwtDecodeModule from "jwt-decode";

type Props = {
  children: JSX.Element;
};

type DecodedToken = {
  exp: number;
};

const isTokenValid = (token: string | null): boolean => {
  if (!token) {
    console.log("[Auth] No token provided.");
    return false;
  }

  try {
    const decoded: DecodedToken = jwtDecodeModule.jwtDecode(token);
    console.log("[Auth] Decoded token:", decoded);

    const currentTime = Date.now() / 1000;
    console.log("[Auth] Current time (s):", currentTime);
    console.log("[Auth] Token expiry (exp):", decoded.exp);

    return decoded.exp > currentTime;
  } catch (err) {
    console.error("[Auth] Invalid token:", err);
    return false;
  }
};

const PrivateRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");
  console.log("[Auth] Token from localStorage:", token);
  const location = useLocation();

  if (!isTokenValid(token)) {
    console.log("[Auth] Token invalid or missing, redirecting to login.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("[Auth] Token valid, rendering protected content.");
  return children;
};

export default PrivateRoute;
