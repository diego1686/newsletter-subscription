const AWS = require('aws-sdk')

class DatabaseHandler {
  static async saveUser(event, context, callback) {
    try {
      const dynamoDBClient = new AWS.DynamoDB.DocumentClient()
      const user = JSON.parse(event.Records[0].Sns.Message)

      const newUser = {
        TableName: process.env.usersTable,
        Item: {
          email: user.email,
          name: user.name
        }
      }

      await dynamoDBClient.put(newUser).promise()
      callback(null, "User saved!")
    } catch (err) {
      // TODO: Save error cases to an SQS queue for post processing
      callback(null, `Error -> ${err.message}`)
    }
  }

  static async processStream(event, context, callback) {
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
}

module.exports = DatabaseHandler
