import axios from 'axios'

export async function sendDiscordMessage(
  webhookUrl: string,
  message: string
): Promise<void> {
  const url = webhookUrl
  const data = {
    content: message
  }
  const response = await axios.post(url, data)
  if (response.status !== 200) {
    throw new Error(`Discord webhook failed with status ${response.status}`)
  }
}
