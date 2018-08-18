const AWS = require('aws-sdk')

module.exports.handler = async (event, context, callback) => {
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

    callback(null, { email: event.email })
  } catch (err) {
    // TODO: Save error cases to an SQS queue for post processing
    callback(null, `Error -> ${err.message}`)
  }
}