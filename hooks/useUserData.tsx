import { UserDataContext } from '@/components/UserDataProvider';
import { useContext } from 'react';

export default function useUserData()
{
  return useContext(UserDataContext);
}