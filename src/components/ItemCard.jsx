import { useState } from "react"
import { Link } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

const getImageUrl = (type, uid) => {
  if (type === 'character') return `https://starwars-visualguide.com/assets/img/characters/${uid}.jpg`
  if (type === 'planet') return `https://starwars-visualguide.com/assets/img/planets/${uid}.jpg`
  if (type === 'vehicle') return `https://starwars-visualguide.com/assets/img/vehicles/${uid}.jpg`
  return ''
}

const ItemCard = ({ type, uid, name }) => {
  const { store, dispatch } = useGlobalReducer()
  const [imgFailed, setImgFailed] = useState(false)

  const isFavorite = store.favorites.some(
    f => f.uid === uid && f.type === type
  )

  const toggleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: { uid, type, name } })
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: { uid, type, name } })
    }
  }

  return (
    <div className="item-card h-100">
      <Link to={`/${type}/${uid}`} className="text-decoration-none">
        <div style={{ position: 'relative' }}>
          {imgFailed ? (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: '200px', background: '#1e2035', color: '#3a3d55' }}
            >
              <i className="fa-solid fa-image fa-2x"></i>
            </div>
          ) : (
            <img
              src={getImageUrl(type, uid)}
              alt={name}
              onError={() => setImgFailed(true)}
            />
          )}

          <button
            className="btn btn-sm position-absolute"
            style={{
              bottom: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.65)',
              border: '1px solid #3a3d55',
              color: isFavorite ? '#ffe81f' : '#888',
              lineHeight: 1,
              padding: '5px 8px'
            }}
            onClick={toggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <i className={isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
          </button>
        </div>

        <div className="p-2 pt-2">
          <p className="mb-0 text-white" style={{ fontSize: '0.82rem', fontWeight: 500, lineHeight: 1.3 }}>
            {name}
          </p>
          <small style={{ color: '#555', fontSize: '0.68rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            {type}
          </small>
        </div>
      </Link>
    </div>
  )
}

export default ItemCard
