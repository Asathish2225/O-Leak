import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  RefreshControl, StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Location from "expo-location";
import api from "@/utils/api";

function SkeletonCard() {
  return (
    <View style={[styles.card, { opacity: 0.35 }]}>
      <View style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: "#2A2A2A" }} />
      <View style={{ flex: 1, gap: 10 }}>
        <View style={{ height: 15, backgroundColor: "#2A2A2A", borderRadius: 8, width: "55%" }} />
        <View style={{ height: 12, backgroundColor: "#2A2A2A", borderRadius: 8, width: "38%" }} />
        <View style={{ height: 12, backgroundColor: "#2A2A2A", borderRadius: 8, width: "75%" }} />
      </View>
    </View>
  );
}

function SectionLabel({ icon, title, subtitle, color = "#FF6B00" }: any) {
  return (
    <View style={styles.sectionLabel}>
      <View style={[styles.sectionIconBg, { backgroundColor: color + "22" }]}>
        <Ionicons name={icon} size={15} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSub}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

function WorkerCard({ item, index, userCoords, onPress, showRank }: any) {
  const haversine = (lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = ((lat2 - userCoords.lat) * Math.PI) / 180;
    const dLng = ((lng2 - userCoords.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((userCoords.lat * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
  };

  const km = haversine(item.latitude, item.longitude);
  const mins = Math.round(parseFloat(km) * 4);
  const eta = mins < 5 ? "~5 min" : `~${mins} min`;
  const initials = item.fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();
  const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

  return (
    <TouchableOpacity
      style={[styles.card, !item.available && styles.cardBusy]}
      activeOpacity={0.82}
      onPress={() => onPress(item, km, eta)}
    >
      {showRank && index < 3 && (
        <View style={[styles.rankBadge, { backgroundColor: rankColors[index] }]}>
          <Text style={styles.rankText}>#{index + 1}</Text>
        </View>
      )}

      <View style={[styles.avatar, { backgroundColor: item.available ? "#FF6B0028" : "#252525" }]}>
        <Text style={[styles.avatarText, { color: item.available ? "#FF6B00" : "#555" }]}>
          {initials}
        </Text>
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.workerName} numberOfLines={1}>{item.fullName}</Text>
          {item.available && <View style={styles.onlineDot} />}
        </View>
        <Text style={styles.category}>{item.serviceCategory?.name}</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map(i => (
            <Ionicons
              key={i}
              name={i <= Math.round(item.rating ?? 0) ? "star" : "star-outline"}
              size={11}
              color="#FFD700"
            />
          ))}
          <Text style={styles.ratingText}>{item.rating?.toFixed(1) ?? "New"}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.exp}>{item.experience}</Text>
        </View>
      </View>

      <View style={styles.cardRight}>
        <View style={styles.distBadge}>
          <Ionicons name="location" size={11} color="#FF6B00" />
          <Text style={styles.distText}>{km} km</Text>
        </View>
        <Text style={styles.etaText}>{eta}</Text>
        <View style={[styles.statusPill, { backgroundColor: item.available ? "#4CAF5022" : "#F4433622" }]}>
          <Text style={[styles.statusText, { color: item.available ? "#4CAF50" : "#F44336" }]}>
            {item.available ? "Free" : "Busy"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function NoNearbyBanner() {
  return (
    <View style={styles.noNearbyBanner}>
      <View style={styles.noNearbyIcon}>
        <Ionicons name="location-outline" size={26} color="#FF6B00" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.noNearbyTitle}>No workers near you</Text>
        <Text style={styles.noNearbyDesc}>
          No professionals within 5 km — showing all available workers below
        </Text>
      </View>
    </View>
  );
}

function EmptyState({ onRetry }: any) {
  return (
    <View style={styles.empty}>
      <Ionicons name="person-remove-outline" size={60} color="#2A2A2A" />
      <Text style={styles.emptyTitle}>No Workers Available</Text>
      <Text style={styles.emptySub}>
        No professionals available for this service right now.{"\n"}Please try again later.
      </Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
        <Ionicons name="refresh" size={15} color="#FFF" />
        <Text style={styles.retryText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function WorkersScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [nearbyWorkers, setNearbyWorkers] = useState<any[]>([]);
  const [otherWorkers, setOtherWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userCoords, setUserCoords] = useState({ lat: 13.0827, lng: 80.2707 });
  const router = useRouter();

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);

      console.log("Selected category:", id);

      const response = await api.get(`/api/workers/by-category/${id}`);

      console.log("Workers Response:", response.data);

      setOtherWorkers(response.data || []);
    } catch (e) {
      console.log("Workers API Error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePress = (item: any, km: string, eta: string) => {
    router.push(`/worker-detail/${item.id}`);
  };

  const total = nearbyWorkers.length + otherWorkers.length;
  const hasNearby = nearbyWorkers.length > 0;
  const hasOthers = otherWorkers.length > 0;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{name}</Text>
          <Text style={styles.headerSub}>
            {loading
              ? "Finding professionals..."
              : `${total} professional${total !== 1 ? "s" : ""} found`}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(); }}
            tintColor="#FF6B00"
          />
        }
        contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 50 }}
      >
        {/* Loading skeletons */}
        {loading && [1, 2, 3].map(i => <SkeletonCard key={i} />)}

        {/* No nearby banner */}
        {!loading && !hasNearby && total > 0 && <NoNearbyBanner />}

        {/* Nearby section */}
        {!loading && hasNearby && (
          <SectionLabel
            icon="navigate"
            title="Near You"
            subtitle={`${nearbyWorkers.length} workers within 5 km · nearest first`}
            color="#FF6B00"
          />
        )}
        {!loading && nearbyWorkers.map((item, index) => (
          <WorkerCard
            key={item.id} item={item} index={index}
            userCoords={userCoords} onPress={handlePress} showRank
          />
        ))}

        {/* Other workers section */}
        {!loading && hasOthers && (
          <SectionLabel
            icon="people"
            title={hasNearby ? "Other Available Workers" : "Available Workers"}
            subtitle="Can travel to your location"
            color="#00B4D8"
          />
        )}
        {!loading && otherWorkers.map((item, index) => (
          <WorkerCard
            key={item.id} item={item} index={index}
            userCoords={userCoords} onPress={handlePress} showRank={false}
          />
        ))}

        {/* Truly empty */}
        {!loading && total === 0 && (
          <EmptyState onRetry={() => { setLoading(true); load(); }} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0F0F0F" },
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, gap: 14,
  },
  backBtn: {
    width: 40, height: 40, backgroundColor: "#1A1A1A",
    borderRadius: 20, justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#FFF" },
  headerSub: { color: "#666", fontSize: 13, marginTop: 2 },
  sectionLabel: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 6, marginBottom: 2 },
  sectionIconBg: { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  sectionTitle: { color: "#FFF", fontWeight: "800", fontSize: 15 },
  sectionSub: { color: "#666", fontSize: 12, marginTop: 2 },
  card: {
    backgroundColor: "#1A1A1A", borderRadius: 20, padding: 16,
    flexDirection: "row", alignItems: "center", gap: 14,
    borderWidth: 1, borderColor: "#2A2A2A",
  },
  cardBusy: { opacity: 0.65 },
  rankBadge: {
    position: "absolute", top: -8, left: 14,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, zIndex: 1,
  },
  rankText: { fontSize: 11, fontWeight: "800", color: "#000" },
  avatar: { width: 58, height: 58, borderRadius: 29, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 20, fontWeight: "800" },
  cardInfo: { flex: 1, gap: 3 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  workerName: { fontSize: 16, fontWeight: "700", color: "#FFF", flexShrink: 1 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#4CAF50" },
  category: { color: "#888", fontSize: 13 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  ratingText: { color: "#FFD700", fontSize: 12, fontWeight: "600", marginLeft: 2 },
  dot: { color: "#444" },
  exp: { color: "#666", fontSize: 12 },
  cardRight: { alignItems: "center", gap: 6 },
  distBadge: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: "#FF6B0022", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  distText: { color: "#FF6B00", fontSize: 12, fontWeight: "700" },
  etaText: { color: "#888", fontSize: 11 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "700" },
  noNearbyBanner: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "#1A1A1A", borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: "#FF6B0044",
  },
  noNearbyIcon: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: "#FF6B0018", justifyContent: "center", alignItems: "center",
  },
  noNearbyTitle: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  noNearbyDesc: { color: "#888", fontSize: 13, marginTop: 4, lineHeight: 18 },
  empty: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#FFF" },
  emptySub: { color: "#555", fontSize: 14, textAlign: "center", lineHeight: 22 },
  retryBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#FF6B00", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 8,
  },
  retryText: { color: "#FFF", fontWeight: "700" },
});