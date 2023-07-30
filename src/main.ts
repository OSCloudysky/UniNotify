import * as core from '@actions/core'
import * as service from './services'

async function run(): Promise<void> {
  const message = core.getInput('message')
  const messageType = core.getInput('messageType')
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
