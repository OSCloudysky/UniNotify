import {WebClient} from '@slack/web-api'
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

export async function sendSlackMessage(
  token: string,
  context: Context,
  commit: Commit
): Promise<void> {
  // Styling the message
  const runUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`
  const message = {
    text: 'GitHub Actions Workflow Execution Details',
    blocks: [
      {
        type: 'divider' // divider at the top
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Workflow Name:* ${context.workflow}`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Event:* ${context.eventName}`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Run URL:* <${runUrl}>`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Triggered By:* ${context.actor}`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Commit URL:* <https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}>`
        }
      },
      {
        type: 'divider' // divider at the top
      }
    ]
  }

  const web = new WebClient(token)
  await web.chat.postMessage({
    channel: '#general',
    text: message.text,
    blocks: message.blocks
  })
}
