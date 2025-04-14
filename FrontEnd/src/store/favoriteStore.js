import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFavoriteStore = create(
  persist(
    (set) => ({
      favorites: [],
      addFavorite: (property) => 
        set((state) => ({
          favorites: [...state.favorites, property]
        })),
      removeFavorite: (propertyId) => 
        set((state) => ({
          favorites: state.favorites.filter((p) => p._id !== propertyId)
        })),
      setFavorites: (properties) => set({ favorites: properties }),
      clearFavorites: () => set({ favorites: [] })
    }),
    {
      name: 'favorites-storage',
    }
  )
);

export default useFavoriteStore;