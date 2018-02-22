import { getDocumentClient } from './client'

export interface ITeam {
  captainId: string // id of team captain. Also the table hash key

  teamName: string
  snakeUrl: string
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

// TODO: Make sure user is on this team (otherwise - unauthorized)
export async function updateTeam(team: ITeam) {
  const params = {
    TableName: TEAM_TABLE,
    Key: {
      captainId: team.captainId,
    },
    UpdateExpression: 'set snakeUrl = :su, teamName = :tn',
    ExpressionAttributeValues: {
      ':tn': team.teamName,
      ':su': team.snakeUrl,
    },
    ReturnValues: 'ALL_NEW',
  }

  const all = await getDocumentClient()
    .update(params)
    .promise()
  return all.Attributes
}
