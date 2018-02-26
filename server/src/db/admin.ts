import { getDocumentClient } from './client'

const dynamoTable = "admins"

export interface IAdmin {
    username: string
}

export async function isAdmin(username: string): Promise<boolean> {
    const params = {
        TableName: dynamoTable,
        Key: {
            username: username,
        },
    }
    const item = await getDocumentClient()
        .get(params)
        .promise()
    return item.Item != null
}