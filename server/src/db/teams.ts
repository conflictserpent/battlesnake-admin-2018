import { getDocumentClient } from './client'
import * as AWS from 'aws-sdk'

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

  const teams: ITeam[] = []
  let cursor = null
  do {
    const params: AWS.DynamoDB.ScanInput = {
      TableName: TEAM_TABLE,
      ExclusiveStartKey: cursor
    }
    const item = await getDocumentClient()
      .scan(params)
      .promise()
    for (const i of item.Items as ITeam[]) {
      teams.push(i)
    }
    cursor = item.LastEvaluatedKey
  } while (cursor)
  return teams
}

// TODO: Make sure user is on this team (otherwise - unauthorized)
export async function updateTeam(team: ITeam) {
  const eavals = {
    ':tn': team.teamName,
    ':desc': team.description,
    ':div': team.division
  }
  let uexpr = 'set teamName = :tn, description = :desc, division = :div'

  // snake URL is optional, so check if one is passed to add to update vals/expression
  if (team.snakeUrl) {
    eavals[':su'] = team.snakeUrl
    uexpr += ', snakeUrl = :su'
  }

  const params = {
    TableName: TEAM_TABLE,
    Key: {
      captainId: team.captainId,
    },
    UpdateExpression: uexpr,
    ExpressionAttributeValues: eavals,
    ReturnValues: 'ALL_NEW',
  }

  const all = await getDocumentClient()
    .update(params)
    .promise()
  return all.Attributes
}
