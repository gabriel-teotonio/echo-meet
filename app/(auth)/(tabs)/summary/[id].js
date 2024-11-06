import { useGlobalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';


export default function SummaryDetails() {
  const { id } = useGlobalSearchParams();
    console.log("Id da reunião:", id)
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Reunião de planejamento {id}</Text>
      <Text style={styles.textSmall}>Data: 03/08/2024, Sexta-Feira - 10:00h</Text>
      <Text style={styles.textSmall}>Grupo: Financeiro</Text>
      <View>
        <Text style={styles.titleSecundary}>Resumo da reunião</Text>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={true}>
          <Markdown>{}</Markdown>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  sectionTitle: { 
    fontSize: 18, 
    marginBottom: 5
  },
  titleSecundary: { 
    fontSize: 18, 
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 20
  },
  textSmall: { 
    fontSize: 14, 
    color: '#666',
    marginBottom: 10
  },
  scrollContainer: {
    padding: 8,
    height: '80%',
    backgroundColor: '#E8E6F2',
    borderRadius: 10,
  },
});
