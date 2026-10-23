import 'dotenv/config'
import express from 'express'
import { sql } from './config/db.js'
import adminRoutes from './route.js'

const app = express()

app.use(express.json())



async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS albums(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `



    await sql`
      CREATE TABLE IF NOT EXISTS songs(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255),
        audio VARCHAR(255) NOT NULL,
        album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log('✅ Database initialized successfully')
  } catch (error) {
    console.error('❌ Error initDB:', error)
    throw error
  }
}




app.use('/api/v1', adminRoutes)

const port = Number(process.env.PORT) || 7000

const startServer = async () => {
  try {
    await initDB()
    app.listen(port, () => {
      console.log(`Server is Running on Port ${port}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()