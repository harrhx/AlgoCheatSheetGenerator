import FirebaseProvider from '@/components/FirebaseProvider';
import useFirebase from '@/hooks/useFirebase';
import { Stack } from "expo-router";
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

export default function RootLayout()
{
  const { auth } = useFirebase();

  useEffect(() =>
  {
    const removeAuthListener = onAuthStateChanged(auth, async (user) =>
    {
      try
      {
        if (user)
        {
          // User is signed in, you can access user information here
          console.log('User is signed in:', user);
        }
        else
        {
          // User is signed out
          console.log('User is signed out');
        }
      }
      catch (error)
      {
        console.log(error);
      }
    });

    return () =>
    {
      removeAuthListener();
    };
  },
    []);
  return (
    <FirebaseProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </FirebaseProvider>
  );
}
