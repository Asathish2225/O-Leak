import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !phone || !password || !confirm) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (phone.length !== 10) {
      Alert.alert("Error", "Phone must be 10 digits");
      return;
    }
    setLoading(true);
    try {
      await register(name, phone, password);
      Alert.alert("Success", "Account created! Please login.", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Registration failed. Please try again.";
      Alert.alert("Registration Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Find trusted home professionals</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#9ca3af"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#9ca3af"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={styles.buttonText}>Create Account</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.link}>
            Already have an account? <Text style={styles.linkBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 36,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#111827",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  button: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
  link: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 15,
  },
  linkBold: {
    color: "#111827",
    fontWeight: "700",
  },
});