
import { Consumer } from 'sqs-consumer';
import { SQSClient } from '@aws-sdk/client-sqs';
import PostController from '../controller/post.controller';
import {receiveMessage} from '../service/aws-sqs'

// const postController = new PostController;

// const conifgObject = {
//   region: process.env.AWS_BUCKET_REGION || '',
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY || '',
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
//   }
// }
// const queueUrl = process.env.QUEUE_URL || '';

// const appConsumer = Consumer.create({
//   queueUrl: queueUrl,
//   handleMessage: async (message) => {
//     const data = JSON.parse(message.Body || '')
//     await postController.createPostBySQS(data)
//   },
//   sqs: new SQSClient(conifgObject)
// });

// appConsumer.on('error', (err) => {
//   console.error(err.message);
// });

// appConsumer.on('processing_error', (err) => {
//   console.error(err.message);
// });

// appConsumer.on('timeout_error', (err) => {
//   console.error(err.message);
// });

// appConsumer.start();
// console.log('ConsumerApp running');
const postController = new PostController;
async function processMessages() {
  while (true) {
    const msg = await receiveMessage();
    if (msg) {
      await postController.createPostBySQS(msg);
    }
  }
}

(async () => {
  try {
    await processMessages();
  } catch (error) {
    console.error('An error occurred while processing messages:', error);
  }
})();