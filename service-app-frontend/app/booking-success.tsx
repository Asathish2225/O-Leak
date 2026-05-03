import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function BookingSuccessScreen() {
  const { workerName, serviceName, eta, selectedSlot } = useLocalSearchParams<{
    workerName: string; serviceName: string; eta: string; selectedSlot: string;
  }>();
  const router = useRouter();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 6 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />

      <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
        <Ionicons name="checkmark" size={60} color="#FFF" />
      </Animated.View>

      <Animated.View style={[{ alignItems: "center", gap: 8 }, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>Your professional is on the way</Text>
      </Animated.View>

      <Animated.View style={[styles.detailCard, { opacity: fadeAnim }]}>
        {[
          { icon: "person", label: "Worker", value: workerName },
          { icon: "construct", label: "Service", value: serviceName },
          { icon: "time", label: "Arrives in", value: selectedSlot === "Now" ? eta : selectedSlot },
          { icon: "radio-button-on", label: "Status", value: "Confirmed" },
        ].map((item, i) => (
          <View key={i} style={[styles.detailRow, i < 3 && styles.detailBorder]}>
            <View style={styles.detailIcon}>
              <Ionicons name={item.icon as any} size={16} color="#FF6B00" />
            </View>
            <Text style={styles.detailLabel}>{item.label}</Text>
            <Text style={styles.detailValue}>{item.value}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Track steps */}
      <Animated.View style={[styles.trackCard, { opacity: fadeAnim }]}>
        <Text style={styles.trackTitle}>Live Status</Text>
        <View style={styles.trackSteps}>
          {[
            { label: "Booking Received", done: true },
            { label: "Worker Assigned", done: true },
            { label: "Worker En Route", done: false },
            { label: "Job Complete", done: false },
          ].map((step, i) => (
            <View key={i} style={styles.trackStep}>
              <View style={[styles.trackDot, step.done && styles.trackDotDone]}>
                {step.done && <Ionicons name="checkmark" size={12} color="#FFF" />}
              </View>
              {i < 3 && <View style={[styles.trackLine, step.done && styles.trackLineDone]} />}
              <Text style={[styles.trackLabel, step.done && styles.trackLabelDone]}>{step.label}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.View style={[{ width: "100%", gap: 12 }, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace("/(tabs)")}>
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookingsBtn} onPress={() => router.replace("/(tabs)/explore")}>
          <Text style={styles.bookingsBtnText}>View My Bookings</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0F0F0F", alignItems: "center", justifyContent: "center", padding: 24, gap: 24 },
  successCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: "#FF6B00", justifyContent: "center", alignItems: "center", shadowColor: "#FF6B00", shadowOpacity: 0.5, shadowRadius: 30, elevation: 10 },
  title: { fontSize: 30, fontWeight: "900", color: "#FFF" },
  subtitle: { color: "#888", fontSize: 15 },
  detailCard: { backgroundColor: "#1A1A1A", borderRadius: 20, padding: 4, width: "100%", borderWidth: 1, borderColor: "#2A2A2A" },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  detailBorder: { borderBottomWidth: 1, borderBottomColor: "#2A2A2A" },
  detailIcon: { width: 32, height: 32, backgroundColor: "#FF6B00" + "20", borderRadius: 10, justifyContent: "center", alignItems: "center" },
  detailLabel: { color: "#666", fontSize: 14, flex: 1 },
  detailValue: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  trackCard: { backgroundColor: "#1A1A1A", borderRadius: 20, padding: 16, width: "100%", borderWidth: 1, borderColor: "#2A2A2A" },
  trackTitle: { color: "#FFF", fontWeight: "700", fontSize: 15, marginBottom: 16 },
  trackSteps: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  trackStep: { alignItems: "center", flex: 1, position: "relative" },
  trackDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#2A2A2A", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#333", marginBottom: 6 },
  trackDotDone: { backgroundColor: "#FF6B00", borderColor: "#FF6B00" },
  trackLine: { position: "absolute", top: 14, left: "50%", width: "100%", height: 2, backgroundColor: "#2A2A2A" },
  trackLineDone: { backgroundColor: "#FF6B00" },
  trackLabel: { color: "#555", fontSize: 10, textAlign: "center", fontWeight: "600" },
  trackLabelDone: { color: "#FF6B00" },
  homeBtn: { backgroundColor: "#FF6B00", borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  homeBtnText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  bookingsBtn: { backgroundColor: "#1A1A1A", borderRadius: 16, paddingVertical: 16, alignItems: "center", borderWidth: 1, borderColor: "#2A2A2A" },
  bookingsBtnText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});