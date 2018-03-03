/**
 * Most of the settings can be set via /scripts/env-{stage}.yml
 */
if (!process.env.SESSION_SECRET) {
  console.error('!!! `process.env.SESSION_SECRET` NOT SET')
}

const config = {
  // Client / Secret are provided by Github when you create a token
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

  // The callback URL is defined when you create a GH token
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,

  GITHUB_OAUTH_TOKEN: process.env.GITHUB_OAUTH_TOKEN,

  // Elasticache
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',

  // DynamoDB config options
  AWS_REGION: process.env.IS_OFFLINE ? 'localhost' : 'us-west-2',
  AWS_DYNAMO_ENDPOINT: process.env.IS_OFFLINE ? 'http://localhost:8000' : 'dynamodb.us-west-2.amazonaws.com',

  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || 'battlesnake.local',
  AUTH_REDIRECT_URL: process.env.AUTH_REDIRECT_URL || 'http://battlesnake.local:3000',

  HOMEPAGE: process.env.HOMEPAGE || 'https://s3-us-west-2.amazonaws.com/admin.battlesnake.io/index.html',

  SESSION_SECRET: process.env.SESSION_SECRET,
  BATTLESNAKE_TOURNAMENT_SERVER_HOST: process.env.BATTLESNAKE_TOURNAMENT_SERVER_HOST || process.env.BATTLESNAKE_SERVER_HOST,

  ALLOW_TEAM_EDIT: process.env.ALLOW_TEAM_EDIT
}

export default config
