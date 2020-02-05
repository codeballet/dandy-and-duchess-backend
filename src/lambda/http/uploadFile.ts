import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { uploadFile } from '../../businessLogic/topics'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const s3 = new AWS.S3({ signatureVersion: 'v4' })
const logger = createLogger('generateUploadUrl')

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info(`upploadFile is processing event`)

  const topicId = event.pathParameters.topicId
  const userId = getUserId(event)

  const newImage = await uploadFile(topicId, userId)

  const uploadUrl = getUploadUrl(topicId)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      imageData: newImage,
      uploadUrl: uploadUrl
    })
  }
  
}

function getUploadUrl(topicId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: topicId,
    Expires: urlExpiration
  })
}