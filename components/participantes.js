// /app/groups/[id]/participants.js
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSession } from '../ctx';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Participants({grupoId}) {
  const [emails, setEmails] = useState([]);

  const { id } = useLocalSearchParams();
  const { session } = useSession();

  const getEmails = async () => {
    try {
        const res = await axios.get(`https://app.echomeets.online/grupos/${id}/emails`, {
            headers: { Authorization: `Bearer ${session?.access_token}` },
        });
        setEmails(res.data);
    } catch (error) {
        console.error("Erro ao buscar emails:", error);
    }
};

  useEffect(() => {
      getEmails();
  }, []);

  return (
    <View style={styles.container}>
      {emails.length > 0 ? (
        emails.map((email, index) => (
          <TouchableOpacity
          key={index}
          style={styles.groupItem}
          // onPress={() => router.push(`/groups/${group.id}`)}
        >
          <Text style={styles.groupText}>{email.email}</Text>
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
