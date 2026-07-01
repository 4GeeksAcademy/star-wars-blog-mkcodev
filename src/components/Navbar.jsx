import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer()
  const navigate = useNavigate()

  const handleRemove = (fav, e) => {
    e.stopPropagation()
    dispatch({
      type: 'REMOVE_FAVORITE',
      payload: { uid: fav.uid, type: fav.type }
    })
  }

  return (
    <nav
      className="navbar navbar-dark sticky-top"
      style={{ backgroundColor: '#0d0f1a', borderBottom: '1px solid #2a2d3e' }}
    >
      <div className="container-fluid px-4">
        <Link to="/" className="navbar-brand">
          <span style={{ color: '#ffe81f', fontWeight: 700, letterSpacing: '3px', fontSize: '1rem' }}>
            STAR WARS
          </span>
        </Link>

        <div className="dropdown">
          <button
            className="btn btn-outline-warning btn-sm dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa-solid fa-heart me-1"></i>
            Favorites
            {store.favorites.length > 0 && (
              <span className="badge ms-2 bg-warning text-dark">{store.favorites.length}</span>
            )}
          </button>

          <ul
            className="dropdown-menu dropdown-menu-end"
            style={{
              backgroundColor: '#16181e',
              border: '1px solid #2a2d3e',
              minWidth: '280px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}
          >
            {store.favorites.length === 0 ? (
              <li>
                <span className="dropdown-item text-muted" style={{ fontSize: '0.85rem', cursor: 'default' }}>
                  No favorites saved yet...
                </span>
              </li>
            ) : (
              store.favorites.map((fav, index) => (
                <li
                  key={index}
                  className="dropdown-item d-flex justify-content-between align-items-center"
                  style={{ color: '#e8e8e8', cursor: 'pointer' }}
                  onClick={() => navigate(`/${fav.type}/${fav.uid}`)}
                >
                  <div>
                    <small
                      className="text-uppercase d-block"
                      style={{ color: '#ffe81f', fontSize: '0.65rem', letterSpacing: '1px' }}
                    >
                      {fav.type}
                    </small>
                    <span style={{ fontSize: '0.9rem' }}>{fav.name}</span>
                  </div>
                  <button
                    className="btn btn-sm ms-2"
                    style={{ color: '#ff5555', background: 'none', border: 'none', padding: '2px 6px' }}
                    onClick={(e) => handleRemove(fav, e)}
                    title="Remove from favorites"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
