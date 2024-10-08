// /app/groups/[id]/participants.js
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
    <View style={styles.container}>
      {participants.length > 0 ? (
        participants.map((participant, index) => (
          <TouchableOpacity
          key={index}
          style={styles.groupItem}
          // onPress={() => router.push(`/groups/${group.id}`)}
        >
          <Text style={styles.groupText}>{participant}</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity 
              style={styles.editButton}
              // onPress={() => editGroup(group.id)}
            >
              <AntDesign name="edit" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              // onPress={() => removeGroup(group.id)}
            >
              <MaterialIcons name="delete" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        ))
      ) : (
        <Text>Sem participantes cadastrados.</Text>
      )}
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
});
