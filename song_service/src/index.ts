import express from 'express'
import dotenv from 'dotenv'
import songRoute from './routes.js'

dotenv.config()



const app =express()
app.use(express.json())



app.use('/api/v1', songRoute)


const port = process.env.PORT || 8000



const startServer = async () => {
    app.listen(port, () => { 
        console.log(`Server is Running on Port ${port}`)
    })
}

startServer()