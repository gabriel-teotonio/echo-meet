import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useSession } from '../../../ctx';

export default function Summaries({ groupId }) {
  const router = useRouter();
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { session } = useSession();

  console.log("Sessão reu:",session)
  console.log("ID:", groupId)

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const response = await axios.get(`https://app.echomeets.online/grupos/${id}/reunioes`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`, 
          },
        });
        console.log(response.data)
        setSummaries(response.data); 
      } catch (err) {
        setError(err.message || 'Erro ao carregar resumos');
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [groupId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {summaries.map((summary, index) => (
          <View key={index} style={styles.meetingContainer}>
            <Text style={styles.meetingTitle}>{summary.title}</Text>
            <Text style={styles.meetingDate}>{summary.date}</Text>
            <View style={styles.tagContainer}>
              {summary.tags.map((tag, tagIndex) => (
                <Text key={tagIndex} style={styles.tag}>{tag}</Text>
              ))}
            </View>
            <TouchableOpacity 
              onPress={() => router.push(`/summary/${summary.id}`)} 
              style={styles.detailButton}>
              <Text style={styles.detailButtonText}>Ver Detalhes</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  meetingContainer: {
    backgroundColor: '#5B2B90',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  meetingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  meetingDate: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 15,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tag: {
    backgroundColor: '#BC4EFF',
    color: '#fff',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  detailButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
});
