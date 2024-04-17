import { Client } from '@/lib/db/schema';
import { create } from 'zustand';

type ClientStore = {
  client: Client | null;
  setClient: (client: Client) => void;
};

export const useClientStore = create<ClientStore>((set) => ({
  client: null,
  setClient: (client: Client) => set({ client }),
}));
