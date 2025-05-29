import useFirebase from '@/hooks/useFirebase';
import { doc, getDoc } from 'firebase/firestore';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

export default function UserDataProvider(props: PropsWithChildren)
{
  const firebase = useFirebase();
  const { db, auth } = firebase;

  const [userData, setUserData] = useState<UserDataContextType['userData']>(null);

  async function fetchUserData()
  {
    const docRef = doc(db, "users", auth.currentUser!.email!);
    const docSnapshot = await getDoc(docRef);
    const docData = docSnapshot.data() as UserDataContextType['userData'];
    setUserData(docData)
    // Here you can fetch user data from your database if needed
    console.log('User is logged in:', auth.currentUser);
  }

  useEffect(() =>
  {
    if (auth.currentUser)
      fetchUserData();
    else
    {
      console.log('No user is logged in');
      // Reset userData if no user is logged in
      setUserData(null);
    }
  }
    , [firebase, auth.currentUser]);

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {props.children}
    </UserDataContext.Provider>
  )
}

export const UserDataContext = createContext<UserDataContextType>(null as any);

export type UserDataContextType =
  {
    userData: null | UserDataType;
    setUserData: React.Dispatch<React.SetStateAction<UserDataContextType['userData']>>;
  };

export type UserDataType =
  {
    email: string;
    name: null | string;
    createdAt: string;
    role: string; // Default role, can be changed later
    avatar: string;
    recentSearches: {
      title: string;
      time: string;
    }[];
    generatedSheets: {
      html: string;
      topic: string;
      relatedTopics: string[];
      difficulty: string;
      programmingLanguage: string;
      generatedAt: string;
    }[];
  };

// Dummy data
const user = {
  name: 'John Doe',
  email: 'auth@gmail.com',
  role: 'Student',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  created: 24,
  explored: 12,
};

const recentSearches = [
  { title: 'Dynamic Programming', time: '2 hours ago' },
  { title: 'Binary Search Trees', time: '1 day ago' },
  { title: 'Graph Algorithms', time: '2 days ago' },
];

const generatedSheets = [
  {
    title: 'Dynamic Programming',
    desc: 'A comprehensive guide to DP patterns and problem-solving techniques.',
    time: '2 hours ago',
  },
  {
    title: 'Binary Search Trees',
    desc: 'Implementation, traversal, and common BST operations examples.',
    time: '1 day ago',
  },
  {
    title: 'Graph Algorithms',
    desc: 'DFS, BFS, and shortest path algorithms with examples.',
    time: '2 days ago',
  },
];