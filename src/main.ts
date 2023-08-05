import * as core from '@actions/core'
import * as github from '@actions/github'
import * as service from './services'
import {Octokit} from '@octokit/rest'
import fetch from 'node-fetch'

async function run(): Promise<void> {
  const messageType = core.getInput('messageType')
  const githubToken = core.getInput('githubToken')

  // Get more details information of the job
  const context = github.context
  const octokit = new Octokit({auth: `token ${githubToken}`, request: {fetch}})

  const commit = await octokit.repos.getCommit({
    owner: context.repo.owner,
    repo: context.repo.repo,
    ref: context.sha
  })

  const runUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`

  const message = `
    Workflow Name: ${context.workflow}
    Event: ${context.eventName}
    Run URL: ${runUrl}
    Triggered By: ${context.actor}
    Commit URL: https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}
    Commit Message: ${commit.data.commit.message}
  `

  try {
    const token = core.getInput('slackToken')
    if (messageType === 'slack') {
      await service.sendSlackMessage(token, context, commit)
    } else if (messageType === 'discord') {
      const webhookUrl = core.getInput('discordWebhookUrl')
      await service.sendDiscordMessage(webhookUrl, context, commit)
    } else if (messageType === 'chime') {
      const webhookUrl = core.getInput('chimeWebhookUrl')
      await service.sendChimeMessage(webhookUrl, context, commit)
    } else if (messageType === 'teams') {
      const webhookUrl = core.getInput('teamsWebhookUrl')
      await service.sendTeamsMessage(webhookUrl, message)
    } else if (messageType === 'sns') {
      const snsParams = {
        awsAccessKeyId: core.getInput('awsAccessKeyId', {required: false}),
        awsSecretAccessKey: core.getInput('awsSecretAccessKey', {
          required: false
        }),
        awsRegion: core.getInput('awsRegion', {required: false}),
        snsTopicArn: core.getInput('snsTopicArn', {required: false})
      }

      if (
        snsParams.awsAccessKeyId &&
        snsParams.awsSecretAccessKey &&
        snsParams.awsRegion &&
        snsParams.snsTopicArn
      ) {
        await service.sendSNSMessage(token, context, commit, snsParams)
      }
    } else {
      core.setFailed(
        'Unsupported messageType. Supported types are "slack" and "discord"'
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`Unexpected error: ${JSON.stringify(error)}`)
    }
  }
}

run()
