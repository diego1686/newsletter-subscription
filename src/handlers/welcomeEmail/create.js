const AWS = require('aws-sdk')
const shortid = require('shortid')

/**
 * @desc DynamoDB Stream Event to publish a welcome email into a Mailer Queue
 * 
 * @param {Object} event
 * @param {Object[]} event.Records
 * @param {String} event.Records[].eventName Name of the event
 * @param {Object} event.Records[].dynamodb
 * @param {Object} event.Records[].dynamodb.NewImage
 * @param {String} event.Records[].dynamodb.NewImage.name.S Name of the user
 * @param {String} event.Records[].dynamodb.NewImage.email.S Email of the user
 * @param {String} event.Records[].dynamodb.NewImage.confirmed.BOOL Confirmed flag
 */
module.exports.handler = async (event) => {
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

        const confirmed = record.dynamodb.NewImage.confirmed.BOOL
        let html = `<p>Bienvenido a nuestro newsletter, <b>${user.name}</b>!</p>`

        if (!confirmed) {
          html += '<p>Por favor confirmá tu email en el siguiente enlace -> http://fake.newsletter.com</p>'
        }

        // Create email
        const mail = {
          to: user.email,
          subject: `Bienvenido, ${user.name}!`,
          html: html
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
    }

    return {
      message: 'Mails created!'
    }
  } catch (err) {
    // TODO: Save error cases to an SQS queue for post processing
    console.log('Error ->', err.message)
    throw err
  }
}