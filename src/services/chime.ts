import axios from 'axios'

export async function sendChimeMessage(
  webhookUrl: string,
  message: string
): Promise<void> {
  const data = {
    Content: message
  }

  const response = await axios.post(webhookUrl, data)

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Chime webhook failed with status ${response.status}`)
  }
}
