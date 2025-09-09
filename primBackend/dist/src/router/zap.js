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
Object.defineProperty(exports, "__esModule", { value: true });
exports.zapRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const types_1 = require("../types");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    const body = req.body;
    const parsedData = types_1.zapCreateSchema.safeParse(body);
    if (!parsedData.success) {
        console.log("Validation Error:", parsedData.error.message);
        res.status(400).send("Validation Error: " + parsedData.error.message);
        return;
    }
    try {
        const zapId = yield db_1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const zap = yield tx.zap.create({
                data: {
                    userId: Number(id),
                    triggerId: "",
                    actions: {
                        create: parsedData.data.actions.map((x, index) => {
                            var _a;
                            return ({
                                actionId: x.availableActionId,
                                sortingOrder: index,
                                metadata: (_a = x.actionMetadata) !== null && _a !== void 0 ? _a : {},
                            });
                        }),
                    },
                },
            });
            const trigger = yield tx.trigger.create({
                data: {
                    triggerId: parsedData.data.availableTriggerId,
                    zapId: zap.id,
                    metadata: (_a = parsedData.data.triggerMetadata) !== null && _a !== void 0 ? _a : {},
                },
            });
            yield tx.zap.update({
                where: { id: zap.id },
                data: { triggerId: trigger.id },
            });
            return zap.id;
        }));
        res.json({ zapId });
    }
    catch (err) {
        console.error("Error creating zap:", err);
        res.status(500).send("Internal server error while creating zap.");
    }
}));
router.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    try {
        const zaps = yield db_1.prismaClient.zap.findMany({
            where: { userId: Number(id) },
            include: {
                actions: { include: { type: true } },
                trigger: { include: { type: true } },
            },
        });
        res.json({ zaps });
    }
    catch (err) {
        console.error("Error fetching zaps:", err);
        res.status(500).send("Internal server error while fetching zaps.");
    }
}));
// GET /zap/:zapId - Get single zap for authenticated user
router.get("/:zapId", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    const zapId = req.params.zapId;
    try {
        const zap = yield db_1.prismaClient.zap.findFirst({
            where: {
                id: zapId,
                userId: Number(id),
            },
            include: {
                actions: { include: { type: true } },
                trigger: { include: { type: true } },
            },
        });
        if (!zap) {
            res.status(404).send("Zap not found");
            return;
        }
        res.json({ zap });
    }
    catch (err) {
        console.error("Error fetching zap:", err);
        res.status(500).send("Internal server error while fetching zap.");
    }
}));
exports.zapRouter = router;
