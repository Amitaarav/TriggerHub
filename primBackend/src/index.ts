import express from 'express'
import { zapRouter } from './router/zap';
import { userRouter } from './router/user';
import { triggerRouter } from './router/trigger';
import { actionRouter } from './router/action';
import { authMiddleware } from './middleware';
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(cors())
app.use("/api/v1/user",userRouter);

app.use("/api/v1/zap",zapRouter)

app.use("/api/v1/trigger", triggerRouter);

app.use("/api/v1/action", actionRouter);

// app.get('/', (req, res) => {
    
// })

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})