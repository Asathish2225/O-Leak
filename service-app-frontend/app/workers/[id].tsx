import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  Alert, RefreshControl, StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Location from "expo-location";
import api from "@/utils/api";

function SkeletonCard() {
  return (
    <View style={[styles.card, { opacity: 0.4 }]}>
      <View style={[styles.avatar, { backgroundColor: "#2A2A2A" }]} />
      <View style={{ flex: 1, gap: 8 }}>
        <View style={{ height: 16, backgroundColor: "#2A2A2A", borderRadius: 8, width: "60%" }} />
        <View style={{ height: 12, backgroundColor: "#2A2A2A", borderRadius: 8, width: "40%" }} />
        <View style={{ height: 12, backgroundColor: "#2A2A2A", borderRadius: 8, width: "80%" }} />
      </View>
    </View>
  );
}

function SectionHeader({ icon, title, subtitle, color = "#FF6B00" }: any) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIconBg, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

function WorkerCard({ item, index, userCoords, onPress, showRank }: any) {
  const getDistance = (lat2: number, lng2: number) => {
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

  const getETA = (km: string) => {
    const mins = Math.round(parseFloat(km) * 4);
    return mins < 5 ? "~5 min" : `~${mins} min`;
  };

  const km = getDistance(item.latitude, item.longitude);
  const eta = getETA(km);
  const initials = item.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase();
  const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onPress(item, km, eta)}>
      {showRank && index < 3 && (
        <View style={[styles.rankBadge, { backgroundColor: rankColors[index] }]}>
          <Text style={styles.rankText}>#{index + 1}</Text>
        </View>
      )}

      <View style={[styles.avatar, { backgroundColor: item.available ? "#FF6B00" + "30" : "#333" }]}>
        <Text style={[styles.avatarText, { color: item.available ? "#FF6B00" : "#666" }]}>{initials}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.workerName}>{item.fullName}</Text>
          {item.available && <View style={styles.onlineDot} />}
        </View>
        <Text style={styles.category}>{item.serviceCategory?.name}</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map(i => (
            <Ionicons key={i} name={i <= Math.round(item.rating ?? 0) ? "star" : "star-outline"} size={11} color="#FFD700" />
          ))}
          <Text style={styles.ratingText}>{item.rating?.toFixed(1) ?? "New"}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.experience}>{item.experience}</Text>
        </View>
      </View>

      <View style={styles.rightSide}>
        <View style={styles.distanceBadge}>
          <Ionicons name="location" size={11} color="#FF6B00" />
          <Text style={styles.distanceText}>{km} km</Text>
        </View>
        <Text style={styles.eta}>{eta}</Text>
        <View style={[styles.statusPill, { backgroundColor: item.available ? "#4CAF50" + "20" : "#F44336" + "20" }]}>
          <Text style={[styles.statusText, { color: item.available ? "#4CAF50" : "#F44336" }]}>
            {item.available ? "Free" : "Busy"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function WorkersScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [nearbyWorkers, setNearbyWorkers] = useState<any[]>([]);
  const [allWorkers, setAllWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userCoords, setUserCoords] = useState({ lat: 13.0827, lng: 80.2707 });
  const router = useRouter();

  useEffect(() => { fetchWorkers(); }, []);

  const fetchWorkers = async () => {
    try {
      let lat = 13.0827, lng = 80.2707;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
          lat = loc.coords.latitude;
          lng = loc.coords.longitude;
        }
      } catch (e) {
        console.log("Location unavailable, using default");
      }

      setUserCoords({ lat, lng });

      // Fetch nearby (within 5km)
      const nearbyRes = await api.get("/api/workers/nearby", {
        params: { serviceId: id, latitude: lat, longitude: lng },
      });
      setNearbyWorkers(nearbyRes.data);

      // Always fetch all workers too (large radius fallback)
      const allRes = await api.get("/api/workers/nearby", {
        params: { serviceId: id, latitude: lat, longitude: lng, radius: 9999 },
      });
      // Remove duplicates (workers already in nearby list)
      const nearbyIds = new Set(nearbyRes.data.map((w: any) => w.id));
      setAllWorkers(allRes.data.filter((w: any) => !nearbyIds.has(w.id)));

    } catch (e: any) {
      console.log("Error:", e?.response?.status, e?.message);
      Alert.alert("Error", "Could not load workers. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleWorkerPress = (item: any, km: string, eta: string) => {
    router.push({
      pathname: "/worker-detail/[workerId]",
      params: {
        workerId: item.id.toString(),
        workerName: item.fullName,
        distance: km,
        eta,
        serviceId: id,
        serviceName: name,
        available: item.available ? "true" : "false",
      },
    });
  };

  const totalCount = nearbyWorkers.length + allWorkers.length;

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
            {loading ? "Finding workers..." : `${totalCount} professionals found`}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={{ padding: 20, gap: 14 }}>
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </View>
      ) : (
        <FlatList
          data={[]}
          renderItem={null}
          keyExtractor={() => ""}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchWorkers(); }} tintColor="#FF6B00" />
          }
          ListHeaderComponent={
            <View style={{ padding: 20, gap: 14 }}>

              {/* NEARBY SECTION */}
              {nearbyWorkers.length > 0 && (
                <>
                  <SectionHeader
                    icon="navigate"
                    title="Near You"
                    subtitle={`${nearbyWorkers.length} workers within 5 km · nearest first`}
                    color="#FF6B00"
                  />
                  {nearbyWorkers.map((item, index) => (
                    <WorkerCard
                      key={item.id} item={item} index={index}
                      userCoords={userCoords} onPress={handleWorkerPress} showRank={true}
                    />
                  ))}
                </>
              )}

              {/* NO NEARBY MESSAGE */}
              {nearbyWorkers.length === 0 && (
                <View style={styles.noNearbyCard}>
                  <View style={styles.noNearbyIcon}>
                    <Ionicons name="location-outline" size={28} color="#FF6B00" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.noNearbyTitle}>No workers near you</Text>
                    <Text style={styles.noNearbySubtitle}>No one within 5 km — showing all available workers below</Text>
                  </View>
                </View>
              )}

              {/* ALL OTHER WORKERS */}
              {allWorkers.length > 0 && (
                <>
                  <SectionHeader
                    icon="people"
                    title={nearbyWorkers.length > 0 ? "Other Available Workers" : "All Available Workers"}
                    subtitle="These workers can travel to your location"
                    color="#00B4D8"
                  />
                  {allWorkers.map((item, index) => (
                    <WorkerCard
                      key={item.id} item={item} index={index}
                      userCoords={userCoords} onPress={handleWorkerPress} showRank={false}
                    />
                  ))}
                </>
              )}

              {/* TRULY EMPTY */}
              {totalCount === 0 && (
                <View style={styles.emptyFull}>
                  <Ionicons name="person-remove-outline" size={64} color="#333" />
                  <Text style={styles.emptyTitle}>No Workers Available</Text>
                  <Text style={styles.emptySubtitle}>
                    No professionals available for this service right now. Please try again later.
                  </Text>
                  <TouchableOpacity style={styles.retryBtn} onPress={() => { setLoading(true); fetchWorkers(); }}>
                    <Ionicons name="refresh" size={16} color="#FFF" />
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={{ height: 30 }} />
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0F0F0F" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, gap: 14 },
  backBtn: { width: 40, height: 40, backgroundColor: "#1A1A1A", borderRadius: 20, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#FFF" },
  headerSub: { color: "#666", fontSize: 13, marginTop: 2 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 4, marginTop: 8 },
  sectionIconBg: { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  sectionTitle: { color: "#FFF", fontWeight: "800", fontSize: 16 },
  sectionSubtitle: { color: "#666", fontSize: 12, marginTop: 2 },
  card: {
    backgroundColor: "#1A1A1A", borderRadius: 20, padding: 16,
    flexDirection: "row", alignItems: "center", gap: 14,
    borderWidth: 1, borderColor: "#2A2A2A",
  },
  rankBadge: { position: "absolute", top: -8, left: 12, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, zIndex: 1 },
  rankText: { fontSize: 11, fontWeight: "800", color: "#000" },
  avatar: { width: 58, height: 58, borderRadius: 29, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 20, fontWeight: "800" },
  info: { flex: 1, gap: 4 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  workerName: { fontSize: 16, fontWeight: "700", color: "#FFF" },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#4CAF50" },
  category: { color: "#888", fontSize: 13 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  ratingText: { color: "#FFD700", fontSize: 12, fontWeight: "600", marginLeft: 2 },
  dot: { color: "#444", fontSize: 12 },
  experience: { color: "#666", fontSize: 12 },
  rightSide: { alignItems: "center", gap: 6 },
  distanceBadge: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#FF6B00" + "20", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  distanceText: { color: "#FF6B00", fontSize: 12, fontWeight: "700" },
  eta: { color: "#888", fontSize: 11 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "700" },
  noNearbyCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "#1A1A1A", borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: "#FF6B00" + "40",
  },
  noNearbyIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#FF6B00" + "20", justifyContent: "center", alignItems: "center" },
  noNearbyTitle: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  noNearbySubtitle: { color: "#888", fontSize: 13, marginTop: 4, lineHeight: 18 },
  emptyFull: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#FFF" },
  emptySubtitle: { color: "#666", fontSize: 14, textAlign: "center", lineHeight: 22 },
  retryBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FF6B00", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  retryText: { color: "#FFF", fontWeight: "700" },
});