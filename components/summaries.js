import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Button, ScrollView } from 'react-native';
import axios from 'axios';
import { useGlobalSearchParams } from 'expo-router';
import {Picker} from '@react-native-picker/picker'
import { useSession } from '../ctx';

export default function Summaries({ grupoId }) {
  const { id } = useGlobalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reunioes, setReunioes] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValueType, setSelectedValueType] = useState("numeric");
  const [dashboardHtml, setDashboardHtml] = useState(null);
  const { session } = useSession();

  const getSummaries = async () => {
    try {
      setLoading(true);
      if(id){
        const res = await axios.get(`https://app.echomeets.online/grupos/${id}/reunioes`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        setReunioes(res.data);
      }
    } catch (error) {
      console.error("Erro ao buscar resumos de reunão:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSummaries();
    if (selectedSummary && selectedValueType) {
      fetchDashboard();
  }
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

  const fetchDashboard = async () => {
    if (selectedSummary) {
        setLoading(true);
        try {
            const response = await axios.get(`https://app.echomeets.online/generate-dashboard/${selectedSummary.summary_id}/${selectedValueType}`);
            setDashboardHtml(response.data);
            setError(null);
        } catch (error) {
            console.error("Erro ao buscar o dashboard:", error);
            setError("Dashboard não encontrado ou dados insuficientes.");
            setDashboardHtml(null);
        } finally {
            setLoading(false);
        }
    }
};


  return (
    <View style={styles.container}>
    <ScrollView style={styles.scrollContainer}>

      {reunioes.length > 0 ? reunioes.map((item) => (
        <TouchableOpacity 
        key={item.summary_id}
        onPress={() => openModal(item)}
        style={styles.summaryItem}>
          <Text style={styles.summaryText}>{item.meeting_name}</Text>
        </TouchableOpacity>
      )) : <Text>Nenhum resumo encontrado</Text>}
    </ScrollView>

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
            <Text style={styles.label}>Escolha o tipo de valor:</Text>

            <Picker 
                selectedValue={selectedValueType}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedValueType(itemValue)}
            >
                <Picker.Item label="Numérico" value="numeric" />
                <Picker.Item label="Percentual" value="percent" />
            </Picker>
            {dashboardHtml ? (
                <WebView
                    originWhitelist={['*']}
                    source={{ html: dashboardHtml }}
                    style={styles.webview}
                />
            ) : (
                !loading && <Text>Selecione uma reunião e tipo de valor para visualizar o dashboard.</Text>
            )}
            {error && <Text style={styles.errorText}>{error}</Text>} 
            <View style={styles.buttonsContainer}>
            <Button style={styles.dashgenButton} title="Gerar Dashboard" onPress={fetchDashboard} />
            <Button style={styles.closeButton} title="Fechar" onPress={closeModal} />
            </View>
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
  errorText: {
    color: 'red',
  },
  summaryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonsContainer:{
    gap: 8,
    marginTop: 16
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
  closeButton: {
    marginVertical: 22
  },
  dashgenButton: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginVertical: 22
  },
  picker: {
    width: '100%',
    marginBottom: 10,
  },
  webview: {
    width: '100%',
    height: '100%',
  },
});
