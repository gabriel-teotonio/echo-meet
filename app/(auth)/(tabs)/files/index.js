import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import recordingEvents from '../../../events/recordEvents';

export default function FilesScreen() {
  const [recordings, setRecordings] = useState([]);
  const [sound, setSound] = useState(null);
  const router = useRouter()

  // Função para buscar as gravações do AsyncStorage
  const fetchRecordings = async () => {
    try {
      const storedRecordings = await AsyncStorage.getItem("recordings");
      if (storedRecordings !== null) {
        setRecordings(JSON.parse(storedRecordings));
      }
    } catch (error) {
      console.error("Erro ao buscar gravações:", error);
      Alert.alert("Erro", "Falha ao buscar gravações.");
    }
  };

  // Função para tocar o áudio
  const playAudio = async (uri) => {
    if (sound) {
      await sound.unloadAsync(); // Descarregar o som anterior se já estiver tocando
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);
    await newSound.playAsync();
  };

  // Função para parar o áudio
  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setSound(null);
    }
  };

  // Busca as gravações ao carregar a tela
  useEffect(() => {
    fetchRecordings();

    // identifica quando novo audio foi salvo
    recordingEvents.on('newRecordingAdded', fetchRecordings);
    return () => {
      recordingEvents.removeListener('newRecordingAdded', fetchRecordings);
    };
  }, []);

  // Renderiza cada gravação
  const renderRecording = ({ item }) => (
    <View style={styles.recordingItem}>
      <Text style={styles.recordingText}>
        {item.date} - {item.duration}
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.playButton} onPress={() => playAudio(item.uri)}>
          <FontAwesome name="play" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.stopButton} onPress={stopAudio}>
          <FontAwesome name="stop" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Arquivos Gravados</Text>
      {recordings.length === 0 ? (
        <Text style={styles.noRecordingsText}>Nenhum áudio gravado encontrado.</Text>
      ) : (
        <FlatList
          data={recordings}
          renderItem={renderRecording}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      {/* botão flutuante */}
      <TouchableOpacity style={styles.floatingButton} 
      onPress={() => (router.push('recorder'))}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  noRecordingsText: {
    fontSize: 16,
    color: "gray",
  },
  recordingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  recordingText: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  playButton: {
    marginRight: 10,
    backgroundColor: "#32CD32",
    padding: 10,
    borderRadius: 5,
  },
  stopButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
  },
  floatingButton: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    bottom: 20, // Distância do fundo da tela
    right: 20,  // Distância do lado direito da tela
    elevation: 8, // Para adicionar uma sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
