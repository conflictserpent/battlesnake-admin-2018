const config = {
  // Default: localdev proxy
  SERVER: process.env.REACT_APP_SERVER || 'http://api.battlesnake.local:3009',
  GAME_SERVER: process.env.REACT_APP_GAME_SERVER || 'http://localhost:3001',
  TOURNAMENT_GAME_SERVER: process.env.REACT_APP_TOURNAMENT_GAME_SERVER || 'http://localhost:3001'
}

export default config
