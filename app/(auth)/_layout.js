import { Link, Redirect, Stack } from 'expo-router';
import { useSession } from '../ctx';
import { Image, Pressable, Text } from 'react-native';
import LogoEchoMeet from '../../assets/icons/logo.png'
import { FontAwesome } from '@expo/vector-icons';
export default function AppLayout() {
  const { session, isLoading } = useSession();
  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen 
      name="(tabs)" 
      options={
        { 
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="user-circle"
                    size={25}
                    color={'blue'}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          headerShown: true,
        headerTitle:() => (<Image style={{width: 120}} resizeMode='contain' source={LogoEchoMeet}/>)
        }} />
      <Stack.Screen name="groups/[id]" options={{
        headerTitle: 'Grupo do Financeiro'
      }}/>
      <Stack.Screen name="recorder" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  )
}