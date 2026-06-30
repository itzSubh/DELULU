import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import dns from 'dns'
import { clerkMiddleware } from '@clerk/express'
import fs from 'fs'
import path from 'path'

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const app = express();
const publicDir = path.join(process.cwd(),"public");

await connectDB();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

app.get('/health', (req, res) => res.send('Server is Running!!!'))

if(fs.existsSync(publicDir)){
    app.use(express.static(publicDir))
    app.get('/{*any}', (req, res, next) => {
        res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
    })
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is runnning on port ${PORT}`))