import { Expo } from 'expo-server-sdk'

import { getCurrentWeather } from './weatherApi.js'
import { kelvinToCelsius } from './utils/kevinToCelsius.js'

const expo = new Expo()

export async function sendNotification(pushTokens) {
  const messages = []

  for (const pushToken of pushTokens) {
    if (!Expo.isExpoPushToken(pushToken.token)) {
      console.error(`Push token ${pushToken.token} is not a valid Expo push token`)

      continue
    }

    try {
      const response = await getCurrentWeather(pushToken.lat, pushToken.lon)

      const title = response.name 

      const body = `${kelvinToCelsius(response.main.temp)} °C`

      messages.push({
        to: pushToken.token,
        sound: 'default',
        title,
        body,
      })
    } catch (error) {
      console.error('Failure getting weather')
    }
  }

  const chunks = expo.chunkPushNotifications(messages)

  const tickets = []

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk)

        tickets.push(...ticketChunk)
      } catch (error) {
        console.error(error)
      }
    }

  const receiptIds = []

  for (const ticket of tickets) {
    if (ticket.id) {
      receiptIds.push(ticket.id)
    }
  }

  const  receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds)

    for (const chunk of receiptIdChunks) {
      try {
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk)

        for (const receiptId in receipts) {
          const { status, message, details } = receipts[receiptId]

          if (status === 'ok') {
            continue
          } else if (status === 'error') {
            console.error(
              `There was an error sending a notification: ${message}`
            )

            if (details && details.error) {
              console.error(`The error code is ${details.error}`)
            }
            
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
}
