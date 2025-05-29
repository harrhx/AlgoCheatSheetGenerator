import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const cheatSheetHtmlContent = `
  <html>
    <head>
      <style>
        body { font-family: sans-serif; padding: 20px; }
        h2 { color: #007bff; }
        pre { background: #f8f8f8; padding: 12px; border-radius: 6px; }
      </style>
    </head>
    <body>
      <h2>Dynamic Programming Basics</h2>
      <p>Dynamic Programming (DP) is a method for solving complex problems by breaking them down into simpler subproblems.</p>
      <ul>
        <li>Identify subproblems</li>
        <li>Store results of subproblems (memoization/tabulation)</li>
        <li>Build up the solution from stored results</li>
      </ul>
      <h3>Example: Fibonacci</h3>
      <pre><code>
function fib(n) {
  if (n <= 1) return n;
  let dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  return dp[n];
}
      </code></pre>
    </body>
  </html>
`;

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

function HtmlCheatSheetViewer() {
  if (Platform.OS === 'web') {
    return (
      <iframe
        srcDoc={cheatSheetHtmlContent}
        style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12 }}
        title="Cheat Sheet"
      />
    );
  } else {
    return (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text>WebView is not supported on this platform. Please view this cheat sheet on the web version.</Text>
      </ScrollView>
    );
  }
}

export default function CheatSheetScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 700;

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
          {/* LEFT PANEL - Main Content */}
          <View
            style={[
              styles.leftPanel,
              {
                marginRight: isLargeScreen ? 16 : 0,
                marginBottom: isLargeScreen ? 0 : 16,
                flex: isLargeScreen ? 2 : undefined,
                width: isLargeScreen ? undefined : '100%',
                height: isLargeScreen ? undefined : 500, // Fixed height on mobile
              },
            ]}
          >
            <View style={[styles.cheatSheetContainer, { flex: 1 }]}>
              <HtmlCheatSheetViewer />
            </View>

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
          </View>

          {/* RIGHT PANEL - Sidebar */}
          <View
            style={[
              styles.rightPanel,
              {
                flex: isLargeScreen ? 1 : undefined,
                width: isLargeScreen ? undefined : '100%',
              },
            ]}
          >
            {isLargeScreen ? (
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
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
              </ScrollView>
            ) : (
              <>
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
              </>
            )}
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
    minHeight: 400, // Ensure minimum height for content
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
});