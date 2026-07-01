import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import dns from 'dns'
import { clerkMiddleware } from '@clerk/express'
import fs from 'fs'
import path from 'path'
import job from './configs/cron.js'
import clerkWebHook from './webhooks/clerk.webhook.js'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { app, server } from './configs/socket.js'
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const publicDir = path.join(process.cwd(),"public");

await connectDB();

app.use('/api/webhooks/clerk', express.raw({ type: 'application/json'}), clerkWebHook)
app.use(express.json());
app.use(cors({origin: process.env.FRONTEND_URL || "http://localhost:5173"}));
app.use(clerkMiddleware())

if(process.env.NODE_ENV === "production"){
    job.start()
}
app.get('/health', (req, res) => res.send('Server is Running!!!'))
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)


if(fs.existsSync(publicDir)){
    app.use(express.static(publicDir))
    app.get('/{*any}', (req, res, next) => {
        res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
    })
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is runnning on port ${PORT}`))