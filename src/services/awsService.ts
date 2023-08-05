import * as AWS from 'aws-sdk'
import * as core from '@actions/core'

type Context = {
  workflow: string
  eventName: string
  runId: number
  actor: string
  sha: string
  repo: {
    owner: string
    repo: string
  }
}

type Commit = {
  data: {
    commit: {
      message: string
    }
  }
}

interface SNSParams {
  awsAccessKeyId: string
  awsSecretAccessKey: string
  awsRegion: string
  snsTopicArn: string
}

export async function sendSNSMessage(
  token: string,
  context: Context,
  commit: Commit,
  params: SNSParams
): Promise<void> {
  const sns = new AWS.SNS({
    accessKeyId: params.awsAccessKeyId,
    secretAccessKey: params.awsSecretAccessKey,
    region: params.awsRegion
  })
  const message = formatMessage(context, commit)
  const snsData = {
    Message: message,
    Subject: 'GitHub Actions Workflow Execution Details',
    TopicArn: process.env.SNS_TOPIC_ARN
  }

  try {
    const data = await sns.publish(snsData).promise()
    core.info(`Message sent to SNS topic ${data.MessageId}`)
  } catch (err) {
    throw new Error(`Chime webhook failed with status ${err}`)
  }
}

function formatMessage(context: Context, commit: Commit): string {
  const runUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`
  return `
    Workflow Name: ${context.workflow}
    Event: ${context.eventName}
    Run URL: ${runUrl}
    Triggered By: ${context.actor}
    Commit URL: https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}
    Commit Message: ${commit.data.commit.message}
  `
}
