import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
 TextInput,
  Image,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [services, setServices] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "https://o-leak-backend.onrender.com/api/services"
      );

      setServices(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getIcon = (name: string): any => {
    switch (name.toLowerCase()) {
      case "electrician":
        return "flash";

      case "plumber":
        return "water";

      case "painter":
        return "color-palette";

      case "carpenter":
        return "hammer";

      case "ac repair":
        return "snow";

      default:
        return "construct";
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello Sathish 👋</Text>

        <Text style={styles.subText}>
          Find nearby service professionals
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" />

        <TextInput
          placeholder="Search services..."
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
        />
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>
          Book Trusted Home Services
        </Text>

        <Text style={styles.bannerSubtitle}>
          Fast • Reliable • Affordable
        </Text>
      </View>

      {/* Services */}
      <Text style={styles.sectionTitle}>Popular Services</Text>

      <View style={styles.servicesContainer}>
        {services.map((item: any) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/workers/[id]",
                params: { id: item.id.toString() },
              })
            }
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={getIcon(item.name)}
                size={28}
                color="#111827"
              />
            </View>

            <Text style={styles.cardTitle}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Top Professionals */}
      <Text style={styles.sectionTitle}>
        Top Professionals
      </Text>

      <View style={styles.workerCard}>
        <Image
          source={{
            uri: "https://randomuser.me/api/portraits/men/32.jpg",
          }}
          style={styles.workerImage}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.workerName}>
            Arun Kumar
          </Text>

          <Text style={styles.workerJob}>
            Electrician
          </Text>

          <View style={styles.ratingRow}>
            <Ionicons
              name="star"
              size={16}
              color="#facc15"
            />

            <Text style={styles.ratingText}>
              4.8 • 5 Years Exp
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.bookBtn}>
          <Text style={styles.bookBtnText}>
            Book
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 18,
  },

  header: {
    marginTop: 60,
  },

  greeting: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
  },

  subText: {
    color: "#6b7280",
    marginTop: 6,
    fontSize: 15,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingHorizontal: 15,
    marginTop: 25,
    height: 58,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },

  banner: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 24,
    marginTop: 25,
  },

  bannerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },

  bannerSubtitle: {
    color: "#d1d5db",
    marginTop: 10,
    fontSize: 15,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 32,
    marginBottom: 18,
    color: "#111827",
  },

  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "#ffffff",
    width: "48%",
    borderRadius: 24,
    paddingVertical: 30,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },

  iconContainer: {
    backgroundColor: "#f3f4f6",
    padding: 18,
    borderRadius: 50,
  },

  cardTitle: {
    marginTop: 14,
    fontWeight: "600",
    fontSize: 16,
    color: "#111827",
  },

  workerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },

  workerImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 15,
  },

  workerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  workerJob: {
    color: "#6b7280",
    marginTop: 4,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  ratingText: {
    marginLeft: 5,
    color: "#4b5563",
  },

  bookBtn: {
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 14,
  },

  bookBtnText: {
    color: "white",
    fontWeight: "700",
  },
});