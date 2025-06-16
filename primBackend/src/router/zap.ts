import { Router,Request, Response } from "express";
import { authMiddleware, CustomRequest } from "../middleware";
import { zapCreateSchema } from "../types";
import { prismaClient } from "../db";

const router = Router();

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const id = (req as CustomRequest).id;
  const body = req.body;

  const parsedData = zapCreateSchema.safeParse(body);
  if (!parsedData.success) {
    console.log("Validation Error:", parsedData.error.message);
    res.status(400).send("Validation Error: " + parsedData.error.message);
    return;
  }

  try {
    const zapId = await prismaClient.$transaction(async (tx) => {
      const zap = await tx.zap.create({
        data: {
          userId: Number(id),
          triggerId: "",
          actions: {
            create: parsedData.data.actions.map((x, index) => ({
              actionId: x.availableActionId,
              sortingOrder: index,
              metadata: x.actionMetadata ?? {},
            })),
          },
        },
      });

      const trigger = await tx.trigger.create({
        data: {
          triggerId: parsedData.data.availableTriggerId,
          zapId: zap.id,
          metadata: parsedData.data.triggerMetadata ?? {},
        },
      });

      await tx.zap.update({
        where: { id: zap.id },
        data: { triggerId: trigger.id },
      });

      return zap.id;
    });

    res.json({ zapId });
  } catch (err) {
    console.error("Error creating zap:", err);
    res.status(500).send("Internal server error while creating zap.");
  }
});

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  const id = (req as CustomRequest).id;

  try {
    const zaps = await prismaClient.zap.findMany({
      where: { userId: Number(id) },
      include: {
        actions: { include: { type: true } },
        trigger: { include: { type: true } },
      },
    });

    res.json({ zaps });
  } catch (err) {
    console.error("Error fetching zaps:", err);
    res.status(500).send("Internal server error while fetching zaps.");
  }
});

// GET /zap/:zapId - Get single zap for authenticated user
router.get("/:zapId", authMiddleware, async (req:Request, res: Response) => {
  const id = (req as CustomRequest).id;
  const zapId = req.params.zapId;

  try {
    const zap = await prismaClient.zap.findFirst({
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
  } catch (err) {
    console.error("Error fetching zap:", err);
    res.status(500).send("Internal server error while fetching zap.");
  }
});

export const zapRouter = router;
