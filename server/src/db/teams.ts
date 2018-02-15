import { getDocumentClient, asyncPut } from './client'

export interface ITeam {
  captainId: string // id of team captain. Also the table hash key
  teamName: string
  snakeUrl: string
}

const TEAM_TABLE = 'teams'

export async function getTeam(teamId: string) {
  const params = {
    TableName: TEAM_TABLE,
    Key: {
      captainId: teamId,
    },
  }
  const item = await getDocumentClient()
    .get(params)
    .promise()
  return item.Item
}


// TODO: Make sure user is on this team (otherwise - unauthorized)
export async function updateTeam(team: ITeam ) {
  const params = {
    TableName: TEAM_TABLE,
    Item: {
      ...team
    },
  }
  return asyncPut(params)
}
