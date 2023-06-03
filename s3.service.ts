import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
const uuid = require("uuid").v4;

const region: string = process.env.AWS_BUCKET_REGION || '';
const accessKeyId: string = process.env.AWS_ACCESS_KEY || '';
const secretAccessKey: string = process.env.AWS_SECRET_ACCESS_KEY || '';
const s3client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

export async function s3Uploadv3(files:any, userId:number,postId:number): Promise<string[]> {
  // const s3client = new S3Client({
  //   region,
  //   credentials: {
  //     accessKeyId,
  //     secretAccessKey
  //   }
  // })

  const params = files.map((file:any) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${userId}/${postId}/${uuid()}.${file.originalname}`,
      Body: file.buffer
    }
  })
  const keys: string[] = [];

   await Promise.all(
    params.map((param:any) => {
      s3client.send(new PutObjectCommand(param))
      keys.push(param.Key);
    })
  )
  return keys;


  // const keys: string[] = [];

  // for (const param of params) {
  //   const result = await s3client.send(new PutObjectCommand(param));
  //   keys.push(param.Key);
  // }
}
