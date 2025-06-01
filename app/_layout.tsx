import FirebaseProvider from '@/components/FirebaseProvider';
import UserDataProvider from '@/components/UserDataProvider';
import { ThemeProvider } from './(app)/ThemeContext'; // Adjust path to your ThemeProvider
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <FirebaseProvider>
      <UserDataProvider>
        <ThemeProvider> {/* Add ThemeProvider here */}
          <Slot />
        </ThemeProvider>
      </UserDataProvider>
    </FirebaseProvider>
  );
}
