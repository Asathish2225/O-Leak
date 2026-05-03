import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Missing Fields", "Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await login(phone, password);
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Invalid phone or password.";
      Alert.alert("Login Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0F0F0F" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="construct" size={36} color="#FF6B00" />
          </View>
          <Text style={styles.logoText}>O-Leak</Text>
          <Text style={styles.logoTagline}>Home Services, Done Right.</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={20} color="#FF6B00" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#555"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#FF6B00" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#555"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#555" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={styles.buttonText}>Login</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.link}>
              New here? <Text style={styles.linkBold}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#0F0F0F", justifyContent: "center", padding: 24 },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  logoCircle: {
    backgroundColor: "#1A1A1A", width: 80, height: 80, borderRadius: 40,
    justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "#FF6B00", marginBottom: 14,
  },
  logoText: { fontSize: 36, fontWeight: "900", color: "#FFFFFF", letterSpacing: 1 },
  logoTagline: { color: "#666", fontSize: 14, marginTop: 4 },
  card: { backgroundColor: "#1A1A1A", borderRadius: 24, padding: 24 },
  title: { fontSize: 28, fontWeight: "800", color: "#FFF", marginBottom: 6 },
  subtitle: { color: "#666", fontSize: 15, marginBottom: 28 },
  inputWrapper: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#111", borderRadius: 14, paddingHorizontal: 16,
    marginBottom: 16, borderWidth: 1, borderColor: "#2A2A2A",
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: "#FFF", fontSize: 16, paddingVertical: 16 },
  button: {
    backgroundColor: "#FF6B00", borderRadius: 14,
    paddingVertical: 16, alignItems: "center", marginTop: 8, marginBottom: 20,
  },
  buttonText: { color: "#FFF", fontSize: 17, fontWeight: "800" },
  link: { textAlign: "center", color: "#666", fontSize: 15 },
  linkBold: { color: "#FF6B00", fontWeight: "700" },
});