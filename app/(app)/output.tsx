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
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Feather';

const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

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

function PdfViewer() {
  if (Platform.OS === 'web') {
    return (
      <iframe
        src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          display: 'block',
          flex: 1,
        }}
        title="PDF Viewer"
      />
    );
  }
  return (
    <WebView
      source={{ uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}` }}
      style={{ flex: 1, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
      startInLoadingState
      renderError={() => (
        <View style={styles.errorView}>
          <Text style={{ color: 'red' }}>Failed to load PDF.</Text>
        </View>
      )}
    />
  );
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

      <View style={styles.container}>
        <View style={[styles.contentContainer, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
          {/* LEFT PANEL */}
          <View
            style={[
              styles.leftPanel,
              {
                marginRight: isLargeScreen ? 16 : 0,
                marginBottom: isLargeScreen ? 0 : 16,
                flex: isLargeScreen ? 2 : 1, // <-- Changed here to flex:1 on small screens
              },
            ]}
          >
            {/* Make PDF viewer fill available space */}
            <View style={{ flex: 1 }}>
              <PdfViewer />
            </View>
            {/* Download button outside the flex:1 container */}
            <View style={styles.actionBar}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  if (Platform.OS === 'web') {
                    window.open(pdfUrl, '_blank');
                  } else {
                    // Handle native download if needed
                  }
                }}
              >
                <Text style={styles.primaryButtonText}>⬇️ Download PDF</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* RIGHT PANEL */}
          <View
            style={[
              styles.rightPanel,
              {
                maxHeight: isLargeScreen ? undefined : 200, // Limit height on small screens
              },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
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
          </View>
        </View>
      </View>
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: {
    flex: 1,
    padding: 16,
    minHeight: 0, // Important to fix flexbox scroll issues
  },
  leftPanel: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
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
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    minHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sidebarSection: { marginBottom: 24 },
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
  topicIcon: { fontSize: 24, marginBottom: 4 },
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
  problemTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 2 },
  difficultyText: { fontSize: 12, color: '#666' },
  arrow: { fontSize: 16, color: '#007bff', fontWeight: 'bold' },
  errorView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
