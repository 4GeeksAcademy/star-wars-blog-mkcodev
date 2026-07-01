import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

const getImageUrl = (type, uid) => {
  if (type === 'character') return `https://starwars-visualguide.com/assets/img/characters/${uid}.jpg`
  if (type === 'planet') return `https://starwars-visualguide.com/assets/img/planets/${uid}.jpg`
  if (type === 'vehicle') return `https://starwars-visualguide.com/assets/img/vehicles/${uid}.jpg`
  return ''
}

const getApiUrl = (type, uid) => {
  if (type === 'character') return `https://www.swapi.tech/api/people/${uid}`
  if (type === 'planet') return `https://www.swapi.tech/api/planets/${uid}`
  if (type === 'vehicle') return `https://www.swapi.tech/api/vehicles/${uid}`
  return ''
}

export const Single = () => {
  const { type, id } = useParams()
  const { store, dispatch } = useGlobalReducer()
  const [details, setDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imgFailed, setImgFailed] = useState(false)

  const isFavorite = store.favorites.some(
    f => f.uid === id && f.type === type
  )

  useEffect(() => {
    setIsLoading(true)
    setDetails(null)
    setImgFailed(false)

    fetch(getApiUrl(type, id))
      .then(res => res.json())
      .then(data => {
        console.log(data) // debug - remove later
        setDetails(data.result)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Error loading details:', err)
        setIsLoading(false)
      })
  }, [type, id])

  const toggleFavorite = () => {
    const name = details?.properties?.name || 'Unknown'
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: { uid: id, type } })
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: { uid: id, type, name } })
    }
  }

  // returns the list of properties to show depending on the type
  const getProperties = (props) => {
    if (type === 'character') {
      return [
        { label: 'Gender', value: props.gender },
        { label: 'Birth year', value: props.birth_year },
        { label: 'Height', value: props.height ? props.height + ' cm' : null },
        { label: 'Mass', value: props.mass ? props.mass + ' kg' : null },
        { label: 'Hair color', value: props.hair_color },
        { label: 'Eye color', value: props.eye_color },
        { label: 'Skin color', value: props.skin_color },
      ]
    }
    if (type === 'planet') {
      return [
        { label: 'Population', value: props.population },
        { label: 'Climate', value: props.climate },
        { label: 'Terrain', value: props.terrain },
        { label: 'Diameter', value: props.diameter ? props.diameter + ' km' : null },
        { label: 'Gravity', value: props.gravity },
        { label: 'Orbital period', value: props.orbital_period ? props.orbital_period + ' days' : null },
        { label: 'Rotation period', value: props.rotation_period ? props.rotation_period + ' hrs' : null },
        { label: 'Surface water', value: props.surface_water ? props.surface_water + '%' : null },
      ]
    }
    if (type === 'vehicle') {
      return [
        { label: 'Model', value: props.model },
        { label: 'Manufacturer', value: props.manufacturer },
        { label: 'Class', value: props.vehicle_class },
        { label: 'Length', value: props.length ? props.length + ' m' : null },
        { label: 'Crew', value: props.crew },
        { label: 'Passengers', value: props.passengers },
        { label: 'Max speed', value: props.max_atmosphering_speed },
        { label: 'Cargo capacity', value: props.cargo_capacity },
        { label: 'Cost', value: props.cost_in_credits ? props.cost_in_credits + ' credits' : null },
        { label: 'Consumables', value: props.consumables },
      ]
    }
    return []
  }

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '80vh', backgroundColor: '#0b0d17' }}
      >
        <div className="text-center">
          <div className="spinner-border text-warning mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!details) {
    return (
      <div
        className="d-flex justify-content-center align-items-center flex-column gap-3"
        style={{ minHeight: '80vh', backgroundColor: '#0b0d17' }}
      >
        <p className="text-muted">Could not load this item.</p>
        <Link to="/" className="btn btn-outline-warning btn-sm">← Back to databank</Link>
      </div>
    )
  }

  const props = details.properties || {}
  const properties = getProperties(props)

  return (
    <div style={{ backgroundColor: '#0b0d17', minHeight: '100vh' }}>
      <div className="container-fluid p-0">
        <div className="row g-0">

          {/* Image side */}
          <div className="col-12 col-md-5" style={{ maxHeight: '100vh', overflow: 'hidden', position: 'sticky', top: '58px' }}>
            {imgFailed ? (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ height: '70vh', background: '#1e2035', color: '#3a3d55' }}
              >
                <i className="fa-solid fa-image fa-4x"></i>
              </div>
            ) : (
              <img
                src={getImageUrl(type, id)}
                alt={props.name}
                onError={() => setImgFailed(true)}
                style={{ width: '100%', height: '100vh', objectFit: 'cover', objectPosition: 'top' }}
              />
            )}
          </div>

          {/* Info side */}
          <div className="col-12 col-md-7 py-5 px-4 px-md-5">
            <Link
              to="/"
              className="text-decoration-none d-inline-block mb-4"
              style={{ color: '#666', fontSize: '0.78rem', letterSpacing: '1px' }}
            >
              ← Back to databank
            </Link>

            <div className="d-flex align-items-start gap-3 mb-3 mt-2">
              <h1 style={{ color: '#e8e8e8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', lineHeight: 1.2, fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}>
                {props.name}
              </h1>
              <button
                className={`btn btn-sm flex-shrink-0 ${isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
                onClick={toggleFavorite}
                style={{ marginTop: '4px' }}
              >
                <i className={isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
              </button>
            </div>

            <small
              className="d-inline-block mb-3"
              style={{ color: '#ffe81f', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.72rem' }}
            >
              {type}
            </small>

            <p style={{ color: '#888', lineHeight: 1.75, maxWidth: '520px', fontSize: '0.9rem' }}>
              {details.description || 'No description available for this entry.'}
            </p>

            <hr style={{ borderColor: '#2a2d3e', marginTop: '2rem', marginBottom: '2rem' }} />

            <div className="row">
              {properties.map((prop, i) => (
                <div key={i} className="col-6 col-sm-4 mb-4">
                  <p className="detail-label mb-1">{prop.label}</p>
                  <p className="detail-value mb-0">{prop.value || 'unknown'}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
