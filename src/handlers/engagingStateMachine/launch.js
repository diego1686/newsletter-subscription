const AWS = require('aws-sdk')

module.exports.handler = async (event, context, callback) => {
  try {
    const stepFunctions = new AWS.StepFunctions()
    const stateMachineArn = process.env.stateMachineARN

    stepFunctions.startExecution({
      stateMachineArn,
      input: event.Records[0].Sns.Message
    }).promise()

    callback(null, `Your statemachine ${stateMachineArn} executed successfully`)
  } catch (err) {
    // TODO: Save error cases to an SQS queue for post processing
    callback(null, `Error -> ${err.message}`)
  }
}