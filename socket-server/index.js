import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  // Clients can optionally join a room per event to receive scoped updates
  socket.on('join-event-room', (eventId) => {
    if (!eventId) return
    socket.join(`event:${eventId}`)
  })
})

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// HTTP endpoint to broadcast reservation events from Adonis API
// This is a simple bridge so the Adonis app can notify this server
app.post('/broadcast/reservation-created', async (req, res) => {
  const payload = req.body || {}
  // Basic payload validation
  const {
    reservationId,
    eventId,
    eventTitle,
    eventDate,
    eventLocation,
    clientName,
    coupon,
    createdAt,
    remainingSeats,
  } = payload

  if (!reservationId || !eventId) {
    return res.status(400).json({ message: 'Missing reservationId or eventId' })
  }

  // Global emission
  io.emit('reservation-created', payload)
  // Scoped per-event room emission
  io.to(`event:${eventId}`).emit('reservation-created', payload)

  // Log for quick verification from console
  /* eslint-disable no-console */
  console.log('[reservation-created]', payload)

  res.json({ ok: true })
})

const PORT = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 5050
httpServer.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`[socket] listening on :${PORT}`)
})


