import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from "react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Files = () => {
  const [recordings, setRecordings] = useState([]);
  const [playingUri, setPlayingUri] = useState(null);
  const [playingSound, setPlayingSound] = useState(null); // Para armazenar o objeto sound
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchRecordings = async () => {
    try {
      const storedRecordings = await AsyncStorage.getItem("recordings");
      if (storedRecordings !== null) {
        const recordingsList = JSON.parse(storedRecordings);
        setRecordings(recordingsList);
      } else {
        setRecordings([]);
      }
    } catch (error) {
      console.error("Erro ao buscar gravações:", error);
      Alert.alert("Erro", "Falha ao buscar gravações.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecordings(); // Busca gravações quando o componente é montado
    return () => {
      // Limpa o som quando o componente é desmontado
      if (playingSound) {
        playingSound.unloadAsync();
      }
    };
  }, [recordings]);

  const playAudio = async (uri) => {
    if (playingUri === uri) {
      // Se já está tocando o mesmo áudio, pausa
      if (playingSound) {
        await playingSound.pauseAsync();
        setPlayingSound(null); // Reseta o estado do som tocando
      }
      setPlayingUri(null);
    } else {
      // Para pausar o áudio anterior, se existir
      if (playingSound) {
        await playingSound.stopAsync();
        await playingSound.unloadAsync(); // Limpa o som anterior
      }

      // Cria um novo som e inicia
      const { sound } = await Audio.Sound.createAsync({ uri });
      setPlayingSound(sound);
      setPlayingUri(uri);
      await sound.playAsync();
    }
  };

  const deleteRecording = async (uri) => {
    try {
      const newRecordings = recordings.filter((recording) => recording.uri !== uri);
      await AsyncStorage.setItem("recordings", JSON.stringify(newRecordings));
      setRecordings(newRecordings);
      Alert.alert("Sucesso", "Gravação excluída com sucesso.");
    } catch (error) {
      console.error("Erro ao deletar gravação:", error);
      Alert.alert("Erro", "Falha ao deletar gravação.");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecordings(); // Chama a função para buscar gravações ao atualizar
  };

  const renderRecording = ({ item }) => {
    return (
      <View style={styles.recordingItem}>
        <View style={styles.containText}>
        <Text style={styles.recordItemTitle}>
          {item.name}
        </Text>
        <Text style={styles.recordingText}>
          {item.date}
        </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.generateButton}>
            <MaterialIcons name="generating-tokens" size={20} color="white" />
          </TouchableOpacity>
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
  };

  return (
    <View style={styles.container}>
      {recordings.length === 0 ? (
        <Text style={styles.noRecordingsText}>Nenhum áudio gravado encontrado.</Text>
      ) : (
        <FlatList
          data={recordings}
          renderItem={renderRecording}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={() => router.push('recorder')}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  containText:{
    
  },
  recordItemTitle:{
    fontSize: 18,
    fontWeight: "semibold",
    marginBottom: 3,
  },
  noRecordingsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  recordingItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recordingText: {
    fontSize: 14,
    color: "#333",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  playButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
  },
  generateButton: {
    backgroundColor: "#3A21B8",
    padding: 10,
    borderRadius: 5,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#5E17EB",
    borderRadius: 50,
    padding: 15,
  },
});

export default Files;
