import axios from 'axios'
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
export async function sendDiscordMessage(
  webhookUrl: string,
  context: Context,
  commit: Commit
): Promise<void> {
  const url = webhookUrl
  const runUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`
  const embed = {
    embeds: [
      {
        title: 'Workflow Execution Details',
        fields: [
          {
            name: 'Workflow Name',
            value: context.workflow,
            inline: true
          },
          {
            name: 'Event',
            value: context.eventName,
            inline: true
          },
          {
            name: 'Run URL',
            value: `[Link to run](${runUrl})`,
            inline: true
          },
          {
            name: 'Triggered By',
            value: context.actor,
            inline: true
          },
          {
            name: 'Commit URL',
            value: `[Link to commit](https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha})`,
            inline: true
          },
          {
            name: 'Commit Message',
            value: commit.data.commit.message,
            inline: true
          }
        ]
      }
    ]
  }
  const response = await axios.post(url, embed)
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Discord webhook failed with status ${response.status}`)
  }
}
