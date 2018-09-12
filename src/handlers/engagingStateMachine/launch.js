const AWS = require('aws-sdk')

/**
 * @desc DynamoDB Stream Event to initiate a StateMachine
 * 
 * @param {Object} event
 * @param {Object[]} event.Records
 * @param {String} event.Records[].eventName Name of the event
 * @param {Object} event.Records[].dynamodb
 * @param {Object} event.Records[].dynamodb.NewImage
 * @param {String} event.Records[].dynamodb.NewImage.name.S Name of the user
 * @param {String} event.Records[].dynamodb.NewImage.email.S Email of the user
 * @param {String} event.Records[].dynamodb.NewImage.confirmed.BOOL Confirmed flag
 * @param {String} event.Records[].dynamodb.NewImage.source.S Source from which the user was created
 */
module.exports.handler = async (event) => {
  try {
    const stepFunctions = new AWS.StepFunctions()
    const stateMachineArn = process.env.stateMachineARN

    // Process DynamoDB stream
    await Promise.all(event.Records.map(async (record) => {
      if (record.eventName == 'INSERT') {
        const confirmed = record.dynamodb.NewImage.confirmed.BOOL
        if (!confirmed){
          const user = {
            name: record.dynamodb.NewImage.name.S,
            email: record.dynamodb.NewImage.email.S,
            confirmed: record.dynamodb.NewImage.confirmed.BOOL,
            source: record.dynamodb.NewImage.source.S
          }

          // Run state machine
          stepFunctions.startExecution({
            stateMachineArn,
            input: JSON.stringify(user)
          }).promise()
        }
      }
    }))

    return {
      message: 'Done'
    }
  } catch (err) {
    // TODO: Save error cases to an SQS queue for post processing
    throw err
  }
}