import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { calculateAll } from '../src/utils/calculations.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use(express.static(join(__dirname, '../dist')))

app.post('/api/calculate', (req, res) => {
  try {
    const data = req.body
    const results = calculateAll(data)
    res.json(results)
  } catch (error) {
    console.error('Calculation error:', error)
    res.status(500).json({ error: 'Error calculating ROI' })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})