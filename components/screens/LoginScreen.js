import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "./firebaseConfig";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "769814669483-idq9pj1nhjorg992iu2usf3vmkntcdu1.apps.googleusercontent.com",
    iosClientId: "769814669483-6j6vpc0mm268r4lneq7n6pp5pm6gq98o.apps.googleusercontent.com",
    androidClientId: "769814669483-gflr26nnmm2jq66ehm9fq1nl724bjacq.apps.googleusercontent.com",
    webClientId: "769814669483-idq9pj1nhjorg992iu2usf3vmkntcdu1.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => navigation.replace("Home"))
        .catch((error) => console.error(error));
    }
  }, [response]);

  return (
    <View>
      <Text>Login com Google</Text>
      <Button title="Entrar" onPress={() => promptAsync()} disabled={!request} />
    </View>
  );
}
