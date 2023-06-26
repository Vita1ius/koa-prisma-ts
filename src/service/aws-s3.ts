import { S3Client, PutObjectCommand,GetObjectCommand,DeleteObjectCommand  } from '@aws-sdk/client-s3'
const uuid = require("uuid").v4;
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const region: string = process.env.AWS_BUCKET_REGION || '';
const accessKeyId: string = process.env.AWS_ACCESS_KEY || '';
const secretAccessKey: string = process.env.AWS_SECRET_ACCESS_KEY || '';
const bucket: string = process.env.AWS_BUCKET_NAME || '';
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

export async function s3Uploadv3(files:any, userId:number,postId:number): Promise<string[]> {

  const params = files.map((file:any) => {
    return {
      Bucket: bucket,
      Key: `${userId}/${postId}/${uuid()}.${file.originalname}`,
      Body: file.buffer
    }
  })
  const keys: string[] = [];

   await Promise.all(
    params.map((param:any) => {
      s3Client.send(new PutObjectCommand(param))
      keys.push(param.Key);
    })
  )
  return keys;
}
export async function getObjectSignedUrl(key:string) {
  const params = {
    Bucket: bucket,
    Key: key
  }

  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  const command = new GetObjectCommand(params);
  const seconds = 180
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

  return url
}
export function deleteFile(fileName:string) {
  const deleteParams = {
    Bucket: bucket,
    Key: fileName,
  }

  return s3Client.send(new DeleteObjectCommand(deleteParams));
}
