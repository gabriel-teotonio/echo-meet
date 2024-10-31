import React from "react";
import { useStorageState } from "../hooks/useStorageState";
import axios from "axios";

const AuthContext = React.createContext({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// Hook para acessar informações do usuário
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props) {
  const [[isLoading, session], setSession] = useStorageState("session");

  const signIn = async (email, password) => {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      console.log("FormData como string:", formData.toString());

  try {
    const response = await axios.post("http://45.169.29.120:8000/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("Resposta da API:", response.data);
    const token = response.data.access_token;

    // Define o token como sessão
    setSession(token);
  } catch (error) {
    console.error("Erro ao fazer login:", error);
  }
  };

  const signOut = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
