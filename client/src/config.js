const config = {
  // Default: localdev proxy
  SERVER: process.env.REACT_APP_SERVER || 'http://api.battlesnake.local:3009',
  GAME_SERVER: process.env.GAME_SERVER || 'http://localhost:3001'
}

export default config
