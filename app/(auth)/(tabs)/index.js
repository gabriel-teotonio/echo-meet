import { Button, StyleSheet, Text, View } from "react-native";

import { useSession } from "../../ctx";

export default function TabOneScreen() {
  const { signOut, session } = useSession();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Text style={styles.text}>Welcome, {session}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {/* <EditScreenInfo path="app/(auth)/(tabs)/index.tsx" /> */}
      <Button
        title="Sign Out"
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#0B0915',
    tintColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#fff'
  },
  text: {
    fontSize: 16,
    color: '#fff'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});