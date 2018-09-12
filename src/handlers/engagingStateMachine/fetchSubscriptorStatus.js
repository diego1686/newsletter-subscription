const AWS = require('aws-sdk')

/**
 * @desc State Machine initial event
 * 
 * @param {Object} event
 * @param {String} event.email Email of the user
 */
module.exports.handler = async (event) => {
  try {
    const dynamoDBClient = new AWS.DynamoDB()

    var input = {
      TableName: process.env.usersTable,
      Key: {
        'email' : { S: event.email }
      }
    };

    var result = await dynamoDBClient.getItem(input).promise()
    return {
      email: result.Item.email.S,
      confirmed: result.Item.confirmed.BOOL,
      name: result.Item.name.S
    }
  } catch (err) {
    console.log(`Error -> ${err.message}`)
    // TODO: Save error cases to an SQS queue for post processing
    throw err
  }
}