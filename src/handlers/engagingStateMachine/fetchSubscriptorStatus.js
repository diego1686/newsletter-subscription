const AWS = require('aws-sdk')

module.exports.handler = async (event, context, callback) => {
  try {
    const dynamoDBClient = new AWS.DynamoDB()

    var input = {
      TableName: process.env.usersTable,
      Key: {
        'email' : { S: event.email }
      }
    };

    var result = await dynamoDBClient.getItem(input).promise()
    var data = { email: result.Item.email.S,
      confirmed: result.Item.confirmed.BOOL,
      name: result.Item.name.S }

    callback(null, data)
  } catch (err) {
    console.log(err)
    // TODO: Save error cases to an SQS queue for post processing
    callback(null, `Error -> ${err.message}`)
  }
}