import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomePage()
{
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>AlgoCheatSheet</Text>
        <View style={styles.authButtons}>
          <TouchableOpacity style={styles.ghostButton} onPress={() => router.navigate('/login')} >
            <Text style={styles.ghostButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText} onPress={() => router.navigate('/signup')} >Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Your Personal Algorithm Cheat Sheet Generator</Text>
        <Text style={styles.heroSubtitle}>
          Master algorithms with personalized cheat sheets tailored to your learning needs
        </Text>

        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search for an algorithm"
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Generate</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.popularSearch}>Popular searches:</Text>
        <View style={styles.linksRow}>
          <Text style={styles.link}>Binary Search Trees</Text>
          <Text style={styles.link}>Dynamic Programming</Text>
          <Text style={styles.link}>Graph Algorithms</Text>
        </View>
      </View>

      {/* Features */}
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

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>AlgoCheatSheet</Text>
        <View style={styles.linksRow}>
          <Text style={styles.footerLink}>About</Text>
          <Text style={styles.footerLink}>Privacy</Text>
          <Text style={styles.footerLink}>Terms</Text>
          <Text style={styles.footerLink}>Contact</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  authButtons: {
    flexDirection: 'row',
  },
  ghostButton: {
    marginRight: 8,
    padding: 8,
  },
  ghostButtonText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 6,
    padding: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  hero: {
    padding: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  searchButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  popularSearch: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  link: {
    color: '#2563eb',
    marginHorizontal: 6,
    marginBottom: 4,
  },
  features: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
    color: '#2563eb',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  cardText: {
    color: '#6b7280',
    fontSize: 14,
  },
  footer: {
    backgroundColor: '#111827',
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footerLink: {
    color: '#9ca3af',
    marginHorizontal: 8,
  },
});