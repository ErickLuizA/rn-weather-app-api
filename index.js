import dotenv from 'dotenv'

dotenv.config()

import './src/server.js'
import {scheduleNotifications} from './src/notificationSchedule.js'

await scheduleNotifications()