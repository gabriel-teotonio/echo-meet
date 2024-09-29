import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SessionProvider } from "./ctx";

export { 
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "login",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return <RootLayoutNav />;
}
import { Slot } from "expo-router";

function RootLayoutNav() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}