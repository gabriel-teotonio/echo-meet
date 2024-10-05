import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function GroupsScreen() {
  const router = useRouter();

  // Estado local para armazenar os grupos
  const [groups, setGroups] = useState([
    { id: 1, name: 'Grupo do Financeiro' },
    { id: 2, name: 'Grupo de Tecnologia' },
    { id: 3, name: 'Grupo de Marketing' },
    { id: 4, name: 'Grupo de Recursos Humanos' }
  ]);

  // Função para remover grupo
  const removeGroup = (groupId) => {
    Alert.alert(
      'Confirmar remoção',
      'Tem certeza que deseja remover este grupo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          onPress: () => setGroups((prevGroups) => prevGroups.filter(group => group.id !== groupId)),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  // Função para editar grupo (redireciona para página de edição)
  const editGroup = (groupId) => {
    router.push(`/groups/edit/${groupId}`);
  };

  // Função para adicionar um novo grupo (redireciona para página de criação)
  const createNewGroup = () => {
    router.push('/groups/new'); // Redireciona para a página de criação do grupo
  };

  return (
    <View style={styles.container}>
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
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => editGroup(group.id)}
              >
                <AntDesign name="edit" size={18} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => removeGroup(group.id)}
              >
                <MaterialIcons name="delete" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
        {/* Botão de novo grupo */}
        <TouchableOpacity style={styles.newGroupButton} onPress={createNewGroup}>
          <Text style={styles.newGroupButtonText}>+ Novo Grupo</Text>
        </TouchableOpacity>
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
