import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useLocalSearchParams } from "expo-router";

import { useEffect, useState } from "react";

import axios from "axios";

export default function WorkersScreen() {

  const { id } = useLocalSearchParams();

  const [workers, setWorkers] = useState<any[]>([]);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {

    try {

      const response = await axios.get(
        `https://o-leak-backend.onrender.com/api/workers/nearby?serviceId=${id}&latitude=12.9716&longitude=77.5946`
      );

      setWorkers(response.data);

    } catch (error) {

      console.log(error);
    }
  };

const bookWorker = async (workerId: number) => {

  try {

    const response = await axios.post(
      "http://https://o-leak-backend.onrender.com/api/bookings",
      {
        customerName: "Sathish",
        customerPhone: "9876543210",
        address: "Chennai",
        workerId: workerId,
      }
    );

    Alert.alert(
      "Success",
      response.data
    );

  } catch (error) {

    console.log(error);

    Alert.alert(
      "Error",
      "Booking Failed"
    );
  }
};


  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Nearby Workers
      </Text>

      <FlatList
        data={workers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.name}>
              {item.fullName}
            </Text>

            <Text style={styles.info}>
              {item.experience}
            </Text>

            <Text style={styles.rating}>
              ⭐ {item.rating}
            </Text>

            <TouchableOpacity style={styles.button}
              onPress={() => bookWorker(item.id)}>
              <Text style={styles.buttonText}>
                Book Now
              </Text>
            </TouchableOpacity>

          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 16,
    paddingTop: 60,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
  },

  info: {
    marginTop: 8,
    color: "#555",
  },

  rating: {
    marginTop: 8,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#27ae60",
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});