import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import
  {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
  } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function CheatSheetScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const topicName = typeof params.topic === "string" ? params.topic : "";
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 700;

  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Generating your cheat sheet...");
  const [progress, setProgress] = useState(0);
  const [cheatSheetHtmlContent, setCheatSheetHtmlContent] = useState('<p>Loading...</p>');

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
        const data = await response.json();
        setCheatSheetHtmlContent(data.html || `<h1>${topicName}</h1><p>Failed to fetch cheat sheet.</p>`);
      } catch (error) {
        setCheatSheetHtmlContent(`<h1>${topicName}</h1><p>Failed to fetch cheat sheet.</p>`);
      } finally {
        clearInterval(messageInterval);
        setProgress(100);
        setLoadingText("Complete!");
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchCheatSheet();
    return () => clearInterval(messageInterval);
  }, [topicName]);

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

  const relatedTopics = [
    { title: 'Recursion', icon: '🔄' },
    { title: 'Memoization', icon: '💾' },
    { title: 'Graph Algorithms', icon: '🔗' },
    { title: 'Binary Trees', icon: '🌳' },
  ];

  const practiceProblems = [
    { title: 'Climbing Stairs', difficulty: 'Easy' },
    { title: 'Coin Change', difficulty: 'Medium' },
    { title: 'Edit Distance', difficulty: 'Hard' },
  ];

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.leftSection}>
          <Text style={styles.iconSymbol}>{'</>'}</Text>
          <Text style={styles.title}>AlgoCheatSheet</Text>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="user" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="bookmark" size={20} color="#000" />
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
              {/* Only this area is replaced by animation while loading */}
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
            flex: isLargeScreen ? 1 : undefined,
            width: isLargeScreen ? undefined : '100%',
          }]}>
            <View style={styles.sidebarSection}>
              <Text style={styles.sectionTitle}>Related Topics</Text>
              <View style={styles.topicsGrid}>
                {relatedTopics.map((topic, idx) => (
                  <TouchableOpacity key={idx} style={styles.topicCard}>
                    <Text style={styles.topicIcon}>{topic.icon}</Text>
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.sidebarSection}>
              <Text style={styles.sectionTitle}>Practice Problems</Text>
              {practiceProblems.map((problem, idx) => (
                <TouchableOpacity key={idx} style={styles.problemItem}>
                  <View>
                    <Text style={styles.problemTitle}>{problem.title}</Text>
                    <Text style={styles.difficultyText}>Difficulty: {problem.difficulty}</Text>
                  </View>
                  <Text style={styles.arrow}>→</Text>
                </TouchableOpacity>
              ))}
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
  iconSymbol: {
    fontSize: 24,
    color: '#007bff',
    fontWeight: 'bold',
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
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
  },
  sidebarSection: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topicCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 12,
  },
  topicIcon: {
    fontSize: 24,
    marginBottom: 4
  },
  topicTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
  },
  problemItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  problemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  difficultyText: {
    fontSize: 12,
    color: '#666'
  },
  arrow: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold'
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
