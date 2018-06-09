const AWS = require('aws-sdk')

class DatabaseHandler {
  static async saveUser(event, context, callback) {
    try {
      const sns = new AWS.SNS();
      const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
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

  static processStream(event, context, callback) {
    console.log(event.Records[0].dynamodb.NewImage)
    callback(null, "OK")
  }
}

module.exports = DatabaseHandler
