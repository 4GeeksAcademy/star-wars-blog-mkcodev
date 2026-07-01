export const Footer = () => (
  <footer
    className="text-center py-3"
    style={{ backgroundColor: '#0d0f1a', borderTop: '1px solid #2a2d3e', color: '#555' }}
  >
    <small>
      Data from{' '}
      <a href="https://www.swapi.tech" target="_blank" rel="noreferrer" style={{ color: '#ffe81f' }}>
        SWAPI.tech
      </a>
      {' · '}
      Images from{' '}
      <a href="https://starwars-visualguide.com" target="_blank" rel="noreferrer" style={{ color: '#ffe81f' }}>
        starwars-visualguide.com
      </a>
    </small>
  </footer>
)
