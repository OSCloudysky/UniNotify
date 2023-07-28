import * as core from '@actions/core'
import * as service from './services'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    const message = core.getInput('message')
    await service.sendSlackMessage(token, message)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`Unexpected error: ${JSON.stringify(error)}`)
    }
  }
}

run()
