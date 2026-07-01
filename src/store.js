export const initialStore = () => {
  // load saved favorites from localStorage if they exist
  let savedFavorites = []
  try {
    const stored = localStorage.getItem('starwars_favorites')
    if (stored) {
      savedFavorites = JSON.parse(stored)
    }
  } catch(e) {
    console.error('Error loading favorites from localStorage', e)
  }

  return {
    characters: [],
    planets: [],
    vehicles: [],
    favorites: savedFavorites
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type) {

    case 'SET_CHARACTERS':
      return { ...store, characters: action.payload }

    case 'SET_PLANETS':
      return { ...store, planets: action.payload }

    case 'SET_VEHICLES':
      return { ...store, vehicles: action.payload }

    case 'ADD_FAVORITE': {
      // check if the item is already in favorites to avoid duplicates
      const alreadyFav = store.favorites.some(
        fav => fav.uid === action.payload.uid && fav.type === action.payload.type
      )
      if (alreadyFav) return store

      const newFavorites = [...store.favorites, action.payload]
      localStorage.setItem('starwars_favorites', JSON.stringify(newFavorites))
      return { ...store, favorites: newFavorites }
    }

    case 'REMOVE_FAVORITE': {
      const newFavorites = store.favorites.filter(
        fav => !(fav.uid === action.payload.uid && fav.type === action.payload.type)
      )
      localStorage.setItem('starwars_favorites', JSON.stringify(newFavorites))
      return { ...store, favorites: newFavorites }
    }

    default:
      throw Error('Unknown action: ' + action.type)
  }
}
