import { getDocumentClient } from './client'

export interface ITeam {
  captainId: string // id of team captain. Also the table hash key

  teamName: string
  snakeUrl: string
  description?: string
  division: string
}

const TEAM_TABLE = 'teams'

export async function getTeam(teamId: string): Promise<ITeam> {
  const params = {
    TableName: TEAM_TABLE,
    Key: {
      captainId: teamId,
    },
  }
  const item = await getDocumentClient()
    .get(params)
    .promise()
  return item.Item as ITeam
}

export async function getTeams(): Promise<ITeam[]> {
  const params = {
    TableName: TEAM_TABLE,
  }
  const item = await getDocumentClient()
    .scan(params)
    .promise()
  return item.Items as ITeam[]
}

// TODO: Make sure user is on this team (otherwise - unauthorized)
export async function updateTeam(team: ITeam) {
  const params = {
    TableName: TEAM_TABLE,
    Key: {
      captainId: team.captainId,
    },
    UpdateExpression: 'set snakeUrl = :su, teamName = :tn, description = :desc, division = :div',
    ExpressionAttributeValues: {
      ':tn': team.teamName,
      ':su': team.snakeUrl,
      ':desc': team.description,
      ':div': team.division
    },
    ReturnValues: 'ALL_NEW',
  }

  const all = await getDocumentClient()
    .update(params)
    .promise()
  return all.Attributes
}
