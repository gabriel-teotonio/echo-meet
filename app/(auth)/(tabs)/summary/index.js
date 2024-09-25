import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Summary() {
  return (
    <View style={styles.container}>
      <Text>Minhas reuniões</Text>
      <Link href={"/recorder"}>Pagina de gravação</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
