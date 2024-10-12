import { useGlobalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';

const markdownContent = `
## Resumo da Reunião do Departamento Financeiro

## Pauta:

### 1. Apresentação dos resultados financeiros do último trimestre
- O departamento apresentou os resultados financeiros...

### 2. Revisão do orçamento para o próximo trimestre
- Foi realizada uma revisão do orçamento...

### 3. Análise de fluxos de caixa
- O fluxo de caixa foi analisado...

### 4. Discussão sobre novos investimentos
- A reunião abordou possíveis novos investimentos...

## Encaminhamentos:
- [Inserir nome] será responsável por...

## Conclusão:
A reunião foi produtiva, e as metas foram definidas.

**Próxima Reunião:** [Inserir data e horário]
`;

export default function SummaryDetails() {
    const { id } = useGlobalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Reunião de planejamento {id}</Text>
      <Text style={styles.textSmall}>Data: 03/08/2024, Sexta-Feira - 10:00h</Text>
      <Text style={styles.textSmall}>Grupo: Financeiro</Text>
      <View>
        <Text style={styles.titleSecundary}>Resumo da reunião</Text>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={true}>

        <Markdown>{markdownContent}</Markdown>
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
  groupsContainer: { 
    flex: 1 
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
  groupItem: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  groupText: { 
    fontSize: 16 
  },
  iconContainer: { 
    flexDirection: 'row' 
  },
  editButton: { 
    marginRight: 10, 
    backgroundColor: '#5E17EB', 
    padding: 5, 
    borderRadius: 5 
  },
  deleteButton: { 
    backgroundColor: '#FF4C4C', 
    padding: 5, 
    borderRadius: 5 
  },
  newGroupButton: {
    backgroundColor: '#5E17EB',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  newGroupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    padding: 8,
    height: '80%',
    backgroundColor: '#E8E6F2',
    borderRadius: 10,
  },
});
