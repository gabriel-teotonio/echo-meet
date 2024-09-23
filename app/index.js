import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Iniciar Gravação</Text>
      <Text>Começar gravando uma reunião ou importar audio existente.</Text>
      <Link href={"/recorder"}>Pagina de gravação</Link>
      <Link href={"/summary"}>Minhas reuniões</Link>
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
