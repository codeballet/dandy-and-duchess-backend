import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Topic } from '../models/Topic'
import { UpdateTopicRequest } from '../requests/UpdateTopicRequest'
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

  async deleteTopic(topicId: string, userId: string): Promise<any> {
    logger.info(`Deleting item with topicId ${topicId}`)

    const params = {
      TableName: this.topicsTable,
      Key: { topicId },
      ConditionExpression: 'userId = :uId',
      ExpressionAttributeValues: {
        ':uId': userId
      },
      ReturnValues: "ALL_OLD"
    }

    return await this.docClient.delete(params).promise()
  }

  async updateTopic(
    topicId: string,
    updatedTopic: UpdateTopicRequest,
    userId: string
  ): Promise<any> {
    logger.info(`dataLayer upodateTopic is updating topicId ${topicId}`)

    const params = {
      TableName: this.topicsTable,
      Key: { topicId },
      UpdateExpression: 'set description = :d, dueDate = :dD, done = :d',
      ConditionExpression: 'userId = :uId',
      ExpressionAttributeValues: {
        ':d':updatedTopic.description,
        ':dD':updatedTopic.dueDate,
        ':uId':userId
      },
      ReturnValues: "ALL_NEW"
    }

    return await this.docClient.update(params).promise()
  }

}