import useFirebase from "@/hooks/useFirebase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { useThemeContext } from "./ThemeContext";

type ThemeColors = {
  background: string;
  card: string;
  text: string;
  subtext: string;
  accent: string;
  inputBg: string;
  inputBorder: string;
  link: string;
  footerText: string;
  footerBg?: string;
};

// Make sure these match your ThemeContext
const LIGHT_COLORS: ThemeColors = {
  background: "#f9fafb",
  card: "#fff",
  text: "#222",
  subtext: "#6b7280",
  accent: "#2563eb",
  inputBg: "#fff",
  inputBorder: "#e5e5e5",
  link: "#2563eb",
  footerText: "#a1a1aa",
  footerBg: "#111827",
};
const DARK_COLORS: ThemeColors = {
  background: "#18181b",
  card: "#23232b",
  text: "#f3f4f6",
  subtext: "#a1a1aa",
  accent: "#60a5fa",
  inputBg: "#23232b",
  inputBorder: "#333",
  link: "#60a5fa",
  footerText: "#6b7280",
  footerBg: "#030712",
};

export default function HomePage() {
  const { auth } = useFirebase();
  const [topicInput, setTopicInput] = useState("");

  const { theme, setTheme, colors } = useThemeContext();
  const themedStyles = useMemo(() => createStyles(colors), [colors]);

  // Animation setup
  const animation = useRef(new Animated.Value(theme === "light" ? 0 : 1)).current;
  const bgColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [LIGHT_COLORS.background, DARK_COLORS.background],
  });

  useEffect(() => {
    Animated.timing(animation, {
      toValue: theme === "light" ? 0 : 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [theme]);

  const handleGenerate = () => {
    if (!topicInput.trim()) {
      Alert.alert("Topic Required", "Please enter an algorithm topic.");
      return;
    }
    if (!auth.currentUser) {
      return router.navigate({
        pathname: "/login",
        params: { topic: topicInput.trim() },
      });
    }
    router.navigate({
      pathname: "/output",
      params: { topic: topicInput.trim() },
    });
  };

  const handlePopularSearch = (topic: string) => {
    setTopicInput(topic);
  };

  return (
    <Animated.View style={[themedStyles.wrapper, { backgroundColor: bgColor }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={themedStyles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView contentContainerStyle={themedStyles.scrollContent}>
            <View style={themedStyles.header}>
              <View style={themedStyles.headerLeft}>
                <Ionicons
                  name="code-slash-outline"
                  size={24}
                  color={colors.accent}
                  style={{ marginRight: 8 }}
                />
                <Text style={themedStyles.logoText}>AlgoCheatSheet</Text>
              </View>
              {auth.currentUser ? (
                <View style={themedStyles.headerRight}>
                  <TouchableOpacity
                    onPress={() => setTheme(theme === "light" ? "dark" : "light")}
                    style={{ marginRight: 10 }}
                    accessibilityLabel="Toggle theme"
                  >
                    <Ionicons
                      name={theme === "light" ? "moon-outline" : "sunny-outline"}
                      size={28}
                      color={colors.accent}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.navigate("/account")}>
                    <Ionicons
                      name="person-circle-outline"
                      size={35}
                      color={colors.footerText}
                      style={{ transform: [{ scale: 1.2 }], marginRight: 0 }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={themedStyles.authButtons}>
                  <TouchableOpacity
                    style={themedStyles.ghostButton}
                    onPress={() => router.navigate("/login")}
                  >
                    <Text style={themedStyles.ghostButtonText}>Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={themedStyles.primaryButton}
                    onPress={() => router.navigate("/signup")}
                  >
                    <Text style={themedStyles.primaryButtonText}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={themedStyles.hero}>
              <Text style={themedStyles.heroTitle}>
                Your Personal Algorithm Cheat Sheet Generator
              </Text>
              <Text style={themedStyles.heroSubtitle}>
                Master algorithms with personalized cheat sheets tailored to your
                learning needs
              </Text>

              <View style={themedStyles.searchBar}>
                <TextInput
                  placeholder="Search for an algorithm"
                  style={[
                    themedStyles.input,
                    { backgroundColor: colors.inputBg, color: colors.text },
                  ]}
                  placeholderTextColor={colors.subtext}
                  value={topicInput}
                  onChangeText={setTopicInput}
                  onSubmitEditing={handleGenerate}
                  returnKeyType="search"
                  blurOnSubmit={true}
                />
                <TouchableOpacity
                  style={themedStyles.searchButton}
                  onPress={handleGenerate}
                >
                  <Text style={themedStyles.searchButtonText}>Generate</Text>
                </TouchableOpacity>
              </View>
              <Text style={themedStyles.popularSearch}>Popular searches:</Text>
              <View style={themedStyles.linksRow}>
                {[
                  "Binary Search Trees",
                  "Dynamic Programming",
                  "Graph Algorithms",
                ].map((topic) => (
                  <TouchableOpacity
                    key={topic}
                    onPress={() => handlePopularSearch(topic)}
                  >
                    <Text style={[themedStyles.link, { color: colors.link }]}>
                      {topic}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={themedStyles.features}>
              <View style={themedStyles.card}>
                <Text style={themedStyles.icon}>📍</Text>
                <Text style={themedStyles.cardTitle}>Personalized Learning</Text>
                <Text style={themedStyles.cardText}>
                  Get customized cheat sheets that match your learning style and
                  pace
                </Text>
              </View>
              <View style={themedStyles.card}>
                <Text style={themedStyles.icon}>💻</Text>
                <Text style={themedStyles.cardTitle}>Sample Problems</Text>
                <Text style={themedStyles.cardText}>
                  Practice with real-world examples and solution templates
                </Text>
              </View>
              <View style={themedStyles.card}>
                <Text style={themedStyles.icon}>🛡️</Text>
                <Text style={themedStyles.cardTitle}>Mistake Prevention</Text>
                <Text style={themedStyles.cardText}>
                  Learn common pitfalls and how to avoid them effectively
                </Text>
              </View>
            </View>
            <View style={themedStyles.features}>
              <View style={themedStyles.card}>
                <Text style={themedStyles.icon}>🚀</Text>
                <Text style={themedStyles.cardTitle}>Fast Generation</Text>
                <Text style={themedStyles.cardText}>
                  Generate cheat sheets instantly with AI-powered algorithms
                </Text>
              </View>
              <View style={themedStyles.card}>
                <Text style={themedStyles.icon}>🎯</Text>
                <Text style={themedStyles.cardTitle}>Focused Topics</Text>
                <Text style={themedStyles.cardText}>
                  Zero in on specific algorithms or data structures for targeted
                  learning
                </Text>
              </View>
              <View style={themedStyles.card}>
                <Text style={themedStyles.icon}>🔒</Text>
                <Text style={themedStyles.cardTitle}>Data Privacy</Text>
                <Text style={themedStyles.cardText}>
                  Your learning data stays private and secure with us
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={themedStyles.footer}>
            <Text style={themedStyles.footerCopyright}>
              © 2025 AlgoCheatSheet. All rights reserved.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Animated.View>
  );
}

// Themed styles factory with explicit type
function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrapper: {
      flex: 1,
      // backgroundColor will be animated
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    header: {
      backgroundColor: colors.card,
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerLeft: { flexDirection: "row", alignItems: "center" },
    headerRight: { flexDirection: "row", alignItems: "center" },
    logoText: { fontSize: 20, fontWeight: "bold", color: colors.accent },
    avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
    headerUserName: { fontWeight: "500", color: colors.text },
    logo: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.accent,
    },
    authButtons: {
      flexDirection: "row",
    },
    ghostButton: {
      marginRight: 8,
      padding: 8,
    },
    ghostButtonText: {
      color: colors.accent,
      fontWeight: "bold",
    },
    primaryButton: {
      backgroundColor: colors.accent,
      borderRadius: 6,
      padding: 8,
    },
    primaryButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    hero: {
      padding: 20,
      alignItems: "center",
    },
    heroTitle: {
      fontSize: 25,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 8,
      color: colors.text,
    },
    heroSubtitle: {
      color: colors.subtext,
      textAlign: "center",
      marginBottom: 16,
    },
    searchBar: {
      flexDirection: "row",
      backgroundColor: colors.inputBg,
      borderRadius: 25,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 3,
      width: "100%",
      maxWidth: 400,
      alignItems: "center",
      marginBottom: 12,
    },
    input: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      color: colors.text,
    },
    searchButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderTopRightRadius: 25,
      borderBottomRightRadius: 25,
    },
    searchButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    popularSearch: {
      fontWeight: "600",
      marginTop: 12,
      marginBottom: 8,
      color: colors.text,
    },
    linksRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 10,
    },
    link: {
      color: colors.link,
      marginHorizontal: 6,
      marginBottom: 4,
    },
    features: {
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 16,
      flexWrap: "wrap",
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      elevation: 2,
      flex: 1,
      minWidth: 300,
      maxWidth: "30%",
      minHeight: 150,
      maxHeight: 300,
      marginBottom: 16,
    },
    icon: {
      fontSize: 24,
      marginBottom: 8,
      color: colors.accent,
    },
    cardTitle: {
      fontWeight: "bold",
      fontSize: 16,
      marginBottom: 4,
      color: colors.text,
    },
    cardText: {
      color: colors.subtext,
      fontSize: 14,
    },
    footer: {
      backgroundColor: colors.footerBg,
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 6,
    },
    footerCopyright: {
      color: colors.footerText,
      fontSize: 12,
      fontWeight: "bold",
      letterSpacing: 0.2,
    },
    footerText: {
      color: "#fff",
      fontWeight: "bold",
      marginBottom: 8,
    },
    footerLink: {
      color: "#9ca3af",
      marginHorizontal: 8,
    },
  });
}
