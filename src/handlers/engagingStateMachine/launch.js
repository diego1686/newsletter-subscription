const AWS = require('aws-sdk')

module.exports.handler = async (event, context, callback) => {
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
            source: record.dynamodb.NewImage.confirmed.S
          }

          // Run state machine
          stepFunctions.startExecution({
            stateMachineArn,
            input: JSON.stringify(user)
          }).promise()

          console.log(`State machine started for ${user.email}`)
        }
      }
    }))

    callback(null, 'Done!')
  } catch (err) {
    // TODO: Save error cases to an SQS queue for post processing
    callback(null, `Error -> ${err.message}`)
  }
}