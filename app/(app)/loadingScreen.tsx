import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function LoadingScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const topic = typeof params.topic === "string" ? params.topic : "";

  const [loadingText, setLoadingText] = useState("Generating your cheat sheet...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    generateCheatSheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateCheatSheet = async () => {
    try {
      const loadingMessages = [
        "Analyzing the algorithm...",
        "Generating code examples...",
        "Creating practice problems...",
        "Adding mathematical notation...",
        "Finalizing your cheat sheet...",
      ];

      let messageIndex = 0;
      let currentProgress = 0;

      const messageInterval = setInterval(() => {
        if (messageIndex < loadingMessages.length - 1) {
          messageIndex++;
          currentProgress += 20;
          setLoadingText(loadingMessages[messageIndex]);
          setProgress(currentProgress);
        }
      }, 2000);

      // Make API call to your backend - only send topic
      const response = await fetch(
        "http://localhost:3001/api/generate-cheatsheet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ topic }),
        }
      );

      clearInterval(messageInterval);
      setProgress(100);
      setLoadingText("Complete!");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.html) {
        setTimeout(() => {
          router.replace({
            pathname: "/output", // Adjust this to your output route
            params: {
              html: data.html,
              topic: data.topic || topic,
              difficulty: data.difficulty || "intermediate",
              programmingLanguage: data.programmingLanguage || "Python",
            },
          });
        }, 500);
      } else {
        throw new Error(data.error || "Failed to generate cheat sheet");
      }
    } catch (error) {
      console.error("Error generating cheat sheet:", error);

      let errorMessage = "Failed to generate cheat sheet";
      let errorMsg: string;
      if (error instanceof Error) {
        errorMsg = error.message;
      } else {
        errorMsg = String(error);
      }

      if (errorMsg.includes("fetch")) {
        errorMessage = "Cannot connect to server. Please ensure the backend is running.";
      } else if (errorMsg.includes("HTTP error")) {
        errorMessage = "Server error. Please try again.";
      }

      Alert.alert("Generation Failed", errorMessage, [
        {
          text: "Try Again",
          onPress: () => generateCheatSheet(),
        },
        {
          text: "Go Back",
          onPress: () => router.back(),
          style: "cancel",
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#2563eb" style={styles.spinner} />

        <Text style={styles.title}>Creating Your Cheat Sheet</Text>
        <Text style={styles.topic}>Topic: {topic}</Text>
        <Text style={styles.subtitle}>{loadingText}</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {progress === 100 ? "Redirecting..." : "This may take 10-30 seconds"}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>🤖 AI is analyzing your topic</Text>
          <Text style={styles.infoText}>📝 Generating comprehensive content</Text>
          <Text style={styles.infoText}>🎨 Formatting with beautiful styling</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: 32,
    maxWidth: 400,
  },
  spinner: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  topic: {
    fontSize: 18,
    color: "#2563eb",
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#e0f2fe",
    borderRadius: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    minHeight: 20,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
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
  infoContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
});
