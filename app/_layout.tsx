import FirebaseProvider from '@/components/FirebaseProvider';
import UserDataProvider from '@/components/UserDataProvider';
import { Slot } from "expo-router";

export default function RootLayout()
{
  return (
    <FirebaseProvider>
      <UserDataProvider>
        <Slot />
      </UserDataProvider>
    </FirebaseProvider>
  );
}
