const dotenv = require('dotenv');
const { SQSClient, SendMessageCommand,ReceiveMessageCommand, DeleteMessageCommand} = require('@aws-sdk/client-sqs')
dotenv.config();

const conifgObject = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
}
const sqsClient = new SQSClient(conifgObject);
const queueUrl = process.env.QUEUE_URL || '';

export async function SendMessage(data:Object) {
  try {
    const command = new SendMessageCommand({
      MessageBody : JSON.stringify(data),
      QueueUrl: queueUrl,
    })
    const result = await sqsClient.send(command);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}
export async function receiveMessage(): Promise<Object | null> {
  try {
    const command = new ReceiveMessageCommand({
      MaxNumberOfMessages: 1,
      QueueUrl: queueUrl,
      WaitTimeSeconds: 5,
      MessageAttributes: ["All"]
    });

    const result = await sqsClient.send(command);

    if (result.Messages && result.Messages.length > 0) {
      const data: Object = JSON.parse(result.Messages[0].Body);

      const deleteMessage = await sqsClient.send(new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: result.Messages[0].ReceiptHandle
      }));

      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}