import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Link } from 'expo-router';


export default function Summary() {
  return (
    <View style={styles.container}>
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>

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
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Centraliza o texto
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
    backgroundColor: '#BC4EFF',
    color: '#fff',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  detailButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#FFFFFF', // Texto branco no botão de detalhes
    fontWeight: 'bold',
  },
});

