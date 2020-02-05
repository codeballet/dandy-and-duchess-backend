import * as uuid from 'uuid'
import { TopicsAccess } from '../dataLayer/topicsAccess'
import { Topic } from '../models/Topic'
import { CreateTopicRequest } from '../requests/CreateTopicRequest'
import { UpdateTopicRequest } from '../requests/UpdateTopicRequest'

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
    description: createTopicRequest.description,
    dueDate: createTopicRequest.dueDate,
    done: false
  })
}

export async function deleteTopic(
  topicId: string, 
  userId: string
): Promise<Topic> {

  return await topicsAccess.deleteTopic(topicId, userId)
}

export async function updateTopic(
  topicId: string,
  updatedTopic: UpdateTopicRequest,
  userId: string
): Promise<any> {

  return await topicsAccess.updateTopic(topicId, updatedTopic, userId)
}

export async function uploadFile(
  topicId: string, userId: string
): Promise<string> {

  return await topicsAccess.updateUrl(topicId, userId)
}