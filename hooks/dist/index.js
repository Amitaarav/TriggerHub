"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const client = new client_1.PrismaClient();
app.use(express_1.default.json());
app.post("/hooks/catch/:userId/:zapId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;
    try {
        const response = yield client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const run = yield tx.zapRun.create({
                data: {
                    zapId: zapId,
                    metadata: body
                }
            });
            yield tx.zapRunOutbox.create({
                data: {
                    zapRunId: run.id
                }
            });
            return {
                zapRun: run
            };
        }));
        res.json({
            message: "Transaction successful",
            data: response,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error processing transaction:", error.message);
            res.status(500).json({
                message: "Transaction failed",
                error: error.message,
            });
        }
        else {
            console.error("Unknown error:", error);
            res.status(500).json({
                message: "Transaction failed due to an unknown error.",
            });
        }
    }
}));
app.listen(3002, () => {
    console.log("Server is running on http://localhost:3002");
});
