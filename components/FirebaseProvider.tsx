import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { createContext, PropsWithChildren } from 'react';

export default function FirebaseProvider(props: PropsWithChildren)
{
  return (
    <FirebaseContext.Provider value={{ firebaseConfig, app, auth }}>
      {props.children}
    </FirebaseContext.Provider>
  )
}

export const FirebaseContext = createContext<FirebaseContextType>(null as any);

export type FirebaseContextType =
  {
    firebaseConfig: typeof firebaseConfig;
    app: ReturnType<typeof initializeApp>;
    auth: ReturnType<typeof getAuth>;
  };

const firebaseConfig = {
  apiKey: "AIzaSyBnTIhTsZaQRsT02I2c8V0ruA1o9PCKbiM",
  authDomain: "aicheatsheetgenerator.firebaseapp.com",
  projectId: "aicheatsheetgenerator",
  storageBucket: "aicheatsheetgenerator.firebasestorage.app",
  messagingSenderId: "573959142091",
  appId: "1:573959142091:web:7f4f7e4d49c67f7939b94e",
  measurementId: "G-NS9ELRFWWN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);