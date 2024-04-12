import { Client } from '@/lib/db/schema';
import { create } from 'zustand';

type ClientStore = {
  client: Client | null;
  setClient: (client: Client) => void;
  getClient: () => Client | null;
};

export const useClientStore = create<ClientStore>((set, get) => ({
  client: null,
  setClient: (client: Client) => set({ client }),
  getClient: () => get().client,
}));
