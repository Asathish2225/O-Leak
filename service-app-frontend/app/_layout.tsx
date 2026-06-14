import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ActivityIndicator, View } from "react-native";

function RootNavigator() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

 useEffect(() => {
   if (isLoading) return;

   const isPublicRoute =
     segments[0] === "login" ||
     segments[0] === "register";

   if (!token && !isPublicRoute) {
     router.replace("/login");
   }
 }, [token, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F0F0F" }}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0F0F0F" } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="workers/[id]" />
      <Stack.Screen name="worker-detail/[workerId]" />
      <Stack.Screen name="booking/index" />
      <Stack.Screen name="booking-success" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}