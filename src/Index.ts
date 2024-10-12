import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

//
const app = express()
dotenv.config()
const port = process.env.port
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(express.json())


//endPoints



app.listen(port, () => console.log(`server running ${port}`))
