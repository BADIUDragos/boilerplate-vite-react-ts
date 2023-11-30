import { useSelector } from 'react-redux';
import { RootState } from '../index';

export const useTokens = () => {
  return useSelector((state: RootState) => state.auth.tokens);
};

export const useUserInfo = () => {
  return useSelector((state: RootState) => state.auth.userInfo);
};
