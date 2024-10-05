// Importações necessárias
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import recordingEvents from '../../../events/recordEvents'; // Importa os eventos de gravação

export default function FilesScreen() {
  const [recordings, setRecordings] = useState([]);
  const [playingSound, setPlayingSound] = useState(null);
  const [playingUri, setPlayingUri] = useState(null);
  const router = useRouter();

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
    if (playingUri === uri) {
      await stopAudio();
    } else {
      const { sound } = await Audio.Sound.createAsync({ uri });
      setPlayingUri(uri);
      setPlayingSound(sound);

      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          setPlayingUri(null);
          setPlayingSound(null);
        }
      });
    }
  };

  // Função para parar o áudio
  const stopAudio = async () => {
    if (playingSound) {
      await playingSound.stopAsync();
      setPlayingUri(null);
      setPlayingSound(null);
    }
  };

  // Função para deletar uma gravação
  const deleteRecording = async (uri) => {
    try {
      const updatedRecordings = recordings.filter(recording => recording.uri !== uri);
      setRecordings(updatedRecordings);
      await AsyncStorage.setItem("recordings", JSON.stringify(updatedRecordings));
      Alert.alert("Sucesso", "Gravação removida com sucesso.");
    } catch (error) {
      console.error("Erro ao deletar gravação:", error);
      Alert.alert("Erro", "Falha ao remover gravação.");
    }
  };

  // UseEffect para buscar gravações e escutar eventos
  useEffect(() => {
    fetchRecordings();
    
    // Listener para novas gravações
    const onNewRecordingAdded = () => {
      fetchRecordings(); // Atualiza a lista de gravações
    };

    recordingEvents.on('newRecordingAdded', onNewRecordingAdded);

    // Limpeza do listener
    return () => {
      recordingEvents.removeListener('newRecordingAdded', onNewRecordingAdded);
    };
  }, []);

  const renderRecording = ({ item }) => (
    <View style={styles.recordingItem}>
      <Text style={styles.recordingText}>
        {item.date} - {item.duration}
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={() => playAudio(item.uri)}
        >
          <FontAwesome name={playingUri === item.uri ? "pause" : "play"} size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRecording(item.uri)}>
          <FontAwesome name="trash" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {recordings.length === 0 ? (
        <Text style={styles.noRecordingsText}>Nenhum áudio gravado encontrado.</Text>
      ) : (
        <FlatList
          data={recordings}
          renderItem={renderRecording}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={() => router.push('recorder')}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F7F7",
  },
  noRecordingsText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    marginTop: 30,
  },
  recordingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  recordingText: {
    fontSize: 18,
    color: "#555",
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  playButton: {
    marginRight: 10,
    backgroundColor: "#5E17EB",
    padding: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#FF4C4C",
    padding: 8,
    borderRadius: 8,
  },
  floatingButton: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#5E17EB",
    justifyContent: "center",
    alignItems: "center",
    bottom: 30,
    right: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
