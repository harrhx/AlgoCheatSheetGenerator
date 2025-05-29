import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

// Dummy data
const user = {
  name: 'John Doe',
  role: 'Student',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  created: 24,
  explored: 12,
};

const recentSearches = [
  { title: 'Dynamic Programming', time: '2 hours ago' },
  { title: 'Binary Search Trees', time: '1 day ago' },
  { title: 'Graph Algorithms', time: '2 days ago' },
];

const generatedSheets = [
  {
    title: 'Dynamic Programming',
    desc: 'A comprehensive guide to DP patterns and problem-solving techniques.',
    time: '2 hours ago',
  },
  {
    title: 'Binary Search Trees',
    desc: 'Implementation, traversal, and common BST operations examples.',
    time: '1 day ago',
  },
  {
    title: 'Graph Algorithms',
    desc: 'DFS, BFS, and shortest path algorithms with examples.',
    time: '2 days ago',
  },
];

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 800;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="code-slash-outline" size={24} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={styles.logoText}>AlgoCheatSheet</Text>
        </View>
        <View style={styles.headerRight}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.headerUserName}>{user.name}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.dashboard, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
          {/* Profile Card */}
          <View style={[styles.profileCard, { marginRight: isLargeScreen ? 16 : 0 }]}>
            <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileRole}>{user.role}</Text>
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.created}</Text>
                <Text style={styles.statLabel}>Cheat Sheets Created</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.explored}</Text>
                <Text style={styles.statLabel}>Topics Explored</Text>
              </View>
            </View>
          </View>

          {/* Recent Searches */}
          <View style={styles.recentSearchesCard}>
            <Text style={styles.cardTitle}>Recent Searches</Text>
            {recentSearches.map((item, idx) => (
              <View key={idx} style={styles.searchRow}>
                <Ionicons name="search-outline" size={18} color="#2563eb" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.searchTitle}>{item.title}</Text>
                  <Text style={styles.searchTime}>{item.time}</Text>
                </View>
                <Feather name="arrow-up-right" size={18} color="#a1a1aa" />
              </View>
            ))}
          </View>
        </View>

        {/* Generated Cheat Sheets */}
        <View style={styles.generatedSheetsSection}>
          <Text style={styles.sectionTitle}>Generated Cheat Sheets</Text>
          <View style={[styles.generatedSheetsRow, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
            {generatedSheets.map((sheet, idx) => (
              <View key={idx} style={styles.sheetCard}>
                <Text style={styles.sheetTitle}>{sheet.title}</Text>
                <Text style={styles.sheetDesc}>{sheet.desc}</Text>
                <View style={styles.sheetFooter}>
                  <Text style={styles.sheetTime}>{sheet.time}</Text>
                  <TouchableOpacity>
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
        <Text style={styles.footerText}>© 2023 AlgoCheatSheet. All rights reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6f7fb' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoText: { fontSize: 20, fontWeight: 'bold', color: '#2563eb' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  headerUserName: { fontWeight: '500', color: '#222' },
  scrollContent: { padding: 24, paddingBottom: 80 },
  dashboard: { width: '100%', marginBottom: 32, flex: 1 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    minWidth: 260,
    flex: 1,
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  profileAvatar: { width: 72, height: 72, borderRadius: 36, marginBottom: 12 },
  profileName: { fontSize: 18, fontWeight: 'bold', marginBottom: 2, color: '#222' },
  profileRole: { color: '#6b7280', marginBottom: 16 },
  profileStats: { flexDirection: 'row', marginTop: 8 },
  statItem: { alignItems: 'center', marginHorizontal: 12 },
  statNumber: { fontWeight: 'bold', fontSize: 16, color: '#2563eb' },
  statLabel: { color: '#6b7280', fontSize: 12, marginTop: 2, textAlign: 'center' },
  recentSearchesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    flex: 2,
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    minWidth: 260,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 16, color: '#222' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
  },
  searchTitle: { fontWeight: '500', color: '#222' },
  searchTime: { color: '#a1a1aa', fontSize: 12 },
  generatedSheetsSection: { marginTop: 8 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 16, color: '#222' },
  generatedSheetsRow: { width: '100%', justifyContent: 'space-between' },
  sheetCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flex: 1,
    minWidth: 260,
    marginRight: 16,
    elevation: 1,
    shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  sheetTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 6, color: '#2563eb' },
  sheetDesc: { color: '#6b7280', marginBottom: 14 },
  sheetFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheetTime: { color: '#a1a1aa', fontSize: 12 },
  sheetLink: { color: '#2563eb', fontWeight: 'bold' },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopColor: '#e5e7eb',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  footerText: { color: '#a1a1aa', fontSize: 12 },
});
