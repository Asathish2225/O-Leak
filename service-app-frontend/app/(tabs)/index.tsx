import React, { useEffect, useState, useMemo } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, RefreshControl, StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

const SERVICE_META: Record<string, { icon: any; color: string }> = {
  electrician: { icon: "flash", color: "#FFD700" },
  plumber:     { icon: "water", color: "#00B4D8" },
  painter:     { icon: "color-palette", color: "#E040FB" },
  carpenter:   { icon: "hammer", color: "#FF7043" },
  "ac repair": { icon: "snow", color: "#00E5FF" },
  cleaning:    { icon: "sparkles", color: "#69F0AE" },
  default:     { icon: "construct", color: "#FF6B00" },
};

const getMeta = (name: string) =>
  SERVICE_META[name.toLowerCase()] ?? SERVICE_META.default;

export default function HomeScreen() {
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { userName, logout } = useAuth();

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/api/services");
      setServices(res.data);
    } catch (e) { console.log(e); }
    finally { setRefreshing(false); }
  };

  const filtered = useMemo(() =>
    search.trim()
      ? services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
      : services,
    [search, services]
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchServices(); }} tintColor="#FF6B00" />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey {userName ?? "there"} 👋</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color="#FF6B00" />
              <Text style={styles.locationText}>Chennai, Tamil Nadu</Text>
            </View>
          </View>
          <TouchableOpacity onPress={logout} style={styles.avatarBtn}>
            <Text style={styles.avatarText}>{userName?.[0]?.toUpperCase() ?? "U"}</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor="#555"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={20} color="#555" />
            </TouchableOpacity>
          )}
        </View>

        {/* Hero Banner */}
        <View style={styles.banner}>
          <View>
            <Text style={styles.bannerTag}>⚡ FAST & RELIABLE</Text>
            <Text style={styles.bannerTitle}>Home Services{"\n"}at Your Door</Text>
            <Text style={styles.bannerSub}>Verified professionals, real-time tracking</Text>
          </View>
          <View style={styles.bannerIllustration}>
            <Ionicons name="home" size={64} color="#FF6B00" style={{ opacity: 0.3 }} />
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { icon: "person", label: "Workers", value: "500+" },
            { icon: "star", label: "Rating", value: "4.8★" },
            { icon: "checkmark-circle", label: "Bookings", value: "10K+" },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Ionicons name={s.icon as any} size={22} color="#FF6B00" />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Services */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {search ? `Results for "${search}"` : "Our Services"}
          </Text>
          <Text style={styles.sectionCount}>{filtered.length} available</Text>
        </View>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="search" size={48} color="#333" />
            <Text style={styles.emptyText}>No services found</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filtered.map((item: any) => {
              const meta = getMeta(item.name);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.serviceCard}
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: "/workers/[id]",
                      params: { id: item.id.toString(), name: item.name },
                    })
                  }
                >
                  <View style={[styles.iconBg, { backgroundColor: meta.color + "20" }]}>
                    <Ionicons name={meta.icon} size={32} color={meta.color} />
                  </View>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardAvail}>Available now</Text>
                    <Ionicons name="chevron-forward" size={14} color="#FF6B00" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* How it works */}
        <Text style={[styles.sectionTitle, { paddingHorizontal: 20, marginTop: 10 }]}>How It Works</Text>
        <View style={styles.howItWorks}>
          {[
            { step: "1", icon: "search", text: "Choose a service" },
            { step: "2", icon: "person", text: "Pick a worker" },
            { step: "3", icon: "calendar", text: "Book & confirm" },
            { step: "4", icon: "checkmark-done", text: "Job done!" },
          ].map((s, i) => (
            <View key={i} style={styles.stepItem}>
              <View style={styles.stepCircle}>
                <Ionicons name={s.icon as any} size={20} color="#FF6B00" />
              </View>
              {i < 3 && <View style={styles.stepLine} />}
              <Text style={styles.stepText}>{s.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0F0F0F" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  greeting: { fontSize: 26, fontWeight: "800", color: "#FFF" },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  locationText: { color: "#888", fontSize: 13, marginLeft: 4 },
  avatarBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#FF6B00", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#FFF", fontSize: 18, fontWeight: "800" },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#1A1A1A", marginHorizontal: 20, borderRadius: 16, paddingHorizontal: 16, marginBottom: 20, borderWidth: 1, borderColor: "#2A2A2A" },
  searchInput: { flex: 1, color: "#FFF", fontSize: 15, paddingVertical: 14, marginLeft: 10 },
  banner: { marginHorizontal: 20, backgroundColor: "#1A1A1A", borderRadius: 24, padding: 24, marginBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#FF6B00" + "40", overflow: "hidden" },
  bannerTag: { color: "#FF6B00", fontSize: 12, fontWeight: "700", marginBottom: 8, letterSpacing: 1 },
  bannerTitle: { fontSize: 26, fontWeight: "900", color: "#FFF", lineHeight: 32, marginBottom: 8 },
  bannerSub: { color: "#888", fontSize: 13 },
  bannerIllustration: { position: "absolute", right: 20, top: 10 },
  statsRow: { flexDirection: "row", marginHorizontal: 20, gap: 10, marginBottom: 28 },
  statCard: { flex: 1, backgroundColor: "#1A1A1A", borderRadius: 16, padding: 14, alignItems: "center", gap: 4, borderWidth: 1, borderColor: "#2A2A2A" },
  statValue: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  statLabel: { color: "#666", fontSize: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: "800", color: "#FFF" },
  sectionCount: { color: "#666", fontSize: 13 },
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyText: { color: "#555", fontSize: 16, marginTop: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, gap: 12 },
  serviceCard: { backgroundColor: "#1A1A1A", borderRadius: 20, padding: 18, width: "47%", borderWidth: 1, borderColor: "#2A2A2A" },
  iconBg: { width: 60, height: 60, borderRadius: 18, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  cardName: { color: "#FFF", fontSize: 16, fontWeight: "700", marginBottom: 10 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardAvail: { color: "#4CAF50", fontSize: 12, fontWeight: "600" },
  howItWorks: { flexDirection: "row", paddingHorizontal: 20, marginTop: 16, marginBottom: 10, alignItems: "flex-start" },
  stepItem: { flex: 1, alignItems: "center", position: "relative" },
  stepCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#1A1A1A", borderWidth: 2, borderColor: "#FF6B00", justifyContent: "center", alignItems: "center", marginBottom: 8 },
  stepLine: { position: "absolute", top: 24, left: "50%", width: "100%", height: 2, backgroundColor: "#FF6B00" + "40" },
  stepText: { color: "#888", fontSize: 12, textAlign: "center", fontWeight: "600" },
});