const R = require('lambdaw/apigateway')
const AWS = require('aws-sdk')

module.exports.handler = async (event, context, callback) => {
  let response
  try {
    const sns = new AWS.SNS()
    const message = {
      Message: event.body,
      TopicArn: process.env.userRegisteredTopicArn,
      Subject: "User registered from HTTP API"
    }

    await sns.publish(message).promise()
    response = new R(200, { message: "Thanks!" }).WithCORS('*').toJSON()
  } catch(err) {
    response = new R(500, { message: err.message })
  }
  callback(null, response)
}
