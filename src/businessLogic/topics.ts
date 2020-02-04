// import * as uuid from 'uuid'
import { TopicsAccess } from '../dataLayer/topicsAccess'
import { Topic } from '../models/Topic'
// import { CreateTopicRequest } from '../requests/CreateTopicRequest'

const topicsAccess = new TopicsAccess()

export async function getAllTopics(userId: string): Promise<Topic[]> {
  return TopicsAccess.getAllTopics(userId)
}