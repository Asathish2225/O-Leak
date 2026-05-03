import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, TouchableOpacity, RefreshControl, StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "@/utils/api";

const STATUS_CONFIG: Record<string, { color: string; icon: any; bg: string }> = {
  PENDING:   { color: "#FFD700", icon: "time",              bg: "#FFD700" + "15" },
  CONFIRMED: { color: "#00B4D8", icon: "checkmark-circle",  bg: "#00B4D8" + "15" },
  COMPLETED: { color: "#4CAF50", icon: "checkmark-done-circle", bg: "#4CAF50" + "15" },
  CANCELLED: { color: "#F44336", icon: "close-circle",      bg: "#F44336" + "15" },
};

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filters = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

  const fetchBookings = async () => {
    try {
      const res = await api.get("/api/bookings");
      setBookings(res.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchBookings(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); fetchBookings(); }, []);

  const filtered = activeFilter === "ALL"
    ? bookings
    : bookings.filter(b => b.status === activeFilter);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{bookings.length}</Text>
        </View>
      </View>

      {/* Filter Chips */}
      <FlatList
        horizontal
        data={filters}
        keyExtractor={i => i}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === item && styles.filterActive]}
            onPress={() => setActiveFilter(item)}
          >
            <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={64} color="#333" />
          <Text style={styles.emptyTitle}>No Bookings</Text>
          <Text style={styles.emptySubtitle}>
            {activeFilter === "ALL" ? "You haven't made any bookings yet" : `No ${activeFilter.toLowerCase()} bookings`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B00" />}
          renderItem={({ item }) => {
            const config = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.PENDING;
            const initials = item.worker?.fullName?.split(" ").map((n: string) => n[0]).join("") ?? "W";
            return (
              <View style={styles.card}>
                {/* Top Row */}
                <View style={styles.cardHeader}>
                  <View style={styles.workerAvatar}>
                    <Text style={styles.workerAvatarText}>{initials}</Text>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.workerName}>{item.worker?.fullName ?? "Worker"}</Text>
                    <Text style={styles.serviceName}>{item.worker?.serviceCategory?.name}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                    <Ionicons name={config.icon} size={13} color={config.color} />
                    <Text style={[styles.statusText, { color: config.color }]}>{item.status}</Text>
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Info */}
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.infoText} numberOfLines={1}>{item.address}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.infoText}>
                    {item.bookingTime ? new Date(item.bookingTime).toLocaleString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    }) : "Just now"}
                  </Text>
                </View>

                {/* Booking ID */}
                <View style={styles.bookingIdRow}>
                  <Text style={styles.bookingId}>Booking #{item.id}</Text>
                  {item.status === "COMPLETED" && (
                    <TouchableOpacity style={styles.reviewBtn}>
                      <Ionicons name="star-outline" size={13} color="#FF6B00" />
                      <Text style={styles.reviewBtnText}>Rate</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0F0F0F" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F0F0F" },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: "900", color: "#FFF" },
  countBadge: { backgroundColor: "#FF6B00", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  countText: { color: "#FFF", fontWeight: "800", fontSize: 13 },
  filtersRow: { paddingHorizontal: 20, gap: 10, marginBottom: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#1A1A1A", borderWidth: 1, borderColor: "#2A2A2A" },
  filterActive: { backgroundColor: "#FF6B00", borderColor: "#FF6B00" },
  filterText: { color: "#666", fontSize: 13, fontWeight: "600" },
  filterTextActive: { color: "#FFF" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10, padding: 40 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#FFF" },
  emptySubtitle: { color: "#666", fontSize: 14, textAlign: "center" },
  card: { backgroundColor: "#1A1A1A", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#2A2A2A" },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  workerAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#FF6B00" + "30", justifyContent: "center", alignItems: "center" },
  workerAvatarText: { color: "#FF6B00", fontWeight: "800", fontSize: 16 },
  workerName: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  serviceName: { color: "#666", fontSize: 13 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#2A2A2A", marginBottom: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  infoText: { color: "#888", fontSize: 13, flex: 1 },
  bookingIdRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  bookingId: { color: "#444", fontSize: 12 },
  reviewBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FF6B00" + "20", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  reviewBtnText: { color: "#FF6B00", fontSize: 12, fontWeight: "600" },
});