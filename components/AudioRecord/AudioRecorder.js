import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome5 } from '@expo/vector-icons';

export default function AudioRecorderPlayer() {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);

  // Iniciar gravação de áudio
  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.granted) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      } else {
        console.log('Permissão para gravação de áudio não concedida.');
      }
    } catch (err) {
      console.error('Erro ao iniciar gravação', err);
    }
  }

  // Parar a gravação de áudio
  async function stopRecording() {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); // Obter o URI da gravação
      setRecordingUri(uri);
      setRecording(null);
    } catch (error) {
      console.error('Erro ao parar gravação', error);
    }
  }

  // Reproduzir o áudio gravado
  async function playSound() {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Erro ao reproduzir áudio', error);
    }
  }

  // Parar a reprodução do áudio
  async function stopSound() {
    if (sound) {
      await sound.stopAsync();
    }
  }

  return (
    <View style={styles.container}>
      {/* <Button
        title={recording ? "Parar Gravação" : 'd'}
        onPress={recording ? stopRecording : startRecording}
      /> */}
      <TouchableOpacity
      style={styles.buttonRecorder}
      onPress={recording ? stopRecording : startRecording}
      >
        {!recording ? 
        ( <FontAwesome5 name='microphone' size={70} color={'white'}/>) 
        :( <FontAwesome5 name='stop' size={70} color={'white'}/>)
        }
      </TouchableOpacity>
        <Text style={{ marginLeft: 10 }}>
          {recording ? 'Parar Gravação' : 'Iniciar Gravação'}
        </Text>
     
      {recordingUri && (
        <>
          <Button title="Reproduzir Áudio" onPress={playSound} />
          <Button title="Parar Áudio" onPress={stopSound} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  buttonRecorder: {
    backgroundColor: '#3A21B8',
    minWidth: 120,
    minHeight: 120,
    padding: 16,
    borderRadius: 60,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
