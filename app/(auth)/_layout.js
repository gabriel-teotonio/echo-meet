import { Redirect, Stack, useRouter } from 'expo-router';
import { useSession } from '../../ctx';
import { Image, Pressable, Text } from 'react-native';
import LogoEchoMeet from '../../assets/icons/logo.png';
import { FontAwesome } from '@expo/vector-icons';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const router = useRouter();
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{
          headerShown: true,
          headerTitle: () => (
            <Image 
              style={{ width: 120 }} 
              resizeMode='contain' 
              source={LogoEchoMeet}
            />
          )
        }} 
      />
      <Stack.Screen name="recorder" />
      <Stack.Screen
        options={{
          title:'Detalhes do Grupo'
        }}
        name="group/[id]" 
      />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  )
}
