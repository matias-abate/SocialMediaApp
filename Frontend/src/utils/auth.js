// src/utils/auth.js
import { useState, useEffect } from "react";

/**
 * decodeJWT: Decodifica el “payload” de un JWT en Base64
 * Nota: esto NO verifica firma ni expira el token; solo extrae el objeto JSON del payload.
 */
function decodeJWT(token) {
  try {
    // Un JWT estándar tiene forma header.payload.signature
    // Partimos por el “payload” (índice 1):
    const base64Payload = token.split('.')[1];
    // Reemplazamos “-” y “_” por los equivalentes para atob()
    const normalized = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    // atob() convierte de Base64 a texto en UTF-8
    const jsonString = atob(normalized);
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Al montar, intentamos leer el token y extraer “sub”
    const token = localStorage.getItem("access_token");
    if (token) {
      const payload = decodeJWT(token);
      if (payload && payload.sub) {
        setUser({ username: payload.sub });
      } else {
        // Token inválido / malformado: lo borramos
        localStorage.removeItem("access_token");
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return { user, logout };
}
