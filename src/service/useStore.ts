import { create } from 'zustand';
import { UserProps } from '../interface/user';

interface StoreState{
  userStore: UserProps | "OFF" | null;
  setUserStore: (userStore: UserProps) => void;
}

export const useStore = create<StoreState>((set) => ({
  userStore: null,
  setUserStore: (userStore) => set({ userStore }),
}))