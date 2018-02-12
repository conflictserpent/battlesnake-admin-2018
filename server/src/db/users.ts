import { getDocumentClient } from './client'
import { promisify } from 'util'

export interface IUser {
  id: string
  displayName: string | null
  userName: string

  // If the user is a captain then they'll be a team
  isTeamCaptain: boolean
  team?: string

  teamMember?: string
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

export async function findUserById(id: string) {
  const dc = getDocumentClient()
  const asyncGet = promisify(dc.get.bind(dc))
  const params = {
    TableName: USER_TABLE,
    Key: {
      id,
    },
  }
  const item = await asyncGet(params)
  return item.Item
}
