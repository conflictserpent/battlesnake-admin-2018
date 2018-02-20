import AWS = require('aws-sdk')
import promisify = require('util.promisify')
import config from '../config'

const opts = {
  region: config.AWS_REGION,
  endpoint: config.AWS_DYNAMO_ENDPOINT,
}
AWS.config.update(opts)

let dynamodb = null

export const getDynamo = () => {
  if (!dynamodb) {
    dynamodb = new AWS.DynamoDB()
  }
  return dynamodb
}

export const getDocumentClient = () => {
  if (process.env.IS_OFFLINE) {
    return new AWS.DynamoDB.DocumentClient(opts)
  }
  return new AWS.DynamoDB.DocumentClient()
}

const dc = getDocumentClient()

// export const asyncGet = promisify(dc.get.bind(dc))
// export const asyncPut = promisify(dc.put.bind(dc))
// export const asyncUpdate = promisify(dc.update.bind(dc))
