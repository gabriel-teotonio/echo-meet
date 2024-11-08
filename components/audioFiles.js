import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl, Modal } from "react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useSession } from "../app/ctx";

const Files = () => {
  const [recordings, setRecordings] = useState([]);
  const [playingUri, setPlayingUri] = useState(null);
  const [playingSound, setPlayingSound] = useState(null); // Para armazenar o objeto sound
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groups, setGroups] = useState([]); // Lista de grupos
  const router = useRouter();
  const { session } = useSession();

  const fetchRecordings = async () => {
    try {
      const storedRecordings = await AsyncStorage.getItem("recordings");
      if (storedRecordings !== null) {
        const recordingsList = JSON.parse(storedRecordings);
        console.log(recordingsList);
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

  const fetchGroups = async () => {
    // Função para buscar a lista de grupos
    try {
      const res = await axios.get("https://app.echomeets.online/grupos/user", {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      })
      console.log(res.data)
      setGroups(res.data);
    } catch (error) {
      console.error("Erro ao buscar grupos:", error);
    }
  };

  useEffect(() => {
    fetchRecordings();
    fetchGroups(); // Busca os grupos ao montar o componente
    return () => {
      if (playingSound) {
        playingSound.unloadAsync();
      }
    };
  }, []);

  const playAudio = async (uri) => {
    if (playingUri === uri) {
      if (playingSound) {
        await playingSound.pauseAsync();
        setPlayingSound(null);
      }
      setPlayingUri(null);
    } else {
      if (playingSound) {
        await playingSound.stopAsync();
        await playingSound.unloadAsync();
      }

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
    fetchRecordings();
  };

  const openModal = (recording) => {
    setSelectedRecording(recording);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedGroup("");
  };

  const generateSummary = async () => {
    closeModal();
    try {
      
      Alert.alert("Sucesso", "Resumo gerado para o grupo selecionado.");
    } catch (error) {
      console.error("Erro ao gerar resumo:", error);
      Alert.alert("Erro", "Falha ao gerar resumo.");
    }
  };

  const renderRecording = ({ item }) => {
    return (
      <View style={styles.recordingItem}>
        <View style={styles.containText}>
          <Text style={styles.recordItemTitle}>{item.name}</Text>
          <Text style={styles.recordingText}>{item.date}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.generateButton} onPress={() => openModal(item)}>
            <MaterialIcons name="generating-tokens" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playButton} onPress={() => playAudio(item.uri)}>
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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={() => router.push("recorder")}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal de Seleção de Grupo */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Grupo</Text>
            <Picker
              selectedValue={selectedGroup}
              onValueChange={(itemValue) => setSelectedGroup(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione um grupo" value="" />
              {groups.map((group, index) => (
                <Picker.Item key={index} label={group.name} value={group.name} />
              ))}
            </Picker>
            <TouchableOpacity style={styles.modalButton} onPress={() => generateSummary} disabled={!selectedGroup}>
              <Text style={styles.modalButtonText}>Gerar Resumo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
              <Text style={styles.modalCloseButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  containText: {},
  recordItemTitle: { fontSize: 18, fontWeight: "semibold", marginBottom: 3 },
  noRecordingsText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#888" },
  recordingItem: { padding: 15, backgroundColor: "#fff", borderRadius: 8, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  recordingText: { fontSize: 14, color: "#333" },
  buttonsContainer: { flexDirection: "row", alignItems: "cPickerenter", gap: 5 },
  playButton: { backgroundColor: "green", padding: 10, borderRadius: 5 },
  deleteButton: { backgroundColor: "#dc3545", padding: 10, borderRadius: 5 },
  generateButton: { backgroundColor: "#3A21B8", padding: 10, borderRadius: 5 },
  floatingButton: { position: "absolute", bottom: 20, right: 20, backgroundColor: "#5E17EB", borderRadius: 50, padding: 15 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { width: 300, padding: 20, backgroundColor: "white", borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  picker: { width: 200, height: 50 },
  modalButton: { marginTop: 20, backgroundColor: "#3A21B8", padding: 10, borderRadius: 5 },
  modalButtonText: { color: "white" },
  modalCloseButton: { marginTop: 10 },
  modalCloseButtonText: { color: "#333" }
});

export default Files;
