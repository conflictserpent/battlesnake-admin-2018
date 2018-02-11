import { getDocumentClient } from './client'
import { promisify } from 'util'

export interface IUser {
  id: string
  displayName: string | null
  userName: string
}

const USER_TABLE = 'users'

export function putUser(user: IUser) {
  const dc = getDocumentClient()
  const asyncPut = promisify(dc.put.bind(dc))

  const params = {
    TableName: USER_TABLE,
    Item: user,
  }

  return asyncPut(params)
}
