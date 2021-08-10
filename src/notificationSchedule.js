import schedule from 'node-schedule'

import { getAllTokens } from './firebase.js'
import { sendNotification } from './expo.js'

export async function scheduleNotifications() {
  schedule.scheduleJob({
    hour: 12,
    minute: 0,
  }, async () => {
    const tokens = await getAllTokens()
  
    await sendNotification(tokens)
  })
}