import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useSession } from '../app/ctx';
import { useLocalSearchParams, Link, router } from 'expo-router';

export default function Summaries({ grupoId }) {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reunioes, setReunioes] = useState([]);

  const { session } = useSession();

  const getSummaries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://45.169.29.120:8000/grupos/${id}/reunioes`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      console.log(res.data);
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

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
     {reunioes.map((item) => (
      <TouchableOpacity 
      onPress={() => router.push(`/summary/${item.meeting_id}`)}
      style={styles.summaryItem}>
        <Text style={styles.summaryText}>{item.meeting_name}</Text>
      </TouchableOpacity>
     ))}
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
