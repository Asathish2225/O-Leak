import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF6B00",
        tabBarInactiveTintColor: "#555",
        tabBarStyle: {
          backgroundColor: "#111",
          borderTopWidth: 1,
          borderTopColor: "#1E1E1E",
          height: 68,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              <Ionicons name={focused ? "calendar" : "calendar-outline"} size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}