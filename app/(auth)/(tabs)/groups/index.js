import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useSession } from '../../../../ctx';

export default function GroupsScreen() {
  const router = useRouter();
  const {session} = useSession()


  // Estado local para armazenar os grupos
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  // Função para buscar grupos do backend
  const fetchGroups = async () => {
    try {
      const res = await axios.get(`https://app.echomeets.online/grupos/user`, {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      setGroups(res.data);
    } catch (error) {
      console.error("Erro ao buscar grupos:", error);
      setError(error.message); // Captura o erro e armazena na variável de erro
    } finally {
      setLoading(false); // Define loading como false ao final da requisição
    }
  };

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

  useEffect(() => {
    fetchGroups();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.groupsContainer}>
        <Text style={styles.sectionTitle}>Meus Grupos</Text>
        {groups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={styles.groupItem}
            onPress={() => router.push(`/group/${group.id}`)}
          >
            <Text style={styles.groupText}>{group.name}</Text>
          </TouchableOpacity>
        ))}
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
