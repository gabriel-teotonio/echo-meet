import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Modal, Button, ScrollView } from 'react-native';
import axios from 'axios';
import { useSession } from '../app/ctx';
import { useGlobalSearchParams } from 'expo-router';

export default function Summaries({ grupoId }) {
  const { id } = useGlobalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reunioes, setReunioes] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { session } = useSession();

  const getSummaries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://app.echomeets.online/grupos/${id}/reunioes`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      setReunioes(res.data);
    } catch (error) {
      console.error("Erro ao buscar resumos:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSummaries();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const openModal = (summary) => {
    setSelectedSummary(summary);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedSummary(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {reunioes.length > 0 ? reunioes.map((item) => (
        <TouchableOpacity 
          key={item.summary_id}
          onPress={() => openModal(item)}
          style={styles.summaryItem}>
          <Text style={styles.summaryText}>{item.meeting_name}</Text>
        </TouchableOpacity>
      )) : <Text>Nenhum resumo encontrado</Text>}

    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.modalTitle}>{selectedSummary?.meeting_name}</Text>
            <Text>{selectedSummary?.summary_text}</Text>
            <Button title="Fechar" onPress={closeModal} />
          </ScrollView>
        </View>
      </View>
    </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  summaryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  summaryText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
