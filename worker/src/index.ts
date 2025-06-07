
import { Kafka } from 'kafkajs';
import  { PrismaClient } from '@prisma/client';

const TOPIC_NAME = "zap-events"

const kafka = new Kafka({
    clientId: 'zap-worker',
    brokers: ['localhost:9092']
});

const prisma = new PrismaClient();

async function main(){

    const consumer = kafka.consumer({groupId: 'main-worker'});
    await consumer.connect();

    await consumer.subscribe({topic: TOPIC_NAME, fromBeginning: true});

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

            const zapRunDetails = await prisma.zapRun.findFirst({
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

            const currentAction = zapRunDetails?.zap.actions.find((action : any) => action.sortingOrder === stage);

            if(!currentAction){
                console.log("current action is not found");
                return ;
            }

            if(currentAction.type.id === "email"){
                console.log("email action")
            }
            if(currentAction.type.id === "send-solana"){
                console.log("send solana action")
            }
            await new Promise(resolve => setTimeout(resolve, 5000))

            const lastStage = (zapRunDetails?.zap.actions?.length ||1) - 1;

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