import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { useSession } from "./ctx";
import { router } from "expo-router";

export default function Login() {
  const { signIn } = useSession();
  const handleLogin = () => {
    // Adicione sua lógica de login aqui
    signIn();
    // Antes de navegar, tenha certeza de que o usuário está autenticado
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Echo Meet</Text>

      <TextInput placeholder="Digite seu e-mail" placeholderTextColor="#666" style={styles.input} />
      <TextInput
        placeholder="Digite sua senha"
        secureTextEntry
        placeholderTextColor="#666"
        style={styles.input}
      />

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotText}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.registerText}>Registre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Fundo branco
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    color: "#000", // Título preto
    marginBottom: 50,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    color: "#000", // Texto dos inputs preto
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 30,
  },
  button: {
    width: "100%",
    backgroundColor: "#5E17EB", // Botão roxo
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff", // Texto do botão branco
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotText: {
    color: "#000", // Texto de "Esqueceu a senha?" preto
    fontSize: 14,
  },
  registerText: {
    color: "#5E17EB", // Texto do link de registro roxo
    fontSize: 16,
  },
});
