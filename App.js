import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

WebBrowser.maybeCompleteAuthSession();

const firebaseConfig = {
  apiKey: "AIzaSyAzKz-Q18HOqlK-y8lxiiqT6APdMvvzAWM",
  authDomain: "pi---zygo.firebaseapp.com",
  projectId: "pi---zygo",
  storageBucket: "pi---zygo.appspot.com",
  messagingSenderId: "338709910681",
  appId: "1:338709910681:web:426138cd55bd6fa5065408",
  databaseURL: "https://pi---zygo-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        Alert.alert("Login", `Bem-vindo, ${user.displayName || user.email}`);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "SUA_CLIENT_ID_AQUI.apps.googleusercontent.com",
    androidClientId: "SUA_ANDROID_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = googleProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const user = userCredential.user;
          saveUserToDatabase(user.uid, user.displayName, user.email);
        })
        .catch((error) => Alert.alert("Erro", error.message));
    }
  }, [response]);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert("Sucesso", `Bem-vindo, ${user.email}`);
        saveUserToDatabase(user.uid, null, user.email);
      })
      .catch((error) => Alert.alert("Erro", error.message));
  };

  const saveUserToDatabase = (uid, name, email) => {
    set(ref(db, "users/" + uid), {
      name: name || "Usuário",
      email: email,
    }).catch((error) => Alert.alert("Erro ao salvar no banco", error.message));
  };

  return (
    <View style={styles.container}>
      {!user ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Login com Email" onPress={handleLogin} />
          <Button title="Login com Google" disabled={!request} onPress={() => promptAsync()} />
        </>
      ) : (
        <Button title="Sair" onPress={() => auth.signOut()} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});
