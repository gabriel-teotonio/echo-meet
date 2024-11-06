import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useSession } from '../../../ctx';
import { useLocalSearchParams } from 'expo-router';

export default function Summaries() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { session} = useSession();

  const getSummaries = async () => {
    try {
      const res = await axios.get(`http://45.169.29.120:8000/grupos/${id}/reunioes`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      setReunioes(res.data);
    } catch (error) {
      console.error("Erro ao buscar resumos:", error);
      setError(error.message); // Captura o erro e armazena na variável de erro
    } finally {
      setLoading(false); // Define loading como false ao final da requisição
    }
  };

  useEffect(() => {
    console.log("id:", id);
    getSummaries();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reunioes}
        keyExtractor={(item) => item.id.toString()} // Supondo que cada reunião tenha um ID
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.summaryItem}>
            <Text style={styles.summaryText}>{item.title}</Text> {/* Ajuste o campo conforme necessário */}
          </TouchableOpacity>
        )}
      />
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
});
