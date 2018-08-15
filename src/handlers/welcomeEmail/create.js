const AWS = require('aws-sdk')

module.exports.handler = async (event, context, callback) => {
  try {
    const sqs = new AWS.SQS()
    const user = JSON.parse(event.Records[0].Sns.Message)

    // Create email
    const mail = {
      to: user.email,
      subject: 'Bienvenido!',
      text: `Bienvenido a nuestro newsletter, ${user.name}!
      Por favor confirmá tu email en el siguiente enlace -> http://www.enlacefalso.com`,
      html: `<p>Bienvenido a nuestro newsletter, <b>${user.name}</b>!</p>
      <p>Por favor confirmá tu email en el siguiente enlace -> http://www.enlacefalso.com</p>`
    }

    await sqs.sendMessage({
      QueueUrl: process.env.queueURL,
      MessageBody: JSON.stringify(mail)
    }).promise()

    callback(null, "Mail created!")
  } catch (err) {
    // TODO: Save error cases to an SQS queue for post processing
    callback(null, `Error -> ${err.message}`)
  }
}