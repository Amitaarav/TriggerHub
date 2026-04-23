import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const client = new PrismaClient();
const TOPIC_NAME = "zap-events";

// Kafka broker configuration
const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092'] // Use environment variable in production
});

async function main() {
    const producer = kafka.producer();
    await producer.connect();

    console.log("Kafka Producer connected. Starting Outbox Poller...");

    while (true) {
        try {
            // 1. SELECT: Fetch events that have NOT been processed
            const pendingRows = await client.zapRunOutbox.findMany({
                where: { processed: false }, // Crucial change
                take: 10, // Batch size
                orderBy: { createdAt: 'asc' } // Process in order
            });

            if (pendingRows.length === 0) {
                // If no events, wait briefly to avoid hammering the DB
                await new Promise(resolve => setTimeout(resolve, 500));
                continue;
            }

            console.log(`Found ${pendingRows.length} events to publish.`);

            // Extract the IDs for later update
            const rowIdsToUpdate = pendingRows.map(r => r.id);

            // 2. PUBLISH: Send the messages to Kafka
            await producer.send({
                topic: TOPIC_NAME,
                messages: pendingRows.map(r => ({
                    // Use the Outbox ID as the key for partitioning/ordering (optional but recommended)
                    key: r.zapRunId.toString(),  // kafka decide partition strategy using: hash(key) % number_of_partitions
                    // Send minimal, necessary data
                    value: JSON.stringify({ zapRunId: r.zapRunId, outboxId: r.id, stage: 0 })
                }))
            });

            // 3. UPDATE: Mark the events as processed in the database
            // This is the CRITICAL point: We use the Outbox ID array to atomically update the flag.
            await client.zapRunOutbox.updateMany({
                where: {
                    id: { in: rowIdsToUpdate }
                },
                data: {
                    processed: true
                }
            });

            console.log(`Successfully published and marked ${pendingRows.length} events as processed.`);

        } catch (error) {
            console.error("Processor experienced an error. Retrying in 5 seconds.", error);
            // Wait before retrying to prevent a rapid, repeating failure loop
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

main().catch(e => {
    console.error("FATAL Processor Error:", e);
    process.exit(1);
});