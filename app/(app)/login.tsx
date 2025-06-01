import { UserDataType } from '@/components/UserDataProvider';
import useFirebase from '@/hooks/useFirebase';
import { router, useLocalSearchParams } from 'expo-router';
import { GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import { Button, Checkbox, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from './ThemeContext';

// Add this type if not exported from ThemeContext
type ThemeColors = {
  background: string;
  card: string;
  text: string;
  subtext: string;
  accent: string;
  inputBg: string;
  inputBorder: string;
  link: string;
  footerText?: string;
  footerBg?: string;
};

export default function LoginScreen() {
  const params = useLocalSearchParams();
  const { auth, db } = useFirebase();

  // Use global theme context
  const { theme, setTheme, colors } = useThemeContext();
  const themedStyles = useMemo(() => createStyles(colors), [colors]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 500;

  async function login() {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log('signed in', response);
    }
    catch (error) {
      console.log(error);
    }
  }

  async function signInWithGooglePopup() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      const docRef = doc(db, "users", result.user.email ?? 'null');
      const docSnapshot = await getDoc(docRef);
      const docData = docSnapshot.data() as UserDataType;
      const newUserData: UserDataType = docData ?? {
        email,
        name: null,
        createdAt: new Date().getTime(),
        role: 'Student',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        recentSearches: [],
        generatedSheets: [],
      };
      if (docData)
        await updateDoc(docRef, newUserData);
      else
        await setDoc(docRef, newUserData);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      console.log("Google Sign-in successful!", user);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData ? error.customData.email : null;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error("Google Sign-in error:", errorCode, errorMessage, email, credential);
    }
  }

  async function signInWithGithubPopup() {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      const docRef = doc(db, "users", result.user.email ?? 'null');
      const docSnapshot = await getDoc(docRef);
      const docData = docSnapshot.data() as UserDataType;
      const newUserData: UserDataType = docData ?? {
        email,
        name: null,
        createdAt: new Date().getTime(),
        role: 'Student',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        recentSearches: [],
        generatedSheets: [],
      };
      if (docData)
        await updateDoc(docRef, newUserData);
      else
        await setDoc(docRef, newUserData);

      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      console.log("GitHub Sign-in successful!", user);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData ? error.customData.email : null;
      const credential = GithubAuthProvider.credentialFromError(error);
      console.error("GitHub Sign-in error:", errorCode, errorMessage, email, credential);
    }
  }

  useEffect(() => {
    if (auth.currentUser) {
      console.log('User already logged in, redirecting...');
      if (params.topic)
        router.replace({ pathname: '/output', params: { topic: params.topic } });
      else
        router.replace('/');
    }
  }, [auth.currentUser]);

  return (
    <ScrollView
      contentContainerStyle={themedStyles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Theme Toggle Button */}
      <TouchableOpacity
        onPress={() => setTheme(theme === "light" ? "dark" : "light")}
        style={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}
        accessibilityLabel="Toggle theme"
      >
        <Ionicons
          name={theme === "light" ? "moon-outline" : "sunny-outline"}
          size={28}
          color={colors.accent}
        />
      </TouchableOpacity>

      {/* Branding Section */}
      <View style={themedStyles.branding}>
        <Text style={themedStyles.brandTitle}>AlgoCheatSheet</Text>
        <Text style={themedStyles.subtitle}>
          Your personal AI-powered algorithm learning companion
        </Text>
      </View>

      {/* Card Login Form */}
      <View style={[
        themedStyles.card,
        { width: isSmallScreen ? '95%' : 400 }
      ]}>
        <View style={themedStyles.tab}>
          <Text style={themedStyles.activeTab}>Login</Text>
          <TouchableOpacity onPress={() => { router.replace({ pathname: '/signup', params }) }}>
            <Text style={themedStyles.inactiveTab}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          label="Email"
          value={email}
          mode="outlined"
          onChangeText={setEmail}
          style={themedStyles.input}
          theme={{
            colors: {
              background: colors.inputBg,
              text: colors.text,
              primary: colors.accent,
              placeholder: colors.subtext,
              outline: colors.inputBorder,
            }
          }}
        />

        <TextInput
          label="Password"
          value={password}
          mode="outlined"
          secureTextEntry
          onChangeText={setPassword}
          style={themedStyles.input}
          theme={{
            colors: {
              background: colors.inputBg,
              text: colors.text,
              primary: colors.accent,
              placeholder: colors.subtext,
              outline: colors.inputBorder,
            }
          }}
        />

        <View style={themedStyles.checkboxContainer}>
          <View style={themedStyles.checkboxRow}>
            <Checkbox
              status={rememberMe ? 'checked' : 'unchecked'}
              color={colors.accent}
              onPress={() => setRememberMe(!rememberMe)}
              uncheckedColor={colors.subtext}
            />
            <Text style={{ color: colors.text }}>Remember me</Text>
          </View>
          <TouchableOpacity>
            <Text style={{ color: colors.link }}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained" onPress={login} style={themedStyles.loginButton}
          labelStyle={{ color: "#fff", fontWeight: "bold" }}
        >
          Login
        </Button>

        <Text style={themedStyles.orText}>Or continue with</Text>

        <View style={themedStyles.socialButtons}>
          <Button icon="google" mode="outlined" style={themedStyles.socialBtn} onPress={signInWithGooglePopup}
            labelStyle={{ color: colors.text }}>
            Google
          </Button>
          <Button icon="github" mode="outlined" style={themedStyles.socialBtn} onPress={signInWithGithubPopup}
            labelStyle={{ color: colors.text }}>
            GitHub
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

// Themed styles factory with explicit type
function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingVertical: 32,
    },
    branding: {
      alignItems: 'center',
      marginBottom: 24,
    },
    brandTitle: {
      fontSize: 26,
      color: colors.accent,
      fontWeight: 'bold',
      marginBottom: 6,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: colors.accent,
      textAlign: 'center',
      marginBottom: 4,
    },
    card: {
      backgroundColor: colors.card,
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
      color: colors.accent,
    },
    inactiveTab: {
      fontSize: 16,
      color: colors.subtext,
    },
    input: {
      marginBottom: 12,
      backgroundColor: colors.inputBg,
      color: colors.text,
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
    loginButton: {
      marginBottom: 16,
      backgroundColor: colors.accent,
    },
    orText: {
      textAlign: 'center',
      marginBottom: 12,
      color: colors.subtext,
    },
    socialButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    socialBtn: {
      flex: 1,
      marginHorizontal: 4,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBg,
    },
  });
}
