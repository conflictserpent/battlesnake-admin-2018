/**
 * Most of the settings can be set via /scripts/env-{stage}.yml
 */
const config = {
  // Client / Secret are provided by Github when you create a token
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  
  // The callback URL is defined when you create a GH token
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  
  // Elasticache
  REDIS_HOST: process.env.REDIS_HOST || 'localhost'
}

export default config