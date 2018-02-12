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
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',

  // DynamoDB config options
  AWS_REGION: process.env.IS_OFFLINE ? 'localhost' : 'us-west-2',
  AWS_DYNAMO_ENDPOINT: process.env.IS_OFFLINE ? 'http://localhost:8000' : 'fill-this-in',
}

export default config