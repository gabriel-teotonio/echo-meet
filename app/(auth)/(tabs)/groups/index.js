// /app/groups/index.js
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function GroupsScreen() {
  const router = useRouter();

  const groups = [
    { id: 1, name: 'Grupo do Financeiro' },
    { id: 2, name: 'Grupo de Tecnologia' },
    { id: 3, name: 'Grupo de Marketing' },
    { id: 4, name: 'Grupo de Recursos Humanos' }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Echo Meet</Text>
      <View style={styles.groupsContainer}>
        <Text style={styles.sectionTitle}>Meus Grupos</Text>
        {groups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={styles.groupItem}
            onPress={() => router.push(`/groups/${group.id}`)}
          >
            <Text style={styles.groupText}>{group.name}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.editButton}>
                <AntDesign name="edit" size={18} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.infoButton}>
                <MaterialIcons name="delete" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  groupsContainer: { flex: 1 },
  sectionTitle: { fontSize: 18, marginBottom: 10 },
  groupItem: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  groupText: { fontSize: 16 },
  iconContainer: { flexDirection: 'row' },
  editButton: { marginRight: 10, backgroundColor: '#4CAF50', padding: 5, borderRadius: 5 },
  infoButton: { backgroundColor: '#f44336', padding: 5, borderRadius: 5 }
});
