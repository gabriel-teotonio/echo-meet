import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AudioRecorder from './components/AudioRecord/AudioRecorder';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Iniciar</Text>
      <Text>Começar gravando uma reunião ou importar audio existente.</Text>
      <AudioRecorder />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
