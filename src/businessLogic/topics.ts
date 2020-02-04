import * as uuid from 'uuid'
import { TopicsAccess } from '../dataLayer/topicsAccess'
import { Topic } from '../models/Topic'
import { CreateTopicRequest } from '../requests/CreateTopicRequest'
// import { CreateTopicRequest } from '../requests/CreateTopicRequest'

const topicsAccess = new TopicsAccess()

export async function getAllTopics(userId: string): Promise<Topic[]> {
  return topicsAccess.getAllTopics(userId)
}

export async function createTopic(
  createTopicRequest: CreateTopicRequest, 
  userId: string
): Promise<Topic> {

  const topicId = uuid.v4()

  return await topicsAccess.createTopic({
    userId: userId,
    topicId: topicId,
    createdAt: new Date().toISOString(),
    description: createTopicRequest.description
  })
}