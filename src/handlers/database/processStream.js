const AWS = require('aws-sdk')

module.exports.handler = async (event, context, callback) => {
  const sns = new AWS.SNS()

  await Promise.all(event.Records.map(async (record) => {
    try {
      if (record.eventName == 'INSERT') {
        const user = {
          name: record.dynamodb.NewImage.name.S,
          email: record.dynamodb.NewImage.email.S
        }

        const message = {
          Message: JSON.stringify(user),
          TopicArn: process.env.userCreatedTopicArn,
          Subject: "User created!"
        }

        await sns.publish(message).promise()
      }
    } catch (err) {
      // TODO: Save error cases to an SQS queue for post processing
      console.log("Error ->", err.message)
    }
  }))

  callback(null, "Done!")
}
