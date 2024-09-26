import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Files() {
  return (
    <View style={styles.container}>
      <Text>Arquivos de audio</Text>
      <Link href={"/recorder"}>Pagina de gravação</Link>
      <Link href={"/summary"}>Minhas reuniões</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#?fff',
  },
});
