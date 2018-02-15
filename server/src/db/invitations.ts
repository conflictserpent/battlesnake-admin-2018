import { getDocumentClient } from './client'
import promisify = require('util.promisify')

export interface IInvitation {
  userId: string
  teamId: string
}

const INVITATION_TABLE = 'invitations'

export function addInvitation(userId: string, teamId: string) {
  const params = {
    TableName: INVITATION_TABLE,
    Item: {
      invitationId: [userId, teamId].join('::'),
      userId,
      teamId,
    },
    ConditionalExpress: "attribute_not_exists(invitationId)" 
  }

  return getDocumentClient().put(params).promise()
}

export async function getInvitation(userId: string, teamId: string) {
  const params = {
    TableName: INVITATION_TABLE,
    Key: {
      invitationId: [userId, teamId].join('::'),
    }
  }

  const item = await getDocumentClient().get(params).promise()
  return item.Item
}
