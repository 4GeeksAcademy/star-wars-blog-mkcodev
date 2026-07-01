import { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import ItemCard from "../components/ItemCard"

export const Home = () => {
  const { store, dispatch } = useGlobalReducer()
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // dont fetch if we already have the data in the store
    if (store.characters.length > 0) return

    const fetchAll = async () => {
      setLoading(true)
      try {
        const [charsRes, planetsRes, vehiclesRes] = await Promise.all([
          fetch('https://www.swapi.tech/api/people/?page=1&limit=10'),
          fetch('https://www.swapi.tech/api/planets/?page=1&limit=10'),
          fetch('https://www.swapi.tech/api/vehicles/?page=1&limit=10')
        ])

        const charsData = await charsRes.json()
        const planetsData = await planetsRes.json()
        const vehiclesData = await vehiclesRes.json()

        dispatch({ type: 'SET_CHARACTERS', payload: charsData.results || [] })
        dispatch({ type: 'SET_PLANETS', payload: planetsData.results || [] })
        dispatch({ type: 'SET_VEHICLES', payload: vehiclesData.results || [] })

      } catch (err) {
        console.error('Something went wrong fetching the data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
    // TODO: pagination would be cool to add later
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // builds the list of items depending on the current filter
  const getItems = () => {
    let items = []

    if (activeFilter === 'all' || activeFilter === 'characters') {
      items = [...items, ...store.characters.map(c => ({ ...c, type: 'character' }))]
    }
    if (activeFilter === 'all' || activeFilter === 'planets') {
      items = [...items, ...store.planets.map(p => ({ ...p, type: 'planet' }))]
    }
    if (activeFilter === 'all' || activeFilter === 'vehicle') {
      items = [...items, ...store.vehicles.map(v => ({ ...v, type: 'vehicle' }))]
    }

    if (searchTerm.trim() !== '') {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return items
  }

  const items = getItems()

  return (
    <div style={{ backgroundColor: '#0b0d17', minHeight: '100vh' }}>
      <div className="container py-4">

        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h1 style={{ color: '#ffe81f', fontSize: '1.4rem', letterSpacing: '3px', textTransform: 'uppercase' }}>
            Browse Databank //
          </h1>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ maxWidth: '250px', backgroundColor: '#1a1d2e', border: '1px solid #333', color: '#e8e8e8' }}
          />
        </div>

        {/* filter buttons */}
        <div className="mb-4">
          <button
            className={`btn btn-sm me-2 mb-1 ${activeFilter === 'all' ? 'btn-warning' : 'btn-outline-secondary'}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button
            className={`btn btn-sm me-2 mb-1 ${activeFilter === 'characters' ? 'btn-warning' : 'btn-outline-secondary'}`}
            onClick={() => setActiveFilter('characters')}
          >
            Characters
          </button>
          <button
            className={`btn btn-sm me-2 mb-1 ${activeFilter === 'planets' ? 'btn-warning' : 'btn-outline-secondary'}`}
            onClick={() => setActiveFilter('planets')}
          >
            Planets
          </button>
          <button
            className={`btn btn-sm me-2 mb-1 ${activeFilter === 'vehicles' ? 'btn-warning' : 'btn-outline-secondary'}`}
            onClick={() => setActiveFilter('vehicles')}
          >
            Vehicles
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>Loading from a galaxy far, far away...</p>
          </div>
        ) : (
          <div className="row g-3">
            {items.map((item, idx) => (
              <div key={idx} className="col-6 col-md-4 col-lg-3 col-xl-2">
                <ItemCard
                  type={item.type}
                  uid={item.uid}
                  name={item.name}
                />
              </div>
            ))}

            {items.length === 0 && (
              <div className="col-12 text-center py-5">
                <p className="text-muted">Nothing found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
