import { getDocumentClient } from './client'

export interface IUser {
  id: string
  displayName: string | null
  userName: string

  // If the user is a captain then they'll be a team
  isTeamCaptain?: boolean
  team?: string

  teamMember?: string
}

const USER_TABLE = 'users'

export function putUser(user: IUser) {
  const params = {
    TableName: USER_TABLE,
    Item: user,
  }
  return getDocumentClient().put(params).promise()
}

export async function findUserById(id: string) {
  const params = {
    TableName: USER_TABLE,
    Key: {
      id,
    },
  }
  const item = await getDocumentClient().get(params).promise()
  return item.Item
}
