import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function WorkersScreen() {
  const router = useRouter();

  const workers = [
    {
      id: 1,
      name: "Arun Kumar",
      profession: "Electrician",
      rating: 4.8,
      experience: "5 Years",
      price: "₹399/service",
      location: "2 km away",
      available: true,
      image:
        "https://randomuser.me/api/portraits/men/32.jpg",
    },

    {
      id: 2,
      name: "Rahul Sharma",
      profession: "Electrician",
      rating: 4.7,
      experience: "3 Years",
      price: "₹299/service",
      location: "4 km away",
      available: true,
      image:
        "https://randomuser.me/api/portraits/men/45.jpg",
    },

    {
      id: 3,
      name: "Vijay Kumar",
      profession: "Electrician",
      rating: 4.9,
      experience: "7 Years",
      price: "₹499/service",
      location: "1 km away",
      available: false,
      image:
        "https://randomuser.me/api/portraits/men/55.jpg",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Available Professionals</Text>

      {workers.map((worker) => (
        <View key={worker.id} style={styles.card}>
          <Image
            source={{ uri: worker.image }}
            style={styles.image}
          />

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{worker.name}</Text>

            <Text style={styles.profession}>
              {worker.profession}
            </Text>

            <View style={styles.row}>
              <Ionicons
                name="star"
                size={16}
                color="#f1c40f"
              />

              <Text style={styles.rating}>
                {worker.rating}
              </Text>

              <Text style={styles.experience}>
                • {worker.experience} Exp
              </Text>
            </View>

            <View style={styles.row}>
              <Ionicons
                name="location"
                size={15}
                color="#777"
              />

              <Text style={styles.location}>
                {worker.location}
              </Text>
            </View>

            <Text style={styles.price}>
              {worker.price}
            </Text>

            <Text
              style={[
                styles.status,
                {
                  color: worker.available
                    ? "#27ae60"
                    : "red",
                },
              ]}
            >
              {worker.available
                ? "Available Now"
                : "Currently Busy"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => router.push("/booking")}
          >
            <Text style={styles.bookText}>
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 18,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 20,
    color: "#222",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 18,
  },

  infoContainer: {
    marginTop: 15,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },

  profession: {
    color: "#666",
    marginTop: 4,
    fontSize: 15,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  rating: {
    marginLeft: 5,
    fontWeight: "600",
  },

  experience: {
    color: "#666",
    marginLeft: 6,
  },

  location: {
    marginLeft: 5,
    color: "#666",
  },

  price: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "bold",
    color: "#27ae60",
  },

  status: {
    marginTop: 6,
    fontWeight: "600",
  },

  bookBtn: {
    marginTop: 18,
    backgroundColor: "#27ae60",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  bookText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});