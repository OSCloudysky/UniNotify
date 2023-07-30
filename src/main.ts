import * as core from '@actions/core'
import * as github from '@actions/github'
import * as service from './services'
import {Octokit} from '@octokit/rest'

async function run(): Promise<void> {
  const messageType = core.getInput('messageType')
  const githubToken = core.getInput('githubToken')

  // Get more details information of the job
  const context = github.context
  const octokit = new Octokit({auth: `token ${githubToken}`})

  const commit = await octokit.repos.getCommit({
    owner: context.repo.owner,
    repo: context.repo.repo,
    ref: context.sha
  })

  const message = `
    Workflow: ${context.workflow} 
    Job: ${context.job}
    Status: ${context.payload.action}
    Commit Message: ${commit.data.commit.message}
    Commit URL: https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}
    Event: ${context.eventName}
    Runner: ${context.runId}
    Ref: ${context.ref}
  `

  try {
    const token = core.getInput('slackToken')
    if (messageType === 'slack') {
      await service.sendSlackMessage(token, message)
    } else if (messageType === 'discord') {
      const webhookUrl = core.getInput('discordWebhookUrl')
      await service.sendDiscordMessage(webhookUrl, message)
    } else if (messageType === 'chime') {
      const webhookUrl = core.getInput('chimeWebhookUrl')
      await service.sendChimeMessage(webhookUrl, message)
    } else if (messageType === 'teams') {
      const webhookUrl = core.getInput('teamsWebhookUrl')
      await service.sendChimeMessage(webhookUrl, message)
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
