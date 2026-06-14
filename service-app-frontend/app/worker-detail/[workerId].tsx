import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const FAKE_REVIEWS = [
  { name: "Ravi K.", rating: 5, comment: "Excellent work! Very professional and on time.", time: "2 days ago" },
  { name: "Priya M.", rating: 4, comment: "Good service, fixed the issue quickly.", time: "1 week ago" },
  { name: "Arjun S.", rating: 5, comment: "Highly recommend! Great attitude and clean work.", time: "2 weeks ago" },
];

export default function WorkerDetailScreen() {
  const {
    workerId, workerName, distance, eta,
    serviceId, serviceName,
  } = useLocalSearchParams<{
    workerId: string; workerName: string; distance: string;
    eta: string; serviceId: string; serviceName: string;
  }>();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"about" | "reviews">("about");

  const initials = workerName?.split(" ").map(n => n[0]).join("").toUpperCase() ?? "W";

 const handleBook = () => {
   console.log("BOOK NOW CLICKED");

   router.push({
     pathname: "/booking",
     params: {
       workerId,
       workerName,
       distance,
       eta,
       serviceName,
     },
   });
 };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />

      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={22} color="#FFF" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
          </View>

          <Text style={styles.workerName}>{workerName}</Text>
          <Text style={styles.serviceName}>{serviceName} Specialist</Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={14} color="#4CAF50" />
              <Text style={[styles.badgeText, { color: "#4CAF50" }]}>Verified</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={[styles.badgeText, { color: "#FFD700" }]}>4.8 Rating</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="briefcase" size={14} color="#FF6B00" />
              <Text style={[styles.badgeText, { color: "#FF6B00" }]}>3 yrs exp</Text>
            </View>
          </View>
        </View>

        {/* Quick Info Cards */}
        <View style={styles.quickInfo}>
          {[
            { icon: "location", label: "Distance", value: `${distance} km`, color: "#FF6B00" },
            { icon: "time", label: "ETA", value: eta, color: "#00B4D8" },
            { icon: "checkmark-done-circle", label: "Jobs Done", value: "120+", color: "#4CAF50" },
            { icon: "heart", label: "Liked by", value: "96%", color: "#E040FB" },
          ].map((item, i) => (
            <View key={i} style={styles.quickCard}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
              <Text style={styles.quickValue}>{item.value}</Text>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "about" && styles.tabActive]}
            onPress={() => setActiveTab("about")}
          >
            <Text style={[styles.tabText, activeTab === "about" && styles.tabTextActive]}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "reviews" && styles.tabActive]}
            onPress={() => setActiveTab("reviews")}
          >
            <Text style={[styles.tabText, activeTab === "reviews" && styles.tabTextActive]}>Reviews (3)</Text>
          </TouchableOpacity>
        </View>

        {activeTab === "about" ? (
          <View style={styles.section}>
            {/* Skills */}
            <Text style={styles.sectionTitle}>Skills & Expertise</Text>
            <View style={styles.skillsRow}>
              {["Wiring", "Installation", "Repair", "Maintenance", "Inspection"].map((skill, i) => (
                <View key={i} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>

            {/* What's included */}
            <Text style={styles.sectionTitle}>What's Included</Text>
            {[
              "Free visit & diagnosis",
              "Spare parts on request",
              "1-month service warranty",
              "Clean & safe work guarantee",
            ].map((item, i) => (
              <View key={i} style={styles.includeRow}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                <Text style={styles.includeText}>{item}</Text>
              </View>
            ))}

            {/* Safety */}
            <Text style={styles.sectionTitle}>Safety</Text>
            <View style={styles.safetyCard}>
              <Ionicons name="shield-checkmark" size={28} color="#4CAF50" />
              <View style={{ flex: 1 }}>
                <Text style={styles.safetyTitle}>Background Verified</Text>
                <Text style={styles.safetySubtitle}>ID proof and police verification done</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            {FAKE_REVIEWS.map((review, i) => (
              <View key={i} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{review.name[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <View style={{ flexDirection: "row", gap: 2 }}>
                      {[1,2,3,4,5].map(s => (
                        <Ionicons key={s} name={s <= review.rating ? "star" : "star-outline"} size={12} color="#FFD700" />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewTime}>{review.time}</Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bookFooter}>
        <View>
          <Text style={styles.footerLabel}>Available Now</Text>
          <Text style={styles.footerEta}>Arrives in {eta}</Text>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
          <Text style={styles.bookBtnText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0F0F0F" },
  backBtn: { position: "absolute", top: 56, left: 20, zIndex: 10, width: 40, height: 40, backgroundColor: "#1A1A1A", borderRadius: 20, justifyContent: "center", alignItems: "center" },
  profileHeader: { alignItems: "center", paddingTop: 100, paddingBottom: 24, paddingHorizontal: 20 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#FF6B00" + "30", justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "#FF6B00" },
  avatarText: { fontSize: 36, fontWeight: "900", color: "#FF6B00" },
  onlineIndicator: { position: "absolute", top: 160, right: "37%", width: 22, height: 22, backgroundColor: "#0F0F0F", borderRadius: 11, justifyContent: "center", alignItems: "center" },
  onlineDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#4CAF50" },
  workerName: { fontSize: 26, fontWeight: "900", color: "#FFF", marginTop: 14, marginBottom: 4 },
  serviceName: { color: "#888", fontSize: 15 },
  badgeRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  badge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#1A1A1A", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "#2A2A2A" },
  badgeText: { fontSize: 13, fontWeight: "600" },
  quickInfo: { flexDirection: "row", marginHorizontal: 20, gap: 10, marginBottom: 20 },
  quickCard: { flex: 1, backgroundColor: "#1A1A1A", borderRadius: 16, padding: 12, alignItems: "center", gap: 4, borderWidth: 1, borderColor: "#2A2A2A" },
  quickValue: { color: "#FFF", fontSize: 14, fontWeight: "800" },
  quickLabel: { color: "#666", fontSize: 11 },
  tabs: { flexDirection: "row", marginHorizontal: 20, backgroundColor: "#1A1A1A", borderRadius: 14, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 12 },
  tabActive: { backgroundColor: "#FF6B00" },
  tabText: { color: "#666", fontWeight: "700", fontSize: 14 },
  tabTextActive: { color: "#FFF" },
  section: { paddingHorizontal: 20, gap: 16 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#FFF", marginBottom: 4 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillChip: { backgroundColor: "#FF6B00" + "20", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: "#FF6B00" + "40" },
  skillText: { color: "#FF6B00", fontSize: 13, fontWeight: "600" },
  includeRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  includeText: { color: "#CCC", fontSize: 14 },
  safetyCard: { backgroundColor: "#1A1A1A", borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, borderWidth: 1, borderColor: "#4CAF50" + "30" },
  safetyTitle: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  safetySubtitle: { color: "#666", fontSize: 13, marginTop: 2 },
  reviewCard: { backgroundColor: "#1A1A1A", borderRadius: 16, padding: 16, gap: 10, borderWidth: 1, borderColor: "#2A2A2A" },
  reviewHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  reviewAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#FF6B00" + "30", justifyContent: "center", alignItems: "center" },
  reviewAvatarText: { color: "#FF6B00", fontWeight: "700" },
  reviewName: { color: "#FFF", fontWeight: "700", fontSize: 14, marginBottom: 3 },
  reviewTime: { color: "#555", fontSize: 12 },
  reviewComment: { color: "#AAA", fontSize: 14, lineHeight: 20 },
  bookFooter: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#1A1A1A", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 36, borderTopWidth: 1, borderTopColor: "#2A2A2A" },
  footerLabel: { color: "#4CAF50", fontWeight: "700", fontSize: 14 },
  footerEta: { color: "#666", fontSize: 13 },
  bookBtn: { backgroundColor: "#FF6B00", flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 16 },
  bookBtnText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
});