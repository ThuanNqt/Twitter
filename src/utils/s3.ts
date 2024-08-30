import { HTTP_STATUS } from '~/constants/httpStatus'
import { Upload } from '@aws-sdk/lib-storage'
import { S3 } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import { Response } from 'express'
import { envConfig } from '~/constants/config'

// connect to S3
const s3 = new S3({
  region: envConfig.awsRegion,
  credentials: {
    secretAccessKey: envConfig.awsSecretAccessKey,
    accessKeyId: envConfig.awsAccessKeyId
  }
})

// display Bucket
//s3.listBuckets({}).then((data) => console.log(data))

export const uploadFileToS3 = ({
  fileName,
  filePath,
  contentType
}: {
  fileName: string
  filePath: string
  contentType: string
}) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: envConfig.awsS3BucketName,
      Key: fileName,
      Body: fs.readFileSync(filePath),
      ContentType: contentType
    },

    // optional tags
    tags: [
      /*...*/
    ],

    // additional optional fields show default values below:

    // (optional) concurrency configuration
    queueSize: 4,

    // (optional) size of each part, in bytes, at least 5MB
    partSize: 1024 * 1024 * 5,

    // (optional) when true, do not automatically call AbortMultipartUpload when
    // a multipart upload fails to complete. You should then manually handle
    // the leftover parts.
    leavePartsOnError: false
  })
  return parallelUploads3.done()
}

// parallelUploads3.on('httpUploadProgress', (progress) => {
//   console.log(progress)
// })

// parallelUploads3.done().then((res) => {
//   console.log(res)
// })

export const sendFileFromS3 = async (res: Response, filePath: string) => {
  try {
    const data = await s3.getObject({
      Bucket: envConfig.awsS3BucketName,
      Key: filePath
    })
    ;(data.Body as any).pipe(res)
  } catch (error) {
    res.status(HTTP_STATUS.NOT_FOUND).send('Not found!')
  }
}
