const {expect} = require('chai')
const AWS = require('aws-sdk')
const AWSMock = require('aws-sdk-mock')
const fs = require('fs')
const path = require('path')
const subscribeFromCSV = require('../../../src/handlers/subscription/subscribeFromCSV')

describe('subscribeFromCSV', () => {
  beforeEach(async () => {
    AWSMock.setSDKInstance(AWS)
    const csvPath = path.join(__dirname, "./test-user.csv")
    const file = fs.readFileSync(csvPath)
    AWSMock.mock('S3', 'getObject', {Body: Buffer.from(file)})
    AWSMock.mock('SNS', 'publish', 'Success !!!')
  })

  afterEach(async () => {
    AWSMock.restore('SNS', 'publish')
    AWSMock.restore('S3', 'getObject')
  })

  it('Should subscribe from API successfully', async () => {
    const response = await subscribeFromCSV.handler({
      Records: [{s3: {object: {key: 'S3_TEST_KEY'}}}]
    })
    expect(response.message).to.exist
    expect(response.users).to.have.lengthOf(2)
    for(const user of response.users) {
      expect(user.email).to.exist
      expect(user.name).to.exist
      expect(user.confirmed).to.equals(true)
      expect(user.source).to.equals('csv')
    }
  })
})