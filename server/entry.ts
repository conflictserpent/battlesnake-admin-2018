import serverless = require('serverless-http')
import app from './src/app'

export const handler = serverless(app)
export default handler
