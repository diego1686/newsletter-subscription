const AWS = require('aws-sdk')

/**
 * @desc SNS Event to subscribe a single user
 * 
 * @param {Object} event
 * @param {Object[]} event.Records
 * @param {Object} event.Records[].Sns
 * @param {String} event.Records[].Sns.Message Serialized user
 */
module.exports.handler = async (event) => {
  try {
    const dynamoDBClient = new AWS.DynamoDB.DocumentClient()

    const input = {
      TableName: process.env.usersTable,
      Item: JSON.parse(event.Records[0].Sns.Message)
    }

    await dynamoDBClient.put(input).promise()
    return {
      message: 'User created successfully'
    }
  } catch (err) {
    // TODO: Save error cases to an SQS queue for post processing
    console.log('Error ->', err.message)
    throw err
  }
}