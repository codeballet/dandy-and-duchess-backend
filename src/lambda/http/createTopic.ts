import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createTopic } from '../../businessLogic/topics'
import { CreateTopicRequest } from '../../requests/CreateTopicRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('createTopic')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`createTopic is processing event`)

  // Create a new topic
  const topicRequest: CreateTopicRequest = JSON.parse(event.body)

  const userId = getUserId(event)
  logger.info(`Received userId: ${userId}`)

  const newTopic = await createTopic(topicRequest, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newTopic
    })
  }}
