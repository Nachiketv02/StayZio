import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useFavoriteStore = create(
  persist(
    (set) => ({
      favorites: [],
      addFavorite: (property) =>
        set((state) => ({
          favorites: [...state.favorites, property],
        })),
      removeFavorite: (propertyId) =>
        set((state) => ({
          favorites: state.favorites.filter((p) => p.id !== propertyId),
        })),
      isFavorite: (propertyId) =>
        set((state) => state.favorites.some((p) => p.id === propertyId)),
    }),
    {
      name: 'favorites-storage',
    }
  )
)

export default useFavoriteStore