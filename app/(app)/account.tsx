import useFirebase from "@/hooks/useFirebase";
import useUserData from "@/hooks/useUserData";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useMemo, useRef, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
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
  footerText?: string;
  footerBg?: string;
};

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

export default function DashboardScreen() {
  const { auth } = useFirebase();
  const { userData } = useUserData();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 900;

  const { theme, setTheme, colors } = useThemeContext();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Animated background color
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

  async function logout() {
    try {
      const response = await signOut(auth);
      console.log("signed out", response);
    } catch (error) {
      console.log(error);
    }
  }

  if (!auth.currentUser) return <Redirect href="/login" />;

  return (
    <Animated.View style={[styles.root, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons
            name="code-slash-outline"
            size={24}
            color={colors.accent}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoText}>AlgoCheatSheet</Text>
        </View>
        <View style={styles.headerRight}>
          {/* Theme Toggle Button */}
          <TouchableOpacity
            onPress={() => setTheme(theme === "light" ? "dark" : "light")}
            style={{ marginRight: 12 }}
            accessibilityLabel="Toggle theme"
          >
            <Ionicons
              name={theme === "light" ? "moon-outline" : "sunny-outline"}
              size={28}
              color={colors.accent}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostButton} onPress={logout}>
            <Text style={styles.ghostButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Cards Row */}
        <View
          style={[
            styles.dashboard,
            {
              flexDirection: isLargeScreen ? "row" : "column",
              alignItems: isLargeScreen ? "stretch" : "flex-start",
              gap: isLargeScreen ? 24 : 0,
            },
          ]}
        >
          {/* Profile Card */}
          <View
            style={[
              styles.profileCard,
              {
                flex: isLargeScreen ? 1 : undefined,
                marginRight: isLargeScreen ? 0 : 0,
                marginBottom: isLargeScreen ? 0 : 18,
              },
            ]}
          >
            <Ionicons
              name="person-circle-outline"
              size={80}
              color={colors.inputBorder}
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.profileName}>{userData?.email}</Text>
            <Text style={styles.profileRole}>{userData?.role}</Text>
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{new Date(userData?.createdAt ?? new Date().getTime()).toDateString()}</Text>
                <Text style={styles.statLabel}>Account Created</Text>
              </View>
              <View style={[styles.statItem, { paddingHorizontal: 16 }]}>
                <Text style={styles.statNumber}>
                  {userData?.generatedSheets.length}
                </Text>
                <Text style={styles.statLabel}>Topics Explored</Text>
              </View>
            </View>
          </View>

          {/* Recent Searches */}
          <View
            style={[
              styles.recentSearchesCard,
              {
                flex: isLargeScreen ? 2 : undefined,
                minWidth: isLargeScreen ? 0 : 260,
              },
            ]}
          >
            <Text style={styles.cardTitle}>Recent Searches</Text>
            {userData?.recentSearches.slice(0, 3).map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.searchRow,
                  {
                    borderBottomWidth:
                      idx !== userData.recentSearches.length - 1 ? 1 : 0,
                  },
                ]}
              >
                <Ionicons
                  name="search-outline"
                  size={18}
                  color={colors.accent}
                  style={{ marginRight: 8 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.searchTitle}>{item.title}</Text>
                  <Text style={styles.searchTime}>{item.time}</Text>
                </View>
                <Feather name="arrow-up-right" size={18} color={colors.footerText || "#a1a1aa"} />
              </View>
            ))}
          </View>
        </View>

        {/* Generated Cheat Sheets */}
        <View style={styles.generatedSheetsSection}>
          <Text style={styles.sectionTitle}>Generated Cheat Sheets</Text>
          <View
            style={[
              styles.generatedSheetsRow,
              {
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 18,
              },
            ]}
          >
            {userData?.generatedSheets.map((sheet, idx) => (
              <View
                key={idx}
                style={[
                  styles.sheetCard,
                  {
                    flex: isLargeScreen ? 1 : undefined,
                    marginRight:
                      isLargeScreen &&
                        idx !== userData.generatedSheets.length - 1
                        ? 0
                        : 0,
                  },
                ]}
              >
                <Text style={styles.sheetTitle}>{sheet.topic}</Text>
                <Text style={styles.sheetDesc}>{sheet.difficulty}</Text>
                <View style={styles.sheetFooter}>
                  <Text style={styles.sheetTime}>
                    {
                      typeof sheet.generatedAt == 'number' ? new Date(sheet.generatedAt).toDateString() : sheet.generatedAt
                    }</Text>
                  <TouchableOpacity
                    onPress={() =>
                      router.navigate({
                        pathname: "/output",
                        params: { generatedAt: sheet.generatedAt },
                      })
                    }
                  >
                    <Text style={styles.sheetLink}>View Sheet</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 AlgoCheatSheet. All rights reserved.
        </Text>
      </View>
    </Animated.View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: { flex: 1 /* backgroundColor will be animated */ },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: colors.card,
      borderBottomColor: colors.inputBorder,
      borderBottomWidth: 1,
    },
    headerLeft: { flexDirection: "row", alignItems: "center" },
    logoText: { fontSize: 20, fontWeight: "bold", color: colors.accent },
    headerRight: { flexDirection: "row", alignItems: "center" },
    avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
    headerUserName: { fontWeight: "500", color: colors.text },
    ghostButton: {
      marginRight: 8,
      padding: 8,
    },
    ghostButtonText: {
      color: colors.accent,
      fontWeight: "bold",
    },
    scrollContent: { padding: 32, paddingBottom: 80 },
    dashboard: { width: "100%", marginBottom: 32, flex: 1 },
    profileCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      alignItems: "center",
      minWidth: 260,
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      justifyContent: "center",
    },
    profileAvatar: { width: 72, height: 72, borderRadius: 36, marginBottom: 12 },
    profileName: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 2,
      color: colors.text,
    },
    profileRole: { color: colors.subtext, marginBottom: 16 },
    profileStats: {
      flexDirection: "row",
      marginTop: 8,
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 16,
    },
    statItem: { alignItems: "center", marginHorizontal: 12 },
    statNumber: { fontWeight: "bold", fontSize: 16, color: colors.accent },
    statLabel: {
      color: colors.subtext,
      fontSize: 12,
      marginTop: 2,
      textAlign: "center",
    },
    recentSearchesCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      minWidth: 260,
      justifyContent: "center",
    },
    cardTitle: {
      fontWeight: "bold",
      fontSize: 16,
      marginBottom: 16,
      color: colors.text,
    },
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomColor: colors.inputBorder,
    },
    searchTitle: { fontWeight: "500", color: colors.text },
    searchTime: { color: colors.footerText || "#a1a1aa", fontSize: 12 },
    generatedSheetsSection: { marginTop: 8 },
    sectionTitle: {
      fontWeight: "bold",
      fontSize: 16,
      marginBottom: 16,
      color: colors.text,
    },
    generatedSheetsRow: {
      width: "100%",
      justifyContent: "space-between",
      alignItems: "stretch",
    },
    sheetCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      flex: 1,
      minWidth: 260,
      elevation: 1,
      shadowColor: "#000",
      shadowOpacity: 0.02,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      justifyContent: "space-between",
    },
    sheetTitle: {
      fontWeight: "bold",
      fontSize: 15,
      marginBottom: 6,
      color: colors.accent,
    },
    sheetDesc: { color: colors.subtext, marginBottom: 14 },
    sheetFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sheetTime: { color: colors.footerText || "#a1a1aa", fontSize: 12 },
    sheetLink: { color: colors.accent, fontWeight: "bold" },
    footer: {
      backgroundColor: colors.footerBg || "#111827",
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
    footerText: {
      color: colors.footerText || "#a1a1aa",
      fontSize: 12,
      fontWeight: "bold",
      letterSpacing: 0.2,
    },
  });
}
