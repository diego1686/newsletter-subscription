const Papa = require('papaparse')
const AWS = require('aws-sdk')

class CsvHelper {
  static async importUsers(key) {
    const s3 = new AWS.S3()
    const s3Response = await s3.getObject({
      Bucket: process.env.csvBucket,
      Key: key
    }).promise()

    const csvData = s3Response.Body.toString()
    const out = Papa.parse(csvData, { skipEmptyLines: true })
    const users = out.data.filter((r, i) => i > 0).map(r => ({
      email: r[0],
      name: r[1]
    }))

    return users
  }
}

module.exports = CsvHelper
