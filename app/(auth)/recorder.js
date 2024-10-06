import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from "react-native";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import RecordEvents from '../events/recordEvents'; // Corrigido para o nome correto

export default function AudioRecordingScreen() {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState("Clique para gravar");
  const [recordedUri, setRecordedUri] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Novo estado para controlar a reprodução

  // Estado do popup
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileName, setFileName] = useState(""); // Nome do arquivo
  const [group, setGroup] = useState(""); // Grupo associado

  // Função para iniciar a gravação
  async function startRecording() {
    if (recording) { // Verifica se já está gravando
      console.warn("Já existe uma gravação em andamento.");
      return; // Não inicia uma nova gravação
    }

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
      } else {
        alert("Permissão de gravação negada.");
      }
    } catch (error) {
      console.error("Erro ao iniciar a gravação:", error);
    }
  }

  // Função para abrir o seletor de arquivos e importar um arquivo
  async function importFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        console.log("Arquivo importado:", result.uri);
        Alert.alert("Arquivo importado com sucesso!", result.name);
      } else {
        console.log("Importação de arquivo cancelada.");
      }
    } catch (error) {
      console.error("Erro ao importar arquivo:", error);
    }
  }

  // Listener para eventos personalizados
  useEffect(() => {
    const listenerId = RecordEvents.addListener('audioRecordingEvent', (data) => {
      console.log('Evento de gravação recebido:', data);
    });

    return () => {
      // Remover o listener ao desmontar o componente
      RecordEvents.removeListener(listenerId);
    };
  }, []);

  // Função para parar a gravação
  async function stopRecording() {
    if (recording) {
      setRecordingStatus("Gravação parada.");
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); // Obtém a URI da gravação
      console.log("Gravação salva em:", uri); // Verifica a URI
      setRecordedUri(uri);
      setRecording(null); // Reseta o estado de gravação
      setIsPlaying(false); // Reseta o estado de reprodução
      setIsModalVisible(true); // Abre o popup ao parar a gravação
    }
  }

  // Função para pausar a gravação
  async function pauseRecording() {
    if (recording) {
      setIsPaused(true);
      await recording.pauseAsync();
      setRecordingStatus("Gravação pausada.");
    }
  }

  // Função para retomar a gravação
  async function resumeRecording() {
    if (recording) {
      setIsPaused(false);
      await recording.startAsync();
      setRecordingStatus("Gravando...");
    }
  }

  // Função para tocar a gravação
  async function playAudio() {
    if (recordedUri) {
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      setSound(sound);
      setIsPlaying(true); // Atualiza o estado de reprodução
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false); // Reseta o estado ao terminar a reprodução
        }
      });
    }
  }

  // Função para salvar a gravação
  async function saveRecording() {
    if (recordedUri && fileName && group) {
      try {
        // Aqui você pode adicionar a gravação à lista existente
        const savedRecordings = await AsyncStorage.getItem('recordings');
        const recordingsList = savedRecordings ? JSON.parse(savedRecordings) : [];

        const newRecording = {
          date: new Date().toLocaleString(),
          uri: recordedUri,
          name: fileName,
          group: group,
        };

        await AsyncStorage.setItem('recordings', JSON.stringify([...recordingsList, newRecording]));
        Alert.alert('Gravação salva com sucesso!');
        setIsModalVisible(false); // Fecha o popup após salvar
        setFileName(""); // Reseta o nome do arquivo
        setGroup(""); // Reseta o grupo
      } catch (error) {
        console.error("Erro ao salvar a gravação:", error);
      }
    } else {
      Alert.alert('Por favor, preencha todos os campos.');
    }
  }

  // Atualiza o tempo de gravação
  useEffect(() => {
    let timer;

    if (recording) {
      timer = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000); // Atualiza a cada segundo
    }

    return () => {
      clearInterval(timer); // Limpa o intervalo ao desmontar ou parar a gravação
    };
  }, [recording]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gravação de Áudio</Text>

      {recording && <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>}

      <View style={styles.actionButtonsContainer}>
        {!recording && (
          <TouchableOpacity style={[styles.recordButton, styles.startButton]} onPress={startRecording}>
            <FontAwesome name="microphone" size={32} color="white" />
          </TouchableOpacity>
        )}
        {!recording && ( // Botão de importação só aparece se não estiver gravando
          <TouchableOpacity style={[styles.importButton]} onPress={importFile}>
            <FontAwesome name="file" size={32} color="white" />
          </TouchableOpacity>
        )}
      </View>

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

      {recordedUri && !recording && ( // Os botões de reprodução e salvar só aparecem se não estiver gravando
        <View style={styles.playbackContainer}>
          <TouchableOpacity style={styles.playButton} onPress={playAudio}>
            <FontAwesome name="play" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={() => setIsModalVisible(true)}>
            <FontAwesome name="save" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para o Popup */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Salvar Gravação</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do arquivo"
              value={fileName}
              onChangeText={setFileName}
            />
            <TextInput
              style={styles.input}
              placeholder="Grupo"
              value={group}
              onChangeText={setGroup}
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveRecording}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 20,
    color: "#666",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  recordButton: {
    backgroundColor: "#5E17EB",
    padding: 20,
    borderRadius: 50,
    elevation: 4, // Sombra
  },
  importButton: {
    backgroundColor: "#28A745",
    padding: 20,
    borderRadius: 50,
    elevation: 4, // Sombra
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  controlButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 30,
    margin: 10,
    elevation: 4, // Sombra
  },
  pauseButton: {
    backgroundColor: "#FFA500",
  },
  resumeButton: {
    backgroundColor: "#28A745",
  },
  stopButton: {
    backgroundColor: "#FF0000",
  },
  playbackContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  playButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 30,
    margin: 10,
    elevation: 4, // Sombra
  },
  saveButton: {
    backgroundColor: "#FFC107",
    padding: 10,
    borderRadius: 30,
    margin: 10,
    elevation: 4, // Sombra
  },
  statusText: {
    fontSize: 16,
    marginTop: 20,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semi-transparente
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5, // Sombra
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
  },
  cancelButtonText: {
    color: "blue",
    textAlign: "center",
    marginTop: 10,
  },
});

// Função para formatar o tempo
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};
