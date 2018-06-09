const R = require('lambdaw/apigateway')
const AWS = require('aws-sdk')
const csvHelper = require('../helpers/csvHelper')

class SubscriptionsHandler {
  static async subscribeFromAPI(event, context, callback) {
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

  static async subscribeFromCSV(event, context, callback) {
    try {
      const sns = new AWS.SNS()
      const users = await csvHelper.importUsers(event.Records[0].s3.object.key)

      await Promise.all(users.map(async (user) => {
        const message = {
          Message: JSON.stringify(user),
          TopicArn: process.env.userRegisteredTopicArn,
          Subject: "User registered from CSV"
        }

        await sns.publish(message).promise()
      }))

      callback(null, 'CSV processed successfully!')
    } catch(err) {
      callback(err)
    }
  }
}

module.exports = SubscriptionsHandler
