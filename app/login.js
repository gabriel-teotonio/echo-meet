import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSession } from "./ctx";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to handle loading

  const { signIn } = useSession();
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true); // Start loading
    setError(""); // Clear any previous error
    try {
      const success = await signIn(email, password);
      if (success) {
        router.replace("/");
      } else {
        setError("Usuário ou senha incorretos.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Echo Meet</Text>

      <TextInput
        placeholder="Digite seu e-mail"
        placeholderTextColor="#666"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Digite sua senha"
        secureTextEntry
        placeholderTextColor="#666"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]} // Apply disabled style if loading
        onPress={handleLogin}
        disabled={isLoading} // Disable button if loading
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" /> // Show loader if loading
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    color: "#000",
    marginBottom: 50,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    color: "#000",
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 30,
  },
  button: {
    width: "100%",
    backgroundColor: "#5E17EB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#A49BE8", // Lighter color to indicate disabled state
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 20,
  },
});
