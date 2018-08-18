const AWS = require('aws-sdk')
const shortid = require('shortid')

module.exports.handler = async (event, context, callback) => {
  try {
    const sqs = new AWS.SQS()
    let mails = []

    // Process DynamoDB stream
    await Promise.all(event.Records.map(async (record) => {
      if (record.eventName == 'INSERT') {
        const user = {
          name: record.dynamodb.NewImage.name.S,
          email: record.dynamodb.NewImage.email.S
        }

        // Create email
        const mail = {
          to: user.email,
          subject: 'Bienvenido!',
          text: `Bienvenido a nuestro newsletter, ${user.name}!
          Por favor confirmá tu email en el siguiente enlace -> http://www.enlacefalso.com`,
          html: `<p>Bienvenido a nuestro newsletter, <b>${user.name}</b>!</p>
          <p>Por favor confirmá tu email en el siguiente enlace -> http://www.enlacefalso.com</p>`
        }

        mails.push(mail)
      }
    }))

    // Publish batch to Mailer Queue
    if (mails.length > 0) {
      await sqs.sendMessageBatch({
        Entries: mails.map(item => {
          return {
            Id: shortid.generate(),
            MessageBody: JSON.stringify(item)
          }
        }),
        QueueUrl: process.env.queueURL
      }).promise()

      console.log(`Created ${mails.length} emails!`)
    }

    callback(null, 'Mails created!')
  } catch (err) {
    // TODO: Save error cases to an SQS queue for post processing
    console.log('Error ->', err.message)
    callback(null, `Error -> ${err.message}`)
  }
}