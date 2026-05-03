import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Location from "expo-location";
import api from "@/utils/api";

export default function WorkersScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchNearbyWorkers();
  }, []);

  const fetchNearbyWorkers = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      let latitude = 13.0827; // Default: Chennai
      let longitude = 80.2707;

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;
      }

      const res = await api.get("/api/workers/nearby", {
        params: { serviceId: id, latitude, longitude },
      });
      setWorkers(res.data);
    } catch (e) {
      console.log("Failed to fetch workers:", e);
      Alert.alert("Error", "Could not load workers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={{ marginTop: 12, color: "#6b7280" }}>Finding nearby workers...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>

      <Text style={styles.title}>{name ?? "Professionals"}</Text>

      {workers.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="person-outline" size={60} color="#d1d5db" />
          <Text style={styles.emptyText}>No workers available nearby</Text>
          <Text style={styles.emptySubText}>Try again later or expand your search area</Text>
        </View>
      ) : (
        workers.map((worker) => (
          <View key={worker.id} style={styles.card}>
            <Image
              source={{ uri: `https://randomuser.me/api/portraits/men/${(worker.id % 70) + 1}.jpg` }}
              style={styles.image}
            />

            <View style={styles.infoContainer}>
              <Text style={styles.name}>{worker.fullName}</Text>
              <Text style={styles.profession}>{worker.serviceCategory?.name}</Text>

              <View style={styles.row}>
                <Ionicons name="star" size={16} color="#f1c40f" />
                <Text style={styles.rating}>{worker.rating?.toFixed(1) ?? "New"}</Text>
                <Text style={styles.experience}>• {worker.experience} Exp</Text>
              </View>

              <Text
                style={[styles.status, { color: worker.available ? "#10b981" : "#ef4444" }]}
              >
                {worker.available ? "● Available Now" : "● Currently Busy"}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.bookBtn, !worker.available && styles.bookBtnDisabled]}
              disabled={!worker.available}
              onPress={() =>
                router.push({
                  pathname: "/booking",
                  params: {
                    workerId: worker.id.toString(),
                    workerName: worker.fullName,
                  },
                })
              }
            >
              <Text style={styles.bookText}>
                {worker.available ? "Book" : "Busy"}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", padding: 18 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 100 },
  backBtn: { marginTop: 50, marginBottom: 4, width: 40 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#222" },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#374151", marginTop: 16 },
  emptySubText: { color: "#6b7280", marginTop: 8, textAlign: "center" },
  card: {
    backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 18,
    flexDirection: "row", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 5, elevation: 3,
  },
  image: { width: 72, height: 72, borderRadius: 36, marginRight: 14 },
  infoContainer: { flex: 1 },
  name: { fontSize: 17, fontWeight: "bold", color: "#222" },
  profession: { color: "#6b7280", marginTop: 2, fontSize: 13 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  rating: { marginLeft: 4, fontWeight: "600", fontSize: 13 },
  experience: { color: "#6b7280", marginLeft: 4, fontSize: 13 },
  status: { marginTop: 6, fontWeight: "600", fontSize: 13 },
  bookBtn: {
    backgroundColor: "#111827", paddingHorizontal: 14,
    paddingVertical: 10, borderRadius: 12,
  },
  bookBtnDisabled: { backgroundColor: "#d1d5db" },
  bookText: { color: "white", fontWeight: "700", fontSize: 13 },
});