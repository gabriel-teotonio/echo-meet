// /app/groups/[id]/participants.js
import { View, Text } from 'react-native';
// import { useSearchParams } from 'expo-router';

export default function Participants() {
//   const { id } = useSearchParams();

  // Exemplo de participantes para cada grupo
  const participantsByGroup = {
    1: ['João Financeiro', 'Maria Economista'],
    2: ['Carlos Desenvolvedor', 'Ana DevOps'],
    3: ['Pedro Marketing', 'Clara Comunicação'],
    4: ['Lucas RH', 'Camila Talentos']
  };

  const participants = participantsByGroup[1] || [];

  return (
    <View>
      {participants.length > 0 ? (
        participants.map((participant, index) => (
          <Text key={index}>{participant}</Text>
        ))
      ) : (
        <Text>Sem participantes cadastrados.</Text>
      )}
    </View>
  );
}
