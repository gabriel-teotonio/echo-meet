import { Stack } from "expo-router"

export default function RootLayout() {
    return (
        <Stack
        screenOptions={{
            headerStyle: {
                backgroundColor: '#3A21B8'
            },
            headerTintColor: '#fff'
        }}
        >
            <Stack.Screen name="index" options={{title: "Home"}}/>
        </Stack>
    );
}