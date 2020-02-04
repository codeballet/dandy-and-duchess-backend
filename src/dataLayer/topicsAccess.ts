import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Topic } from '../models/Topic'
import { createLogger } from '../utils/logger'

const logger = createLogger('topicsAccess')

export class TopicsAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly topicsTable = process.env.TOPICS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX
  ) {}

  async getAllTopics(userId: string): Promise<Topic[]> {
    logger.info(`Getting all Topics for user ${userId}`)

    const result = await this.docClient.query({
      TableName: this.topicsTable,
      IndexName: this.userIdIndex,
      KeyConditionExpression: 'userId = :uId',
      ExpressionAttributeValues: {
        ':uId': userId
      }
    }).promise()

    const items = result.Items
    return items as Topic[]
  }

  async createTopic(topic: Topic): Promise<Topic> {
    logger.info(`Creating a topic with topicId ${topic.topicId}`)

    await this.docClient.put({
      TableName: this.topicsTable,
      Item: topic
    }).promise()

    return topic
  }

}