import {WebClient} from '@slack/web-api'

export async function sendSlackMessage(
  token: string,
  message: string
): Promise<void> {
  const web = new WebClient(token)
  await web.chat.postMessage({
    channel: '#general',
    text: message
  })
}
