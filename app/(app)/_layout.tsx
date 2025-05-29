import useFirebase from '@/hooks/useFirebase';
import { Stack } from "expo-router";
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

export default function RootLayout()
{
  const { auth, updateFirebaseContext } = useFirebase();

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
          updateFirebaseContext();
        }
        else
        {
          // User is signed out
          console.log('User is signed out');
          updateFirebaseContext();
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
    <Stack screenOptions={{ headerShown: false }} />
  );
}
