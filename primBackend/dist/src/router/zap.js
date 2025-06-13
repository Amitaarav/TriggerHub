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
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.post("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    const body = req.body;
    const parsedData = types_1.zapCreateSchema.safeParse(body);
    if (!parsedData.success) {
        console.log("Validation Error: ", parsedData.error.message);
        res.status(400).send("Validation Error: " + parsedData.error.message);
        return;
    }
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
                            metadata: (_a = x.actionMetadata) !== null && _a !== void 0 ? _a : {}
                        });
                    })
                }
            }
        });
        const trigger = yield tx.trigger.create({
            data: {
                triggerId: parsedData.data.availableTriggerId,
                zapId: zap.id,
                metadata: (_a = parsedData.data.triggerMetadata) !== null && _a !== void 0 ? _a : {}
            }
        });
        yield db_1.prismaClient.zap.update({
            where: {
                id: zap.id
            },
            data: {
                triggerId: trigger.id
            }
        });
        return zap.id;
    }));
    res.json({
        zapId
    });
}));
router.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    const zap = yield db_1.prismaClient.zap.findFirst({
        where: {
            userId: Number(id)
        },
        include: {
            actions: {
                include: {
                    type: true
                }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });
    console.log("zap created");
    res.json({ zap });
}));
router.get("/:zapId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    const zapId = req.params.zapId;
    const zaps = yield db_1.prismaClient.zap.findMany({
        where: {
            id: zapId,
            userId: Number(id)
        },
        include: {
            actions: {
                include: {
                    type: true
                }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });
    console.log("zap created");
    res.json({ zaps });
}));
exports.zapRouter = router;
