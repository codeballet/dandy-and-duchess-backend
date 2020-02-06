import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTopic } from '../../businessLogic/topics'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTopic')
const s3 = new AWS.S3()
const bucketName = process.env.IMAGES_S3_BUCKET

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info(`deleteTopic is processing event`)

  // Remove a topic by id
  const topicId = event.pathParameters.topicId
  const userId = getUserId(event)

  const deletedTopic = await deleteTopic(topicId, userId)

  // Remove the image from S3
  const params = {
    Bucket: bucketName,
    Key: topicId
  }

  try {
    await s3.headObject(params).promise()
    logger.info('File found in S3')
    try {
      await s3.deleteObject(params).promise()
      logger.info('File deleted successfully')
    } catch (e) {
      logger.info(`ERROR in deleting file: ${e}`)
    }
  } catch (e) {
    logger.info(`File not found ERROR: ${e}`)
  }

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: deletedTopic
    })
  }

}
