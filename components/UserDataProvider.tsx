import { createContext, PropsWithChildren, useState } from 'react';

export default function UserDataProvider(props: PropsWithChildren)
{
  const [userData, setUserData] = useState<UserDataContextType['userData']>({
    user,
    recentSearches,
    generatedSheets,
  });

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {props.children}
    </UserDataContext.Provider>
  )
}

export const UserDataContext = createContext<UserDataContextType>(null as any);

export type UserDataContextType =
  {
    userData:
    {
      user: typeof user;
      recentSearches: typeof recentSearches;
      generatedSheets: typeof generatedSheets;
    };
    setUserData: React.Dispatch<React.SetStateAction<UserDataContextType['userData']>>;
  };

// Dummy data
const user = {
  name: 'John Doe',
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