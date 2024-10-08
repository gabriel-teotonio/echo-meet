// /app/groups/[id]/_layout.js
import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function GroupDetailsLayout() {
  return (
    <Tabs screenOptions={{
        
    }}>
      <Tabs.Screen name="index" 
      options={{ title: 'Participantes', 
        tabBarIcon: ({ color }) => <FontAwesome name="users" color={color} size={24} />}} />
      <Tabs.Screen name="audioFiles" 
      options={{ title: 'Arquivos de Áudio',
        tabBarIcon: ({ color }) => <FontAwesome name="file-sound-o" color={color} size={24} />
       }} />
      {/* <Tabs.Screen name="summaries" options={{ title: 'Resumos' }} /> */}
    </Tabs>
  );
}
