import axios from 'axios'

export async function sendDiscordMessage(
  webhookUrl: string,
  message: string
): Promise<void> {
  const data = {
    content: message
  }

  const response = await axios.post(webhookUrl, data)

  if (response.status !== 200) {
    throw new Error(`HTTP Error: ${response.status}`)
  }
}
