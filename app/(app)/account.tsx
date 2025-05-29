import useFirebase from '@/hooks/useFirebase';
import useUserData from '@/hooks/useUserData';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import
  {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
  } from 'react-native';

export default function DashboardScreen()
{
  const { auth } = useFirebase();
  const { userData } = useUserData();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 900;

  async function logout()
  {
    try
    {
      const response = await signOut(auth);
      console.log('signed out', response);
    }
    catch (error)
    {
      console.log(error);
    }
  }

  if (!auth.currentUser)
    return <Redirect href="/login" />;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="code-slash-outline" size={24} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={styles.logoText}>AlgoCheatSheet</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.ghostButton}
            onPress={logout}
          >
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
              flexDirection: isLargeScreen ? 'row' : 'column',
              alignItems: isLargeScreen ? 'stretch' : 'flex-start',
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
            <Ionicons name="person-circle-outline" size={80} color="#e0e0e0" style={{ marginBottom: 12 }} />
            <Text style={styles.profileName}>{userData?.email}</Text>
            <Text style={styles.profileRole}>{userData?.role}</Text>
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userData?.createdAt}</Text>
                <Text style={styles.statLabel}>Account Created</Text>
              </View>
              <View style={[styles.statItem, { paddingHorizontal: 16 }]}>
                <Text style={styles.statNumber}>{userData?.generatedSheets.length}</Text>
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
                    borderBottomWidth: idx !== userData.recentSearches.length - 1 ? 1 : 0,
                  },
                ]}
              >
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
          <View
            style={[
              styles.generatedSheetsRow,
              {
                flexDirection: isLargeScreen ? 'row' : 'column',
                gap: isLargeScreen ? 24 : 0,
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
                    marginRight: isLargeScreen && idx !== userData.generatedSheets.length - 1 ? 0 : 0,
                    marginBottom: isLargeScreen ? 0 : 16,
                  },
                ]}
              >
                <Text style={styles.sheetTitle}>{sheet.topic}</Text>
                <Text style={styles.sheetDesc}>{sheet.difficulty}</Text>
                <View style={styles.sheetFooter}>
                  <Text style={styles.sheetTime}>{sheet.generatedAt}</Text>
                  <TouchableOpacity onPress={() => router.navigate({ pathname: '/output', params: { generatedAt: sheet.generatedAt } })} >
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
  ghostButton: {
    marginRight: 8,
    padding: 8,
  },
  ghostButtonText: {
    color: "#2563eb",
    fontWeight: "bold",
  },
  scrollContent: { padding: 32, paddingBottom: 80 },
  dashboard: { width: '100%', marginBottom: 32, flex: 1 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    minWidth: 260,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: 'center',
  },
  profileAvatar: { width: 72, height: 72, borderRadius: 36, marginBottom: 12 },
  profileName: { fontSize: 16, fontWeight: 'bold', marginBottom: 2, color: '#222' },
  profileRole: { color: '#6b7280', marginBottom: 16 },
  profileStats: { flexDirection: 'row', marginTop: 8, flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  statItem: { alignItems: 'center', marginHorizontal: 12 },
  statNumber: { fontWeight: 'bold', fontSize: 16, color: '#2563eb' },
  statLabel: { color: '#6b7280', fontSize: 12, marginTop: 2, textAlign: 'center' },
  recentSearchesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    minWidth: 260,
    justifyContent: 'center',
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 16, color: '#222' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#f1f1f1',
  },
  searchTitle: { fontWeight: '500', color: '#222' },
  searchTime: { color: '#a1a1aa', fontSize: 12 },
  generatedSheetsSection: { marginTop: 8 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 16, color: '#222' },
  generatedSheetsRow: { width: '100%', justifyContent: 'space-between', alignItems: 'stretch' },
  sheetCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flex: 1,
    minWidth: 260,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: 'space-between',
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
