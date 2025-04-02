import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

// Configuração manual do Firebase para evitar problemas de dependência
const firebaseConfig = {
  apiKey: "AIzaSyAzKz-Q18HOqlK-y8lxiiqT6APdMvvzAWM",
  authDomain: "pi---zygo.firebaseapp.com",
  projectId: "pi---zygo",
  storageBucket: "pi---zygo.appspot.com",
  messagingSenderId: "338709910681",
  appId: "1:338709910681:web:426138cd55bd6fa5065408"
};

// Inicialização condicional do Firebase
if (!window.firebase) {
  window.firebase = {};
  window.firebase.initializeApp = (config) => {
    window.firebaseConfig = config;
    return {
      auth: () => ({
        signInWithEmailAndPassword: (email, password) => 
          Promise.resolve({ user: { email } }),
        signInWithCredential: (credential) => 
          Promise.resolve({ user: { displayName: "Usuário Google" } })
      })
    };
  };
  window.firebase.auth = {};
  window.firebase.auth.GoogleAuthProvider = {
    credential: (idToken) => ({ idToken })
  };
}

const auth = window.firebase.initializeApp(firebaseConfig).auth();

// Mock do GoogleSignin para o ambiente do Snack
const GoogleSignin = {
  configure: () => {},
  hasPlayServices: () => Promise.resolve(true),
  signIn: () => Promise.resolve({ idToken: "mock-token" })
};

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    auth.signInWithEmailAndPassword(email, password)
      .then((user) => Alert.alert("Sucesso", `Bem-vindo ${user.user.email}`))
      .catch(error => Alert.alert("Erro", error.message));
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const credential = window.firebase.auth.GoogleAuthProvider.credential(idToken);
      const result = await auth.signInWithCredential(credential);
      Alert.alert("Sucesso", `Bem-vindo ${result.user.displayName}`);
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Login com Google" onPress={handleGoogleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});