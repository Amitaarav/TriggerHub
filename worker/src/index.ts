
import { Kafka } from 'kafkajs';
import  { PrismaClient } from '@prisma/client';
import { JsonObject } from '@prisma/client/runtime/library';
import { parse } from './parser';
import { sendEmail } from './email';
import { sendSolana } from './solana';
const TOPIC_NAME = "zap-events"

const kafka = new Kafka({
    clientId: 'zap-worker',
    brokers: ['localhost:9092']
});

const prismaClient = new PrismaClient();

async function main(){

    const consumer = kafka.consumer({groupId: 'main-worker'});
    await consumer.connect();

    await consumer.subscribe({topic: TOPIC_NAME, fromBeginning: true});

    // create a producer to send the next stage
    const producer = kafka.producer();
    await producer.connect();

    await consumer.run({
        autoCommit:false,
        eachMessage: async ({topic, partition, message}) => {

            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString()
            })
            if(!message.value?.toString()){
                return;
            }
            const parsedValue = JSON.parse(message.value?.toString())

            const zapRunId = parsedValue.zapRunId;
            const stage = parsedValue.stage;

            const zapRunDetails = await prismaClient.zapRun.findFirst({
                where:{
                    id: zapRunId
                },
                include:{
                    zap:{
                        include:{
                            actions:{
                                include:{
                                    type:true
                                }
                            }
                        }
                    }
                }
            })

            // execute the action

            const currentAction = zapRunDetails?.zap.actions.find((action) => action.sortingOrder === stage);

            if(!currentAction){
                console.log("current action is not found");
                return ;
            }

            if(currentAction.type.id === "email"){
                console.log("email action")
                const body = parse((currentAction.metadata as JsonObject)?.body as string, zapRunDetails?.metadata, "{", "}"); // You have received {comment.amount}
                const to = parse((currentAction.metadata as JsonObject)?.email as string, zapRunDetails?.metadata, "{", "}"); // {comment.email}

                console.log(`Sending out email to ${to} with body ${body}`)
                await sendEmail(to, body);
                
            }
            if(currentAction.type.id === "send-solana"){
                const amount = parse((currentAction.metadata as JsonObject)?.amount as string, zapRunDetails?.metadata, "{", "}"); // {comment.amount}
                const to = parse((currentAction.metadata as JsonObject)?.email as string, zapRunDetails?.metadata, "{", "}"); // {comment.email}
                console.log(`Sending out solana to ${to} with amount ${amount}`)
                await sendSolana(to, amount);
            }
            await new Promise(resolve => setTimeout(resolve, 5000))

            const lastStage = (zapRunDetails?.zap.actions?.length || 1) - 1;

            if(lastStage !== stage){
                await producer.send({
                    topic: TOPIC_NAME,
                    messages: [{
                        value: JSON.stringify({
                            stage: stage + 1,
                            zapRunId
                        })
                    }]
                })
            }
            console.log(`committing offset ${message.offset} for partition ${partition} : done`)
            await consumer.commitOffsets([{
                topic: TOPIC_NAME, 
                partition: partition, 
                offset: (parseInt( message.offset) + 1).toString()
            }])
        }
    });
}
main();