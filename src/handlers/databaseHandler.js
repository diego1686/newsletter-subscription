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
      callback(err)
    }
  }

  static async processStream(event, context, callback) {
    const sns = new AWS.SNS()

    const message = {
      Message: JSON.stringify(event.Records[0].dynamodb.NewImage),
      TopicArn: process.env.userCreatedTopicArn,
      Subject: "User created!"
    }

    await sns.publish(message).promise()
    callback(null, "OK")
  }
}

module.exports = DatabaseHandler
