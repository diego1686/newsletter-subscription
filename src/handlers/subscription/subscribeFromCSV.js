const R = require('lambdaw/apigateway')
const AWS = require('aws-sdk')
const csvHelper = require('../../helpers/csvHelper')

module.exports.handler = async (event, context, callback) => {
  const sns = new AWS.SNS()
  const users = await csvHelper.importUsers(event.Records[0].s3.object.key)

  await Promise.all(users.map(async (user) => {
    try {
      const message = {
        Message: JSON.stringify(user),
        TopicArn: process.env.userRegisteredTopicArn,
        Subject: "User registered from CSV"
      }

      await sns.publish(message).promise()
    } catch(err) {
      // TODO: Save error cases to an SQS queue for post processing
      console.log("Error ->", err.message)
    }
  }))

  callback(null, 'CSV processed successfully!')
}
