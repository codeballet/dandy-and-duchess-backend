export interface Topic {
  userId: string
  topicId: string
  createdAt: string
  description: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}