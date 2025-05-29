import useFirebase from '@/hooks/useFirebase';
import useUserData from '@/hooks/useUserData';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from "expo-router";
import React from "react";
import
  {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
  } from 'react-native';

export default function HomePage()
{
  const { auth } = useFirebase();
  const { user } = useUserData().userData;

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="code-slash-outline" size={24} color="#2563eb" style={{ marginRight: 8 }} />
              <Text style={styles.logoText}>AlgoCheatSheet</Text>
            </View>
            {auth.currentUser ? (
              <Pressable onPress={() => router.navigate('/account')}>
                <View style={styles.headerRight}>
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                  <Text style={styles.headerUserName}>{user.name}</Text>
                </View>
              </Pressable>
            ) : (
              <View style={styles.authButtons}>
                <TouchableOpacity
                  style={styles.ghostButton}
                  onPress={() => router.navigate("/login")}
                >
                  <Text style={styles.ghostButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => router.navigate("/signup")}
                >
                  <Text style={styles.primaryButtonText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.hero}>
            <Text style={styles.heroTitle}>
              Your Personal Algorithm Cheat Sheet Generator
            </Text>
            <Text style={styles.heroSubtitle}>
              Master algorithms with personalized cheat sheets tailored to your
              learning needs
            </Text>

            <View style={styles.searchBar}>
              <TextInput
                placeholder="Search for an algorithm"
                style={styles.input}
                placeholderTextColor="#888"
                value={topicInput}
                onChangeText={setTopicInput}
                onSubmitEditing={handleGenerate}
                returnKeyType="search"
                blurOnSubmit={true}
              />
              <TouchableOpacity style={styles.searchButton} onPress={handleGenerate}>
                <Text style={styles.searchButtonText}>Generate</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.popularSearch}>Popular searches:</Text>
            <View style={styles.linksRow}>
              {["Binary Search Trees", "Dynamic Programming", "Graph Algorithms"].map(topic => (
                <TouchableOpacity key={topic} onPress={() => handlePopularSearch(topic)}>
                  <Text style={styles.link}>{topic}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ...rest of your features and footer unchanged... */}
          <View style={styles.features}>
            <View style={styles.card}>
              <Text style={styles.icon}>📍</Text>
              <Text style={styles.cardTitle}>Personalized Learning</Text>
              <Text style={styles.cardText}>
                Get customized cheat sheets that match your learning style and pace
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.icon}>💻</Text>
              <Text style={styles.cardTitle}>Sample Problems</Text>
              <Text style={styles.cardText}>
                Practice with real-world examples and solution templates
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.icon}>🛡️</Text>
              <Text style={styles.cardTitle}>Mistake Prevention</Text>
              <Text style={styles.cardText}>
                Learn common pitfalls and how to avoid them effectively
              </Text>
            </View>
          </View>
          <View style={styles.features}>
            <View style={styles.card}>
              <Text style={styles.icon}>🚀</Text>
              <Text style={styles.cardTitle}>Fast Generation</Text>
              <Text style={styles.cardText}>
                Generate cheat sheets instantly with AI-powered algorithms
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.icon}>🎯</Text>
              <Text style={styles.cardTitle}>Focused Topics</Text>
              <Text style={styles.cardText}>
                Zero in on specific algorithms or data structures for targeted learning
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.icon}>🔒</Text>
              <Text style={styles.cardTitle}>Data Privacy</Text>
              <Text style={styles.cardText}>
                Your learning data stays private and secure with us
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>AlgoCheatSheet</Text>
          <View style={styles.linksRow}>
            <Text style={styles.footerLink}>About</Text>
            <Text style={styles.footerLink}>Privacy</Text>
            <Text style={styles.footerLink}>Terms</Text>
            <Text style={styles.footerLink}>Contact</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ...styles unchanged from your paste...


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoText: { fontSize: 20, fontWeight: 'bold', color: '#2563eb' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  headerUserName: { fontWeight: '500', color: '#222' },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563eb",
  },
  authButtons: {
    flexDirection: "row",
  },
  ghostButton: {
    marginRight: 8,
    padding: 8,
  },
  ghostButtonText: {
    color: "#2563eb",
    fontWeight: "bold",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
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
  },
  heroSubtitle: {
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
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
  },
  searchButton: {
    backgroundColor: "#2563eb",
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
  },
  linksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  link: {
    color: "#2563eb",
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
    backgroundColor: "#fff",
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
    color: "#2563eb",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  cardText: {
    color: "#6b7280",
    fontSize: 14,
  },
  footer: {
    backgroundColor: "#111827",
    padding: 16,
    alignItems: "center",
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
