import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SessionProvider } from "./ctx";

export { 
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "login",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
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