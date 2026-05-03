import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, TouchableOpacity, RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "@/utils/api";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  COMPLETED: "#10b981",
  CANCELLED: "#ef4444",
};

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/api/bookings");
      setBookings(res.data);
    } catch (e) {
      console.log("Failed to fetch bookings:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>

      {bookings.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="calendar-outline" size={60} color="#d1d5db" />
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubText}>Your service bookings will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.workerName}>
                  {item.worker?.fullName ?? "Worker"}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: STATUS_COLORS[item.status] ?? "#6b7280" },
                  ]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              <Text style={styles.serviceText}>
                {item.worker?.serviceCategory?.name ?? "Service"}
              </Text>

              <View style={styles.row}>
                <Ionicons name="location-outline" size={15} color="#6b7280" />
                <Text style={styles.infoText}>{item.address}</Text>
              </View>

              <View style={styles.row}>
                <Ionicons name="time-outline" size={15} color="#6b7280" />
                <Text style={styles.infoText}>
                  {new Date(item.bookingTime).toLocaleString()}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", paddingHorizontal: 18 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 32, fontWeight: "700", color: "#111827", marginTop: 60, marginBottom: 20 },
  emptyText: { fontSize: 20, fontWeight: "600", color: "#374151", marginTop: 16 },
  emptySubText: { color: "#6b7280", marginTop: 8, textAlign: "center" },
  card: {
    backgroundColor: "#ffffff", borderRadius: 20, padding: 18, marginBottom: 14,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  workerName: { fontSize: 18, fontWeight: "700", color: "#111827" },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusText: { color: "white", fontSize: 12, fontWeight: "700" },
  serviceText: { color: "#6b7280", marginTop: 4, marginBottom: 12, fontSize: 14 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  infoText: { marginLeft: 6, color: "#6b7280", fontSize: 14 },
});