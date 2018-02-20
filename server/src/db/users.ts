import { getDocumentClient } from './client'

export interface IUser {
  // Info from Github
  displayName: string | null
  username: string

  // If the user is a captain then they'll be a team
  id?: string // might be null: user could be invited, but not signed in yet
  isTeamCaptain: boolean
  teamId?: string
}

const setDefaults = (u: IUser): IUser => {
  const user: IUser = {
    username: u.username,
    id: u.id || null,
    displayName: u.displayName || null,
    isTeamCaptain: u.isTeamCaptain || false,
    teamId: u.teamId || null,
  }
  return user
}

const USER_TABLE = 'users'

export async function updateUser(u: IUser): Promise<IUser> {
  const user = setDefaults(u)
  const params = {
    TableName: USER_TABLE,
    Key: {
      username: user.username,
    },
    UpdateExpression:
      'set displayName = :dn, id = :id, isTeamCaptain = :tc, teamId = :t, teamMember = :tm',
    ExpressionAttributeValues: {
      ':dn': user.displayName,
      ':id': user.id,
      ':tc': user.isTeamCaptain,
      ':t': user.teamId,
    },
    ReturnValues: 'ALL_NEW',
  }
  const res = await getDocumentClient()
    .update(params)
    .promise()
  return res.Attributes as IUser
}

export async function findUserByUserName(id: string): Promise<IUser> {
  const params = {
    TableName: USER_TABLE,
    Key: {
      username: id,
    },
  }
  const item = await getDocumentClient()
    .get(params)
    .promise()
  return item.Item as IUser
}

export async function getTeamMembers(teamId: string): Promise<IUser[]> {
  const params = {
    TableName: USER_TABLE,
    KeyConditionExpression: '#tm = :tid',
    ExpressionAttributeNames: {
      '#tm': 'teamId',
    },
    ExpressionAttributeValues: {
      ':tid': teamId,
    },
  }
  const result = await getDocumentClient()
    .query(params)
    .promise()
  return result.Items as IUser[]
}
