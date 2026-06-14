import React, { useState } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ScrollView, ActivityIndicator, StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "@/utils/api";

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

export default function BookingScreen() {
  const {
    workerId,
    workerName,
    distance = "N/A",
    eta = "N/A",
    serviceName,
  } = useLocalSearchParams();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("Now");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBooking = async () => {
    if (!customerName || !address || !phone) {
      Alert.alert("Missing Info", "Please fill name, phone and address");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/bookings", {
        customerName,
        customerPhone: phone,
        address: `${address}${note ? " | Note: " + note : ""}`,
        workerId: Number(workerId),
      });
      router.replace({
        pathname: "/booking-success",
        params: { workerName, serviceName, eta, selectedSlot },
      });
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Booking failed. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>

        {/* Worker Summary */}
        <View style={styles.workerSummary}>
          <View style={styles.workerAvatar}>
            <Text style={styles.workerAvatarText}>
              {workerName?.split(" ").map(n => n[0]).join("").toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.workerName}>{workerName}</Text>
            <Text style={styles.workerService}>{serviceName}</Text>
            <View style={styles.workerMeta}>
              <Ionicons name="location" size={13} color="#FF6B00" />
              <Text style={styles.workerMetaText}>{distance} km • arrives {eta}</Text>
            </View>
          </View>
          <View style={styles.onlineTag}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>

        {/* When? */}
        <Text style={styles.sectionLabel}>When do you need it?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {["Now", ...TIME_SLOTS].map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[styles.slotChip, selectedSlot === slot && styles.slotActive]}
              onPress={() => setSelectedSlot(slot)}
            >
              {slot === "Now" && <Ionicons name="flash" size={14} color={selectedSlot === slot ? "#FFF" : "#666"} />}
              <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Form */}
        <Text style={styles.sectionLabel}>Your Details</Text>

        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={18} color="#FF6B00" />
          <TextInput style={styles.input} placeholder="Your Name" placeholderTextColor="#555" value={customerName} onChangeText={setCustomerName} />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="call-outline" size={18} color="#FF6B00" />
          <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#555" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        </View>

        <Text style={styles.sectionLabel}>Service Address</Text>
        <View style={[styles.inputWrapper, { alignItems: "flex-start", paddingTop: 14 }]}>
          <Ionicons name="location-outline" size={18} color="#FF6B00" style={{ marginTop: 2 }} />
          <TextInput
            style={[styles.input, { height: 90 }]} placeholder="Full address..." placeholderTextColor="#555"
            multiline value={address} onChangeText={setAddress}
          />
        </View>

        <Text style={styles.sectionLabel}>Additional Notes (Optional)</Text>
        <View style={[styles.inputWrapper, { alignItems: "flex-start", paddingTop: 14 }]}>
          <Ionicons name="document-text-outline" size={18} color="#666" style={{ marginTop: 2 }} />
          <TextInput
            style={[styles.input, { height: 70 }]} placeholder="Any specific instructions..."
            placeholderTextColor="#555" multiline value={note} onChangeText={setNote}
          />
        </View>

        {/* Price estimate */}
        <View style={styles.priceCard}>
          <Ionicons name="receipt-outline" size={20} color="#FF6B00" />
          <View style={{ flex: 1 }}>
            <Text style={styles.priceTitle}>Estimated Cost</Text>
            <Text style={styles.priceNote}>Final price after worker inspection</Text>
          </View>
          <Text style={styles.priceValue}>₹200 – ₹500</Text>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleBooking} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#FFF" />
            : <>
                <Text style={styles.confirmText}>Confirm Booking</Text>
                <Ionicons name="checkmark-circle" size={22} color="#FFF" />
              </>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0F0F0F" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, backgroundColor: "#1A1A1A", borderRadius: 20, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#FFF" },
  workerSummary: { backgroundColor: "#1A1A1A", borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 24, borderWidth: 1, borderColor: "#2A2A2A" },
  workerAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#FF6B00" + "30", justifyContent: "center", alignItems: "center" },
  workerAvatarText: { color: "#FF6B00", fontSize: 18, fontWeight: "800" },
  workerName: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  workerService: { color: "#888", fontSize: 13, marginTop: 2 },
  workerMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  workerMetaText: { color: "#FF6B00", fontSize: 12 },
  onlineTag: { flexDirection: "row", alignItems: "center", gap: 5 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#4CAF50" },
  onlineText: { color: "#4CAF50", fontSize: 12, fontWeight: "600" },
  sectionLabel: { color: "#FFF", fontWeight: "700", fontSize: 16, marginBottom: 12 },
  slotChip: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#1A1A1A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, marginRight: 10, borderWidth: 1, borderColor: "#2A2A2A" },
  slotActive: { backgroundColor: "#FF6B00", borderColor: "#FF6B00" },
  slotText: { color: "#666", fontSize: 14, fontWeight: "600" },
  slotTextActive: { color: "#FFF" },
  inputWrapper: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#1A1A1A", borderRadius: 14, paddingHorizontal: 16, marginBottom: 14, borderWidth: 1, borderColor: "#2A2A2A" },
  input: { flex: 1, color: "#FFF", fontSize: 15, paddingVertical: 14 },
  priceCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#1A1A1A", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#FF6B00" + "40", marginTop: 8 },
  priceTitle: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  priceNote: { color: "#666", fontSize: 12, marginTop: 2 },
  priceValue: { color: "#FF6B00", fontWeight: "800", fontSize: 16 },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 36, backgroundColor: "#0F0F0F", borderTopWidth: 1, borderTopColor: "#1A1A1A" },
  confirmBtn: { backgroundColor: "#FF6B00", borderRadius: 16, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  confirmText: { color: "#FFF", fontSize: 17, fontWeight: "800" },
});