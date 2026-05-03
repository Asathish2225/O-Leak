import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !phone || !password || !confirm) {
      Alert.alert("Error", "Please fill in all fields"); return;
    }
    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match"); return;
    }
    if (phone.length !== 10) {
      Alert.alert("Error", "Phone must be 10 digits"); return;
    }
    setLoading(true);
    try {
      await register(name, phone, password);
      Alert.alert("🎉 Account Created!", "Please login to continue.", [
        { text: "Login Now", onPress: () => router.replace("/login") },
      ]);
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Registration failed.";
      Alert.alert("Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", icon: "person-outline", value: name, setter: setName, keyboard: "default", secure: false },
    { label: "Phone Number", icon: "call-outline", value: phone, setter: setPhone, keyboard: "phone-pad", secure: false },
    { label: "Password", icon: "lock-closed-outline", value: password, setter: setPassword, keyboard: "default", secure: !showPass },
    { label: "Confirm Password", icon: "shield-checkmark-outline", value: confirm, setter: setConfirm, keyboard: "default", secure: true },
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#0F0F0F" }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join thousands of happy customers</Text>

        {fields.map((f, i) => (
          <View key={i} style={styles.inputWrapper}>
            <Ionicons name={f.icon as any} size={20} color="#FF6B00" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={f.label}
              placeholderTextColor="#555"
              keyboardType={f.keyboard as any}
              secureTextEntry={f.secure}
              value={f.value}
              onChangeText={f.setter}
            />
            {f.label === "Password" && (
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={20} color="#555" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#FFF" />
            : <Text style={styles.buttonText}>Create Account</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.link}>Already have an account? <Text style={styles.linkBold}>Login</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#0F0F0F", padding: 24, paddingTop: 60 },
  back: { marginBottom: 24, width: 40 },
  title: { fontSize: 32, fontWeight: "900", color: "#FFF", marginBottom: 6 },
  subtitle: { color: "#666", fontSize: 15, marginBottom: 32 },
  inputWrapper: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#1A1A1A", borderRadius: 14, paddingHorizontal: 16,
    marginBottom: 14, borderWidth: 1, borderColor: "#2A2A2A",
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: "#FFF", fontSize: 16, paddingVertical: 16 },
  button: {
    backgroundColor: "#FF6B00", borderRadius: 14,
    paddingVertical: 16, alignItems: "center", marginTop: 10, marginBottom: 20,
  },
  buttonText: { color: "#FFF", fontSize: 17, fontWeight: "800" },
  link: { textAlign: "center", color: "#666", fontSize: 15 },
  linkBold: { color: "#FF6B00", fontWeight: "700" },
});