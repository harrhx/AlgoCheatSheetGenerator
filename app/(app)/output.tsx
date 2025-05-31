import { UserDataType } from '@/components/UserDataProvider';
import useFirebase from '@/hooks/useFirebase';
import useUserData from '@/hooks/useUserData';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// Hardcoded topics with icons
const hardcodedRelatedTopics = [
  { title: 'Recursion', icon: '🔄' },
  { title: 'Memoization', icon: '💾' },
  { title: 'Graph Algorithms', icon: '🔗' },
  { title: 'Binary Trees', icon: '🌳' },
  { title: 'Dynamic Programming', icon: '🧩' },
  { title: 'Sorting Algorithms', icon: '🔢' },

  { title: 'Breadth-First Search', icon: '🌊' },
  { title: 'Depth-First Search', icon: '🕳️' },
  { title: 'Dijkstra\'s Algorithm', icon: '🛣️' },
  { title: 'A* Search', icon: '⭐' },
  { title: 'Bellman-Ford Algorithm', icon: '🔔' },
  { title: 'Floyd-Warshall Algorithm', icon: '🌐' },
  { title: 'Kruskal\'s Algorithm', icon: '🪢' },
  { title: 'Prim\'s Algorithm', icon: '🌲' },
  { title: 'Heap Data Structure', icon: '🗑️' },
  { title: 'Trie Data Structure', icon: '🌲' },
  { title: 'Hash Table', icon: '🔑' },
  { title: 'Stack', icon: '📚' },
  { title: 'Queue', icon: '📬' },
  { title: 'Linked List', icon: '🔗' },
  { title: 'Binary Search', icon: '🔍' },
  { title: 'Backtracking', icon: '↩️' },
  { title: 'Greedy Algorithms', icon: '💰' },
  { title: 'Divide and Conquer', icon: '✂️' },
  { title: 'Minimum Spanning Tree', icon: '🌳' },
  { title: 'Topological Sort', icon: '🔝' },
];


