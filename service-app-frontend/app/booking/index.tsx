import React, { useState } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ScrollView, ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "@/utils/api";

export default function BookingScreen() {
  const { workerId, workerName } = useLocalSearchParams<{
    workerId: string;
    workerName: string;
  }>();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBooking = async () => {
    if (!customerName || !address || !phone) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/bookings", {
        customerName,
        customerPhone: phone,
        address,
        workerId: Number(workerId),
      });

      Alert.alert(
        "Booking Confirmed 🎉",
        `Your booking with ${workerName} has been submitted!`,
        [{ text: "OK", onPress: () => router.replace("/(tabs)/explore") }]
      );
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Booking failed. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>

      <Text style={styles.title}>Book Service</Text>
      {workerName && (
        <Text style={styles.workerLabel}>with {workerName}</Text>
      )}

      <TextInput
        placeholder="Your Name"
        style={styles.input}
        placeholderTextColor="#9ca3af"
        value={customerName}
        onChangeText={setCustomerName}
      />

      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        placeholderTextColor="#9ca3af"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        placeholder="Enter your full address"
        style={[styles.input, { height: 100 }]}
        placeholderTextColor="#9ca3af"
        multiline
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity style={styles.button} onPress={handleBooking} disabled={loading}>
        {loading
          ? <ActivityIndicator color="white" />
          : <Text style={styles.buttonText}>Confirm Booking</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", padding: 20 },
  backBtn: { marginTop: 50, marginBottom: 4, width: 40 },
  title: { fontSize: 30, fontWeight: "bold", marginBottom: 4, color: "#222" },
  workerLabel: { fontSize: 16, color: "#6b7280", marginBottom: 28 },
  input: {
    backgroundColor: "white", borderRadius: 14, padding: 16,
    marginBottom: 16, fontSize: 16, color: "#111827",
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  button: {
    backgroundColor: "#111827", paddingVertical: 16,
    borderRadius: 14, alignItems: "center", marginTop: 10,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});