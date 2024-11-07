import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Markdown from 'react-native-markdown-display';
import axios from 'axios';
import { useSession } from '../../../ctx';

export default function SummaryDetails() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryContent, setSummaryContent] = useState('');
  const {session} = useSession();

  
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`https://app.echomeets.online/resumo/${16}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`, 
          },
        });
        console.log("Resposta do servidor:",  response.data);
        setSummaryContent(response.data); 
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }


  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{summaryContent.meeting_name}</Text>
      <View>
        <Text style={styles.titleSecundary}>Resumo da reunião</Text>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={true}>
          {/* <Markdown>{summaryContent}</Markdown> */}
        </ScrollView>
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
  sectionTitle: { 
    fontSize: 18, 
    marginBottom: 5
  },
  titleSecundary: { 
    fontSize: 18, 
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 20
  },
  textSmall: { 
    fontSize: 14, 
    color: '#666',
    marginBottom: 10
  },
  scrollContainer: {
    padding: 8,
    height: '80%',
    backgroundColor: '#E8E6F2',
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  }
});
