import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { useSession } from "./ctx";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useSession();
  const router = useRouter();

  const handleLogin = () => {
    signIn(email, password);
    router.replace("/");
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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotText: {
    color: "#000",
    fontSize: 14,
  },
  registerText: {
    color: "#5E17EB",
    fontSize: 16,
  },
});