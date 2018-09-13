const AWS = require('aws-sdk')

/**
 * @desc Create a reminder email to subscribe into the newsletter
 * 
 * @param {Object} event
 * @param {String} event.email Email of the user
 * @param {String} event.name Name of the user
 */
module.exports.handler = async (event) => {
  try {
    const sqs = new AWS.SQS()

    // Create email
    const mail = {
      to: event.email,
      subject: 'Recuerda confirmar tu email!',
      html: `<p>Hola <b>${event.name}</b>!</p>
      <p>Recuerda confirmar tu email, sino no podremos enviarte las noticias mas interesantes.</p>
      <p>Saludos!</p>`
    }

    await sqs.sendMessage({
      QueueUrl: process.env.queueURL,
      MessageBody: JSON.stringify(mail)
    }).promise()

    return { email: event.email }
  } catch (err) {
    // TODO: Save error cases to an SQS queue for post processing
    throw err
  }
}