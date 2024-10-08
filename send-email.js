/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
// import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
// import { config } from 'dotenv'

const { SendEmailCommand, SESClient } = require('@aws-sdk/client-ses')
const { config } = require('dotenv')
const { envConfig } = require('./src/constants/config')

config()
// Create SES service object.
const sesClient = new SESClient({
  region: envConfig.AWS_REGION,
  credentials: {
    secretAccessKey: envConfig.secretAccessKey,
    accessKeyId: envConfig.accessKeyId
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

const sendVerifyEmail = async (toAddress, subject, body) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: envConfig.sesFromAddress,
    toAddresses: toAddress,
    body,
    subject
  })

  try {
    return await sesClient.send(sendEmailCommand)
  } catch (e) {
    console.error('Failed to send email.')
    return e
  }
}

sendVerifyEmail('thuan13112003@gmail.com', 'Tiêu đề email', '<h1>Nguyễn Quang Thuận hehehehe</h1>')
