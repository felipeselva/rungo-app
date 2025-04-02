import React from "react";
import { View, Text, Button } from "react-native";
import { auth } from "./firebaseConfig";

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Bem-vindo, {auth.currentUser?.displayName}</Text>
      <Button title="Sair" onPress={() => {
        auth.signOut();
        navigation.replace("Login");
      }} />
    </View>
  );
}
