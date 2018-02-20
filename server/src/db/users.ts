import { getDocumentClient } from './client'

export interface IUser {
  // Info from Github
  displayName: string | null
  username: string
  
  // If the user is a captain then they'll be a team
  id?: string  // might be null: user could be invited, but not signed in yet
  isTeamCaptain: boolean
  team?: string
  teamMember?: string
}

const setDefaults = (u: IUser): IUser => {
  const user: IUser = {
    username: u.username,
    id: u.id || null,
    displayName: u.displayName || null,
    isTeamCaptain: u.isTeamCaptain || false,
    team: u.team || null,
    teamMember: u.teamMember || null,
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
      'set displayName = :dn, id = :id, isTeamCaptain = :tc, team = :t, teamMember = :tm',
    ExpressionAttributeValues: {
      ':dn': user.displayName,
      ':id': user.id,
      ':tc': user.isTeamCaptain,
      ':t': user.team,
      ':tm': user.teamMember,
    },
    ReturnValues: 'ALL_NEW',
  }
  const res = await getDocumentClient()
    .update(params)
    .promise()
  return res.Attributes as IUser
}

export async function findUserById(id: string): Promise<IUser> {
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
