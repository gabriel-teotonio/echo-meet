import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import recordingEvents from '../events/recordEvents'


export default function AudioRecordingScreen() {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState("Clique para gravar");
  const [recordedUri, setRecordedUri] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0); // Estado para o tempo de gravação

  // Função para iniciar a gravação
  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
        setRecordingStatus("Gravando...");
        setIsPaused(false);
        setRecordingTime(0); // Reinicia o tempo
      } else {
        alert("Permissão de gravação negada.");
      }
    } catch (error) {
      console.error("Erro ao iniciar a gravação:", error);
    }
  }

  // Função para pausar a gravação
  async function pauseRecording() {
    if (recording) {
      await recording.pauseAsync();
      setRecordingStatus("Gravação pausada");
      setIsPaused(true);
    }
  }

  // Função para continuar a gravação
  async function resumeRecording() {
    if (recording) {
      await recording.startAsync();
      setRecordingStatus("Gravando...");
      setIsPaused(false);
    }
  }

  // Função para parar a gravação
  async function stopRecording() {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedUri(uri);
      setRecording(null);
      setRecordingStatus("Gravação finalizada.");
      console.log("Gravação salva em:", uri);
    }
  }

  // Função para reproduzir o áudio gravado
  async function playAudio() {
    if (recordedUri) {
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      setSound(sound);
      await sound.playAsync();
    }
  }

  // Função para parar a reprodução do áudio
  async function stopAudio() {
    if (sound) {
      await sound.stopAsync();
      setSound(null);
    }
  }

  // Função para salvar a gravação no AsyncStorage
  const saveRecording = async () => {
    if (recordedUri) {
      try {
        const existingRecordings = await AsyncStorage.getItem("recordings");
        const newRecording = {
          uri: recordedUri,
          date: new Date().toLocaleString(),
          duration: formatTime(recordingTime),
        };

        let updatedRecordings = [];
        if (existingRecordings !== null) {
          updatedRecordings = JSON.parse(existingRecordings);
        }

        updatedRecordings.push(newRecording);
        await AsyncStorage.setItem("recordings", JSON.stringify(updatedRecordings));
        recordingEvents.emit('newRecordingAdded');
        Alert.alert("Sucesso", "Gravação salva com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar a gravação:", error);
        Alert.alert("Erro", "Falha ao salvar a gravação.");
      }
    }
  };

  // Atualiza o tempo de gravação
  useEffect(() => {
    let interval = null;
    if (recording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!recording || isPaused) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [recording, isPaused]);

  // Formata o tempo de gravação no formato mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gravação de Áudio</Text>

      {/* Exibe o tempo de gravação */}
      {recording && <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>}

      {/* Botões para iniciar, pausar e parar a gravação */}
      {!recording && (
        <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
          <FontAwesome name="microphone" size={32} color="white" />
        </TouchableOpacity>
      )}

      {recording && (
        <View style={styles.controlsContainer}>
          {isPaused ? (
            <TouchableOpacity style={styles.controlButton} onPress={resumeRecording}>
              <FontAwesome name="play" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.controlButton} onPress={pauseRecording}>
              <FontAwesome name="pause" size={24} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.controlButton} onPress={stopRecording}>
            <FontAwesome name="stop" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.statusText}>{recordingStatus}</Text>

      {/* Botões para ouvir e parar o áudio gravado */}
      {recordedUri && (
        <View style={styles.playbackContainer}>
          <TouchableOpacity style={styles.playButton} onPress={playAudio}>
            <FontAwesome name="play-circle" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playButton} onPress={stopAudio}>
            <FontAwesome name="stop-circle" size={24} color="white" />
          </TouchableOpacity>
          {/* Botão para salvar o áudio */}
          <TouchableOpacity style={styles.saveButton} onPress={saveRecording}>
            <FontAwesome name="save" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f8f8f8",
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    timerText: {
      fontSize: 20,
      marginBottom: 10,
    },
    recordButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "#3A21B8",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    controlsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      width: 200,
    },
    controlButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "#FFA500",
      justifyContent: "center",
      alignItems: "center",
      margin: 10,
    },
    statusText: {
      fontSize: 16,
      color: "#333",
      marginTop: 10,
    },
    playbackContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      width: 150,
      marginTop: 20,
    },
    playButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "#2196F3",
      justifyContent: "center",
      alignItems: "center",
      margin: 10,
    },
    saveButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#32CD32",
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
      },
  });
