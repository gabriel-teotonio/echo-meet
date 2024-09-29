import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useSession } from "../../ctx";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons"; // Importando ícones

export default function TabOneScreen() {
  const { signOut, session } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado para gerenciar o tema

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // Alterna o tema
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Echo Meet</Text> */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.roundedButton}>
          <Text style={styles.buttonText}>Criar Novo Grupo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.roundedButton}>
          <Text style={styles.buttonText}>Gerar Resumo de Reunião</Text>
        </TouchableOpacity>

        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} style={styles.meetingContainer}>
            <Text style={styles.meetingTitle}>Reunião de Planejamento do sistema</Text>
            <Text style={styles.meetingDate}>03/08/2024, Segunda-Feira - 10:00</Text>
            <View style={styles.tagContainer}>
              <Text style={styles.tag}>Mobile</Text>
              <Text style={styles.tag}>Programação</Text>
            </View>
            <TouchableOpacity style={styles.detailButton}>
              <Text style={styles.detailButtonText}>Ver Detalhes</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Botão para alternar tema com ícones dentro do ScrollView */}
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          {isDarkMode ? (
            <Ionicons name="sunny" size={24} color="#fff" />
          ) : (
            <Ionicons name="moon" size={24} color="#000" />
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#000', // Cor de fundo no modo escuro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  darkTitle: {
    color: '#fff', // Cor do título no modo escuro
  },
  scrollContainer: {
    flex: 1,
  },
  roundedButton: {
    backgroundColor: "#5E17EB", // Botão roxo
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  meetingContainer: {
    backgroundColor: '#5B2B90', // Fundo roxo do compartimento
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  meetingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // Texto branco
    marginBottom: 10,
  },
  meetingDate: {
    fontSize: 14,
    color: '#fff', // Texto branco
    marginBottom: 15,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tag: {
    backgroundColor: '#BC4EFF', // Cor do tag de Mobile/Programação
    color: '#fff',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  detailButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF', // Borda branca para o botão de detalhes
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#FFFFFF', // Texto branco no botão de detalhes
    fontWeight: 'bold',
  },
  themeButton: {
    marginVertical: 20, // Espaço acima e abaixo do botão
    alignSelf: 'center', // Centraliza o botão horizontalmente
    backgroundColor: 'transparent', // Fundo transparente
    padding: 10,
  },
});
