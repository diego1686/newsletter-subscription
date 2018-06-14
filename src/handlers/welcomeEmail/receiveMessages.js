const AWS = require('aws-sdk')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports.handler = async (event, context, callback) => {
  const sqs = new AWS.SQS()

  try {
    const msg = await sqs.receiveMessage({
      QueueUrl: process.env.queueURL,
      MaxNumberOfMessages: '10'
    }).promise()

    if (msg && msg.Messages) {
      await Promise.all(msg.Messages.map(async (message) => {
        const body = JSON.parse(message.Body)
        const data = JSON.parse(body.Message)

        // Send email
        const mail = {
          to: data.email,
          from: 'noreply@lateralview.co',
          subject: 'Bienvenido!',
          text: `Bienvenido a nuestro newsletter, ${data.name}!`,
          html: `<p>Bienvenido a nuestro newsletter, <b>${data.name}</b>!</p>`
        }
        sgMail.send(mail)

        // Remove message from Queue
        await sqs.deleteMessage({
          QueueUrl: process.env.queueURL,
          ReceiptHandle: message.ReceiptHandle
        }).promise()
      }))
    }

    callback(null, 'Queue processed successfully!')
  } catch (err) {
    // TODO: Save error cases to an SQS queue for post processing
    console.log(err.message)
    callback(null, `Error -> ${err.message}`)
  }
}
