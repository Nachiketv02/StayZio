import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFavoriteStore = create((set) => ({
  favorites: [],
  setFavorites: (favorites) => set({ favorites }),
  addFavorite: (property) => 
    set((state) => ({ 
      favorites: [...state.favorites, { _id: property._id, propertyId: property } 
    ]})),
  removeFavorite: (propertyId) => 
    set((state) => ({ 
      favorites: state.favorites.filter(fav => 
        fav._id !== propertyId && fav.propertyId?._id !== propertyId
      )
    })),
}));

export default useFavoriteStore;