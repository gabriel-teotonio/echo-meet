// /app/groups/[id]/_layout.js
import { Tabs } from 'expo-router';

export default function GroupDetailsLayout() {
  return (
    <Tabs screenOptions={{
        
    }}>
      <Tabs.Screen name="index" options={{ title: 'Participantes' }} />
      <Tabs.Screen name="audioFiles" options={{ title: 'Arquivos de Áudio' }} />
      {/* <Tabs.Screen name="summaries" options={{ title: 'Resumos' }} /> */}
    </Tabs>
  );
}
