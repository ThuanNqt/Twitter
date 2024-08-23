import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

config()
// Create SES service object.
const sesClient = new SESClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})

export const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}: {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  body: string
  subject: string
  replyToAddresses?: string | string[]
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

const sendVerifyEmail = async (toAddress: string, subject: string, body: string) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: process.env.SES_FROM_ADDRESS as string,
    toAddresses: toAddress,
    body,
    subject
  })
  return sesClient.send(sendEmailCommand)
}

// sendVerifyEmail('thuan13112003@gmail.com', 'Tiêu đề email', '<h1>Nguyễn Quang Thuận hehehehe</h1>')

const verifyEmailTemplate = fs.readFileSync(path.resolve('src/templates/verifyEmail.html'), 'utf-8')

export const sendVerifyRegisterEmail = (
  toAddress: string,
  email_verified_token: string,
  template: string = verifyEmailTemplate
) => {
  const customizedTemplate = template
    .replace('{{content}}', 'xác thực email')
    .replace('{{link}}', `${process.env.CLIENT_URL}/verify-email?token=${email_verified_token}`)
    .replace('{{titleLink}}', 'Xác thực email')

  return sendVerifyEmail(toAddress, 'Verify your email', customizedTemplate)
}

export const sendForgotPasswordEmail = (
  toAddress: string,
  forgot_password_token: string,
  template: string = verifyEmailTemplate
) => {
  const customizedTemplate = template
    .replace('{{content}}', 'đổi mật khẩu')
    .replace('{{link}}', `${process.env.CLIENT_URL}/forgot-password?token=${forgot_password_token}`)
    .replace('{{titleLink}}', 'Đổi mật khẩu')

  return sendVerifyEmail(toAddress, 'Forgot Password', customizedTemplate)
}
