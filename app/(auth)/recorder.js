// app/(auth)/recorder.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Svg, Polyline } from "react-native-svg"; // Importando Polyline para o visualizador

export default function AudioRecordingScreen() {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState("Clique para gravar");
  const [recordedUri, setRecordedUri] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevels, setAudioLevels] = useState([]); // Para armazenar os níveis de áudio

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
        setRecordingTime(0);
        setAudioLevels([]); // Limpa os níveis de áudio quando começa a gravar
        startAudioMetering(); // Iniciar medição de áudio
      } else {
        alert("Permissão de gravação negada.");
      }
    } catch (error) {
      console.error("Erro ao iniciar a gravação:", error);
    }
  }

  // Inicia a medição do nível de áudio
  const startAudioMetering = async () => {
    if (recording) {
      const interval = setInterval(async () => {
        const { meters } = await recording.getMeteringInfoAsync();
        setAudioLevels((prevLevels) => {
          // Mantém apenas os últimos 50 níveis de áudio para visualização
          const newLevels = [...prevLevels, meters.rms];
          return newLevels.slice(-50);
        });
      }, 100);
      
      // Armazenando o ID do intervalo para permitir a limpeza
      return () => clearInterval(interval); // Limpar intervalo quando a gravação parar
    }
  };

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

  // Normaliza os níveis de áudio para a visualização
  const normalizeAudioLevels = () => {
    if (audioLevels.length === 0) return [];
    const maxLevel = Math.max(...audioLevels);
    return audioLevels.map(level => (level / maxLevel) * 100); // Normaliza entre 0 e 100
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gravação de Áudio</Text>

      {/* Exibe o tempo de gravação */}
      {recording && <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>}

      {/* Visualizador de Áudio */}
      <View style={styles.visualizerContainer}>
        <Svg height="100" width="300">
          <Polyline
            points={normalizeAudioLevels().map((level, index) => `${index * 6},${100 - level}`).join(" ")} // Converte os níveis de áudio para pontos
            stroke="#5E17EB" // Cor do traço
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      </View>

      {/* Botões para iniciar, pausar e parar a gravação */}
      {!recording && (
        <TouchableOpacity style={[styles.recordButton, styles.startButton]} onPress={startRecording}>
          <FontAwesome name="microphone" size={32} color="white" />
        </TouchableOpacity>
      )}

      {recording && (
        <View style={styles.controlsContainer}>
          {isPaused ? (
            <TouchableOpacity style={[styles.controlButton, styles.resumeButton]} onPress={resumeRecording}>
              <FontAwesome name="play" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.controlButton, styles.pauseButton]} onPress={pauseRecording}>
              <FontAwesome name="pause" size={24} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.controlButton, styles.stopButton]} onPress={stopRecording}>
            <FontAwesome name="stop" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.statusText}>{recordingStatus}</Text>

      {/* Botões para ouvir e parar o áudio gravado */}
      {recordedUri && (
        <View style={styles.playbackContainer}>
          <TouchableOpacity style={styles.playButton} onPress={playAudio}>
            <FontAwesome name="play" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={saveRecording}>
            <FontAwesome name="save" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  timerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF4C4C", // Cor do tempo de gravação
    marginBottom: 10,
  },
  visualizerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 5, // Sombra para botão de gravação
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: 220,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    elevation: 3, // Sombra para os botões de controle
  },
  startButton: {
    backgroundColor: "#5E17EB", // Cor para iniciar gravação
  },
  pauseButton: {
    backgroundColor: "#FF4C4C", // Cor para pausar
  },
  resumeButton: {
    backgroundColor: "#5E17EB", // Cor para continuar
  },
  stopButton: {
    backgroundColor: "#FF4C4C", // Cor para parar
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
    width: 180,
    marginTop: 20,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#5E17EB", // Cor para reproduzir
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    elevation: 3, // Sombra para o botão de play
  },
  saveButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF4C4C", // Cor para salvar
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    elevation: 3, // Sombra para o botão de salvar
  },
});
