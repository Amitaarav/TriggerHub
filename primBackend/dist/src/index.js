"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_config_1 = require("./config/env-config");
const express_1 = __importDefault(require("express"));
const zap_1 = require("./router/v1/zap");
const user_1 = require("./router/v1/user");
const trigger_1 = require("./router/v1/trigger");
const action_1 = require("./router/v1/action");
const cors_1 = __importDefault(require("cors"));
const PORT = env_config_1.configEnv.port;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});
app.use("/api/v1/user", user_1.userRouter);
app.use("/api/v1/zap", zap_1.zapRouter);
app.use("/api/v1/trigger", trigger_1.triggerRouter);
app.use("/api/v1/action", action_1.actionRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
