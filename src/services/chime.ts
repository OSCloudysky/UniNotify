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
export async function sendChimeMessage(
  webhookUrl: string,
  context: Context,
  commit: Commit
): Promise<void> {
  const runUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`
  const message = `
  Workflow Name: ${context.workflow}
  Event: ${context.eventName}
  Run URL: ${runUrl}
  Triggered By: ${context.actor}
  Commit URL: https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}
  Commit Message: ${commit.data.commit.message}
`
  const data = {
    Content: message
  }

  const response = await axios.post(webhookUrl, data)

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Chime webhook failed with status ${response.status}`)
  }
}
