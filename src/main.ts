import * as core from '@actions/core'
import * as service from './services'

async function run(): Promise<void> {
  try {
    const token = core.getInput('slackToken')
    const message = core.getInput('message')
    const messageType = core.getInput('messageType')
    if (messageType === 'slack') {
      await service.sendSlackMessage(token, message)
    } else if (messageType === 'discord') {
      core.debug('Sending discord message')
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
