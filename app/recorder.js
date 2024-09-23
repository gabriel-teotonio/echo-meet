import { Link } from "expo-router";
import { Text, View } from "react-native";
import AudioRecorderPlayer from "../components/AudioRecord/AudioRecorder";

export default function Recorder() {
  return (
    <View>
      <Text>Iniciar Gravação</Text>
      <Text>Começar gravando uma reunião ou importar audio existente.</Text>
      <AudioRecorderPlayer />
      
      <Link href={"/"}>Volta para tela inicial</Link>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
// });
