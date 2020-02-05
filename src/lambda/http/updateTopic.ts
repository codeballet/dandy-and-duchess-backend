import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { updateTopic } from '../../businessLogic/topics'
import { UpdateTopicRequest } from '../../requests/UpdateTopicRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('getTopic')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info(`updateTopic handler updating event`)

  const topicId = event .pathParameters.topicId
  const updatedTopic: UpdateTopicRequest = JSON.parse(event.body)
  const userId = getUserId(event)

  const changedTopic = await updateTopic(topicId, updatedTopic, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: changedTopic
    })
  } 
}