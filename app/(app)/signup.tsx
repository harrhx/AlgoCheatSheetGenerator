import { UserDataContextType } from '@/components/UserDataProvider';
import useFirebase from '@/hooks/useFirebase';
import { router, useLocalSearchParams } from 'expo-router';
import { createUserWithEmailAndPassword, getRedirectResult, GoogleAuthProvider, signInWithEmailAndPassword, signInWithRedirect } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
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

export default function SignUpScreen()
{
  const params = useLocalSearchParams();
  const { auth, db } = useFirebase();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Confirmpassword, setConfirmpassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 500;

  async function signUp()
  {
    try
    {
      let response = await createUserWithEmailAndPassword(auth, email, password);
      console.log('created', response);

      const newUserData: UserDataContextType['userData'] =
      {
        email,
        name: null,
        createdAt: new Date().toDateString(),
        role: 'Student', // Default role, can be changed later
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        recentSearches: [],
        generatedSheets: [],
      };
      const docRef = await setDoc(doc(db, 'users', email), newUserData);

      response = await signInWithEmailAndPassword(auth, email, password);
      console.log('signed in', response);
    }
    catch (error)
    {
      console.log(error);
    }
  }

  // Call this function when your app loads, to handle the redirect result
  async function handleGoogleRedirectResult()
  {
    try
    {
      console.log('Auth', auth);
      const result = await getRedirectResult(auth);
      console.log("Google redirect result:", result);
      if (result)
      {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("Google Redirect Sign-in successful!", user);
        // Redirect or update UI as needed
      }
    } catch (error: any)
    {
      console.error("Error handling Google redirect result:", error);
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData ? error.customData.email : null;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error("Google Redirect Sign-in error:", errorCode, errorMessage, email, credential);
    }
  }

  // Call this function when the user clicks a sign-in button
  async function signInWithGoogleRedirect()
  {
    const provider = new GoogleAuthProvider();
    try
    {
      await signInWithRedirect(auth, provider);
      // No code here, the page will redirect to Google.
    } catch (error)
    {
      console.error("Error initiating Google redirect sign-in:", error);
    }
  }

  useEffect(() =>
  {
    if (auth.currentUser)
    {
      console.log('User already logged in, redirecting...');
      if (params.topic)
        router.replace({ pathname: '/loadingScreen', params: { topic: params.topic } });
      else
        router.replace('/');
    }
  }
    , [auth.currentUser]);

  useEffect(() =>
  {
    // Handle the Google redirect result when the component mounts
    handleGoogleRedirectResult();
  }
    , []);

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
          <TouchableOpacity onPress={() => { router.replace({ pathname: '/login', params }) }}>
            <Text style={styles.inactiveTab}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.activeTab}>Sign Up</Text>
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

        <TextInput
          label="Confirm Password"
          value={Confirmpassword}
          mode="outlined"
          secureTextEntry
          onChangeText={setConfirmpassword}
          style={styles.input}
        />

        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxRow}>
            <Checkbox
              status={rememberMe ? 'checked' : 'unchecked'}
              color='#2563eb'
              onPress={() => setRememberMe(!rememberMe)}
            />
            <Text>Remember me</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained" onPress={signUp} style={styles.loginButton}>
          Sign Up
        </Button>

        <Text style={styles.orText}>Or continue with</Text>

        <View style={styles.socialButtons}>
          <Button icon="google" mode="outlined" style={styles.socialBtn} onPress={signInWithGoogleRedirect}>
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
    fontSize: 16,
    color: '#2563eb',
    paddingHorizontal: 8,
  },
  inactiveTab: {
    fontSize: 16,
    color: '#aaa',
    paddingHorizontal: 8,
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