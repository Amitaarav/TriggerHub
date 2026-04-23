import { configEnv } from './config/env-config';
import express from 'express'
import { zapRouter } from './router/v1/zap';
import { userRouter } from './router/v1/user';
import { triggerRouter } from './router/v1/trigger';
import { actionRouter } from './router/v1/action';
import cors from 'cors'

const PORT = configEnv.port;

const app = express()

app.use(express.json())

app.use(cors())

app.use("/api/v1/user", userRouter);

app.use("/api/v1/zap", zapRouter)

app.use("/api/v1/trigger", triggerRouter);

app.use("/api/v1/action", actionRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});