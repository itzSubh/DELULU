import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import dns from 'dns'
import { clerkMiddleware } from '@clerk/express'


dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const app = express();

await connectDB();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send('Server is Running!!!'))


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is runnning on port ${PORT}`))