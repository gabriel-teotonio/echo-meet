import { Stack } from 'expo-router';

export default function SummaryDetailsLayout() {
  return (
    <Stack screenOptions={{
        headerShown: false,
    }}>
      <Stack.Screen name="index" options={{ title: 'Detalhes do Grupo' }} />
    </Stack>
  );
}
