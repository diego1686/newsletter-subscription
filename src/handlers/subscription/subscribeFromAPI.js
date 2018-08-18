const R = require('lambdaw/apigateway')
const AWS = require('aws-sdk')

module.exports.handler = async (event, context, callback) => {
  let response
  try {
    const body = JSON.parse(event.body)

    const data = {
      email: body.email,
      name: body.name,
      confirmed: false,
      source: 'api'
    }

    const sns = new AWS.SNS()
    const message = {
      Message: JSON.stringify(data),
      TopicArn: process.env.userRegisteredTopicArn,
      Subject: 'User registered from HTTP API'
    }

    await sns.publish(message).promise()
    response = new R(200, { message: 'Thanks!' }).WithCORS('*').toJSON()
  } catch(err) {
    console.log('Error ->', err.message)
    response = new R(500, { message: err.message })
  }
  callback(null, response)
}
