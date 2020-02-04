import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Topic } from '../models/Topic'
import { createLogger } from '../utils/logger'

