// /app/groups/[id]/index.js
import { Tabs } from 'expo-router';

export default function GroupLayout() {
  return (
    <Tabs screenOptions={{
        headerShown: false
    }}>
      <Tabs.Screen name="index" options={{ title: 'Participantes' }} />
      <Tabs.Screen name="audioFiles" options={{ title: 'Arquivos de Áudio' }} />
      <Tabs.Screen name="summaries" options={{ title: 'Resumos' }} />
    </Tabs>
  );
}
