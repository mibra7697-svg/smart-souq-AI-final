const express = require("express")
const cron = require("node-cron")
const axios = require("axios")

const app = express()
app.use(express.json())

// Poll payments every 30 seconds
cron.schedule("*/30 * * * * *", async () => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3002"}/api/poll-payments`)
  } catch (error) {
    // Silent error in production poller
  }
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
})
