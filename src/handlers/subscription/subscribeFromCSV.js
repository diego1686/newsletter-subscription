const AWS = require('aws-sdk')
const Papa = require('papaparse')

/**
 * @desc S3 Event to subscribe multiple users
 * 
 * @param {Object} event
 * @param {Object[]} event.Records
 * @param {Object} event.Records.s3
 * @param {Object} event.Records.s3.object
 * @param {String} event.Records.s3.object.key
 */
module.exports.handler = async (event) => {
  const sns = new AWS.SNS()
  const users = await importUsers(event.Records[0].s3.object.key)
  await Promise.all(users.map(async (user) => {
    try {
      const message = {
        Message: JSON.stringify(user),
        TopicArn: process.env.userRegisteredTopicArn,
        Subject: 'User registered from CSV'
      }

      await sns.publish(message).promise()
      return user
    } catch(err) {
      // TODO: Save error cases to an SQS queue for post processing
      console.log('Error ->', err.message)
      throw err
    }
  }))

  return {
    message: 'CSV processed successfully!',
    users: users
  }
}

async function importUsers(key) {
  const s3 = new AWS.S3()
  const s3Response = await s3.getObject({
    Bucket: process.env.csvBucket,
    Key: key
  }).promise()
  const csvData = s3Response.Body.toString()
  const out = Papa.parse(csvData, { skipEmptyLines: true })
  const users = out.data.filter((r, i) => i > 0).map(r => ({
    email: r[0],
    name: r[1],
    confirmed: true,
    source: 'csv'
  }))

  return users
}