import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

export default function BookingScreen() {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [issue, setIssue] = useState("");

  const handleBooking = () => {
    Alert.alert(
      "Booking Confirmed 🎉",
      "Your service booking has been submitted."
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book Service</Text>

      <TextInput
        placeholder="Enter Address"
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        placeholder="Preferred Date"
        style={styles.input}
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        placeholder="Describe your issue"
        style={[styles.input, { height: 120 }]}
        multiline
        value={issue}
        onChangeText={setIssue}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleBooking}
      >
        <Text style={styles.buttonText}>
          Confirm Booking
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 25,
    color: "#222",
  },

  input: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  button: {
    backgroundColor: "#27ae60",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});