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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const kafkajs_1 = require("kafkajs");
const client = new client_1.PrismaClient();
const TOPIC_NAME = "zap-events";
// Kafka broker configuration
const kafka = new kafkajs_1.Kafka({
    clientId: 'outbox-processor',
    brokers: ((_a = process.env.KAFKA_BROKERS) !== null && _a !== void 0 ? _a : 'localhost:9094').split(',')
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = kafka.producer({
            createPartitioner: kafkajs_1.Partitioners.LegacyPartitioner
        });
        yield producer.connect();
        console.log("Kafka Producer connected. Starting Outbox Poller...");
        while (true) {
            try {
                // 1. SELECT: Fetch events that have NOT been processed
                const pendingRows = yield client.zapRunOutbox.findMany({
                    where: { processed: false }, // Crucial change
                    take: 10, // Batch size
                    orderBy: { createdAt: 'asc' } // Process in order
                });
                if (pendingRows.length === 0) {
                    // If no events, wait briefly to avoid hammering the DB
                    yield new Promise(resolve => setTimeout(resolve, 500));
                    continue;
                }
                console.log(`Found ${pendingRows.length} events to publish.`);
                // Extract the IDs for later update
                const rowIdsToUpdate = pendingRows.map(r => r.id);
                // 2. PUBLISH: Send the messages to Kafka
                yield producer.send({
                    topic: TOPIC_NAME,
                    messages: pendingRows.map(r => ({
                        // Use the Outbox ID as the key for partitioning/ordering (optional but recommended)
                        key: r.zapRunId.toString(), // kafka decide partition strategy using: hash(key) % number_of_partitions
                        // Send minimal, necessary data
                        value: JSON.stringify({ zapRunId: r.zapRunId, outboxId: r.id, stage: 0 })
                    }))
                });
                // 3. UPDATE: Mark the events as processed in the database
                // This is the CRITICAL point: We use the Outbox ID array to atomically update the flag.
                yield client.zapRunOutbox.updateMany({
                    where: {
                        id: { in: rowIdsToUpdate }
                    },
                    data: {
                        processed: true
                    }
                });
                console.log(`Successfully published and marked ${pendingRows.length} events as processed.`);
            }
            catch (error) {
                console.error("Processor experienced an error. Retrying in 5 seconds.", error);
                // Wait before retrying to prevent a rapid, repeating failure loop
                yield new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    });
}
main().catch(e => {
    console.error("FATAL Processor Error:", e);
    process.exit(1);
});
