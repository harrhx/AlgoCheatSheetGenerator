import FirebaseProvider from '@/components/FirebaseProvider';
import { Slot } from "expo-router";

export default function RootLayout()
{
  return (
    <FirebaseProvider>
      <Slot />
    </FirebaseProvider>
  );
}
