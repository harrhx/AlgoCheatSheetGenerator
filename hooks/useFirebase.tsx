import { FirebaseContext } from '@/components/FirebaseProvider';
import { useContext } from 'react';

export default function useFirebase()
{
  return useContext(FirebaseContext);
}