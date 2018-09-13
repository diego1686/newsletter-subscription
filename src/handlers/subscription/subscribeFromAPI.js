const R = require('lambdaw/apigateway')
const AWS = require('aws-sdk')

/**
 * @desc API Endpoint to subscribe an user
 * 
 * @param {object} event
 * @param {String} event.body Stringify JSON containing the body
 * @param {String} event.body.email
 * @param {String} event.body.name
 */
module.exports.handler = async (event) => {
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
    return new R(200, { message: 'Thanks!' }).WithCORS('*').toJSON()
  } catch(err) {
    console.log('Error ->', err.message)
    throw new R(err.statusCode ||500, { message: err.message })
  }
}
