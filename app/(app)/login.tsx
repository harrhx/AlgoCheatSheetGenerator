import useFirebase from '@/hooks/useFirebase';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import
  {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
  } from 'react-native';
import { Button, Checkbox, TextInput } from 'react-native-paper';

export default function LoginScreen()
{
  const { auth, updateFirebaseContext } = useFirebase();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 500;

  async function login()
  {
    try
    {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log('signed in', response);
      updateFirebaseContext();
      if (router.canGoBack())
        router.back();
      else
        router.navigate('/');
    }
    catch (error)
    {
      console.log(error);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Branding Section */}
      <View style={styles.branding}>
        {/* <Image
          source={{
            uri: 'https://i.imgur.com/yjXjx3j.png',
          }}
          style={styles.logo}
          resizeMode="contain"
        /> */}
        <Text style={styles.brandTitle}>AlgoCheatSheet</Text>
        <Text style={styles.subtitle}>
          Your personal AI-powered algorithm learning companion
        </Text>
      </View>

      {/* Card Login Form */}
      <View style={[
        styles.card,
        { width: isSmallScreen ? '95%' : 400 }
      ]}>
        <View style={styles.tab}>
          <Text style={styles.activeTab}>Login</Text>
          <TouchableOpacity onPress={() => { router.replace('/signup') }}>
            <Text style={styles.inactiveTab}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          label="Email"
          value={email}
          mode="outlined"
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={password}
          mode="outlined"
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
        />

        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxRow}>
            <Checkbox
              status={rememberMe ? 'checked' : 'unchecked'}
              onPress={() => setRememberMe(!rememberMe)}
            />
            <Text>Remember me</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained" onPress={login} style={styles.loginButton}>
          Login
        </Button>

        <Text style={styles.orText}>Or continue with</Text>

        <View style={styles.socialButtons}>
          <Button icon="google" mode="outlined" style={styles.socialBtn}>
            Google
          </Button>
          <Button icon="github" mode="outlined" style={styles.socialBtn}>
            GitHub
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 32,
  },
  branding: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5ff',
  },
  brandTitle: {
    fontSize: 26,
    color: '#2563eb',
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'stretch',
  },
  tab: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  activeTab: {
    fontWeight: 'bold',
    marginRight: 20,
    fontSize: 16,
    color: '#2563eb',
  },
  inactiveTab: {
    fontSize: 16,
    color: '#aaa',
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotText: {
    color: '#2563eb',
  },
  loginButton: {
    marginBottom: 16,
    backgroundColor: '#2563eb',
  },
  orText: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#666',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialBtn: {
    flex: 1,
    marginHorizontal: 4,
  },
});