const AWS = require('aws-sdk')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.sendgridAPIKey)


/**
 * @desc Mailer
 * 
 * @param {Object} event
 * @param {Object[]} event.Records
 * @param {String} event.Records[].body Serialized email
 * @param {String} event.Records[].body.to
 * @param {String} [event.Records[].body.from]
 * @param {String} event.Records[].subject
 * @param {String} event.Records[].html
 */
module.exports.handler = async (event) => {
  try {
    await Promise.all(event.Records.map(async (message) => {
      const data = JSON.parse(message.body)

      // Send email
      const mail = {
        to: data.to,
        from: data.from || 'noreply@fakenews.co',
        subject: data.subject,
        html: data.html
      }

      sgMail.send(mail)
    }))

    return {
      message: 'Queue processed successfully!'
    }
  } catch (err) {
    // TODO: Save error cases to an SQS queue for post processing
    throw err
  }
}
