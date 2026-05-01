import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { useEffect, useState } from "react";

import { router } from "expo-router";

import axios from "axios";

export default function HomeScreen() {

  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {

    try {

      const response = await axios.get(
        "http://192.168.0.108:8080/api/services"
      );

      setServices(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.greeting}>Hello Sathish 👋</Text>

        <Text style={styles.subtitle}>
          Find nearby service professionals
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="gray" />

        <TextInput
          placeholder="Search services..."
          style={styles.searchInput}
        />
      </View>

      <Text style={styles.sectionTitle}>Popular Services</Text>

      <View style={styles.servicesContainer}>

        {services.map((service) => (

          <TouchableOpacity
            key={service.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/workers/[id]",
                params: { id: service.id.toString() },
              })
            }
          >

            <MaterialIcons
              name="home-repair-service"
              size={40}
              color="#27ae60"
            />

            <Text style={styles.cardText}>
              {service.name}
            </Text>

          </TouchableOpacity>
        ))}

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    paddingHorizontal: 16,
  },

  header: {
    marginTop: 60,
    marginBottom: 20,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 6,
  },

  searchContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 55,
    marginBottom: 24,
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
  },

  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 18,
    paddingVertical: 28,
    alignItems: "center",
    marginBottom: 16,
  },

  cardText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});