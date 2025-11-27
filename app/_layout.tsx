import { AuthProvider } from "@/context/auth";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}/>
    </AuthProvider>
  );
}
