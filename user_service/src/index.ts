import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRoute from './router.js'

dotenv.config()

const app = express()


app.use(express.json())




const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string, {
            dbName: 'spotifyDB'
        })
        console.log('✔ Mongoose DB Connected')
    } catch (error) {
        console.log(error)
    }
}




app.use('/api/v1', userRoute)




const port = process.env.PORT || 5000



const startServer = async () => {
    await connectDB()
    app.listen(port, () => { 
        console.log(`Server is Running on Port ${port}`)
    })
}

startServer()