export default function CheatSheetScreen() {
  const params = useLocalSearchParams();
  const { auth, db, updateFirebaseContext } = useFirebase();
  const { userData } = useUserData();
  const topicName = typeof params.topic === "string" ? params.topic : "";
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 700;

  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Generating your cheat sheet...");
  const [progress, setProgress] = useState(0);
  const [cheatSheetHtmlContent, setCheatSheetHtmlContent] = useState('<p>Loading...</p>');
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    setLoading(true);
    let messageIndex = 0;
    let currentProgress = 0;
    const loadingMessages = [
      "Analyzing the algorithm...",
      "Generating code examples...",
      "Creating practice problems...",
      "Adding mathematical notation...",
      "Finalizing your cheat sheet...",
    ];

    const messageInterval = setInterval(() => {
      if (messageIndex < loadingMessages.length - 1) {
        messageIndex++;
        currentProgress += 20;
        setLoadingText(loadingMessages[messageIndex]);
        setProgress(currentProgress);
      }
    }, 2000);

    const fetchCheatSheet = async () => {
      try {
        const response = await fetch(
          "https://aicheatsheetgeneratorbackend.onrender.com/api/generate-cheatsheet",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ topic: topicName }),
          }
        );
        const data: UserDataType['generatedSheets'][0] = await response.json();
        const htmlContent = data.html || `<h1>${topicName}</h1><p>Failed to fetch cheat sheet.</p>`;
        setCheatSheetHtmlContent(htmlContent);

        if (data.html) {
          const docRef = doc(db, "users", auth.currentUser!.email!);
          const docSnapshot = await getDoc(docRef);
          const docData = docSnapshot.data() as UserDataType;

          const newDocData: UserDataType = {
            ...docData,
            generatedSheets: [
              ...docData!.generatedSheets,
              { ...data, generatedAt: new Date(data.generatedAt).toDateString() }
            ],
            recentSearches: [
              ...docData!.recentSearches,
              { title: topicName, time: new Date().toDateString() }
            ],
          };

          await updateDoc(docRef, newDocData);

          updateFirebaseContext();
        }
        setRelatedTopics(data.relatedTopics || []);
      } catch (error) {
        setCheatSheetHtmlContent(`<h1>${topicName}</h1><p>Failed to fetch cheat sheet.</p>`);
        setRelatedTopics([]);
      } finally {
        clearInterval(messageInterval);
        setProgress(100);
        setLoadingText("Complete!");
        setTimeout(() => setLoading(false), 500);
      }
    };
    if (params.generatedAt) {
      setLoading(false);
      setCheatSheetHtmlContent(userData?.generatedSheets.find(sheet => sheet.generatedAt === params.generatedAt)?.html || `<h1>${topicName}</h1><p>Failed to fetch cheat sheet.</p>`);
    } else {
      fetchCheatSheet();
    }
    return () => clearInterval(messageInterval);
  }, [auth.currentUser, params.topic, params.generatedAt]);

  function HtmlCheatSheetViewer() {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 16, color: '#2563eb' }}>{loadingText}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {progress === 100 ? "Displaying..." : "This may take 10-30 seconds"}
            </Text>
          </View>
        </View>
      );
    }
    if (Platform.OS === 'web') {
      return (
        <iframe
          srcDoc={cheatSheetHtmlContent}
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12, minHeight: 400 }}
          title="Cheat Sheet"
        />
      );
    } else {
      return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text selectable style={{ fontSize: 12, color: '#444' }}>
            {cheatSheetHtmlContent}
          </Text>
        </ScrollView>
      );
    }
  }

  // Merge hardcoded and backend topics, avoiding duplicates
  const mergedTopics = [
    ...hardcodedRelatedTopics,
    ...relatedTopics
      .filter(
        t =>
          !hardcodedRelatedTopics.some(
            ht => ht.title.toLowerCase() === t.toLowerCase()
          )
      )
      .map(t => ({ title: t, icon: '🔗' })), // Use default icon for new topics
  ];

  // Handler for user to search a new topic
  const handleSearch = () => {
    if (!searchInput.trim()) return;
    router.replace({ pathname: "/output", params: { topic: searchInput.trim() } });
    setSearchInput('');
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.leftSection}>
          <Ionicons name="code-slash-outline" size={24} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={styles.title}>AlgoCheatSheet</Text>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.navigate('/account')} >
            <Icon name="user" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={isLargeScreen ? { flex: 1 } : {}}>
        <View style={[styles.contentContainer, {
          flexDirection: isLargeScreen ? 'row' : 'column',
          flex: isLargeScreen ? 1 : undefined,
          minHeight: isLargeScreen ? 0 : undefined,
        }]}>
          <View style={[styles.leftPanel, {
            marginRight: isLargeScreen ? 16 : 0,
            marginBottom: isLargeScreen ? 0 : 16,
            flex: isLargeScreen ? 2 : undefined,
            width: isLargeScreen ? undefined : '100%',
            height: isLargeScreen ? undefined : 500,
          }]}>
            <View style={[styles.cheatSheetContainer, { flex: 1 }]}>
              <HtmlCheatSheetViewer />
            </View>
            {!loading && (
              <View style={styles.actionBar}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => {
                    if (Platform.OS === 'web') {
                      const blob = new Blob([cheatSheetHtmlContent], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'algo_cheat_sheet.html';
                      a.click();
                      URL.revokeObjectURL(url);
                    } else {
                      alert('Download is only available on web for now.');
                    }
                  }}
                >
                  <Text style={styles.primaryButtonText}>⬇️ Download Cheat Sheet</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={[styles.rightPanel, {
            flex: 1, // Make sidebar take all available space
            width: isLargeScreen ? undefined : '100%',
            minHeight: 0,
          }]}>
            {/* Search Bar at Top */}
            <View style={styles.searchBarContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter algorithm topic"
                placeholderTextColor="#888"
                value={searchInput}
                onChangeText={setSearchInput}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                blurOnSubmit={true}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
                activeOpacity={0.8}
              >
                <Text style={styles.searchButtonText}>Generate</Text>
              </TouchableOpacity>
            </View>

            {/* People Also Searched For */}
            <View style={[styles.sidebarSection, { flex: 1, minHeight: 0 }]}>
              <Text style={styles.sectionTitle}>People Also Searched For</Text>
              <FlatList
                data={mergedTopics}
                keyExtractor={(item, idx) => item.title + idx}
                numColumns={2}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 8 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.topicCard}
                    onPress={() => router.replace({ pathname: "/output", params: { topic: item.title } })}
                  >
                    <Text style={styles.topicIcon}>{item.icon}</Text>
                    <Text style={styles.topicTitle} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#2563eb" },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  contentContainer: {
    padding: 16,
  },
  leftPanel: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cheatSheetContainer: {
    flex: 1,
    minHeight: 400,
  },
  actionBar: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    alignItems: 'flex-end',
  },
  primaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#007bff',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  rightPanel: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    minHeight: 0,
  },
  sidebarSection: {
    marginBottom: 24,
    flex: 1,
    minHeight: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  searchBarContainer: {
    backgroundColor: "#fff",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 0,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    minWidth: 0,
  },
  searchButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  topicCard: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    margin: '1%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  topicIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
    flexShrink: 1,
  },
  loadingContainer: {
    flex: 1,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 24,
  },
  progressBar: {
    width: 250,
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
