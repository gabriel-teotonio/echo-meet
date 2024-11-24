import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { SessionProvider } from "../ctx";
import { Slot } from "expo-router";
import { NavigationContainer } from "@react-navigation/native";

export { 
  ErrorBoundary,
} from "expo-router";

// Configurações de rota
export const unstable_settings = {
  initialRouteName: "login",
};

// Impede a splash screen de desaparecer automaticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  useEffect(() => {
    async function hideSplashScreen() {
      await SplashScreen.hideAsync();
    }
    hideSplashScreen();
  }, []);

  return (
    <SessionProvider>
      <NavigationContainer>
        <Slot />
      </NavigationContainer>
    </SessionProvider>
  );
}
