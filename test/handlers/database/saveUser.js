const {expect} = require('chai')
const AWS = require('aws-sdk')
const AWSMock = require('aws-sdk-mock')
const saveUser = require('../../../src/handlers/database/saveUser')
const sinon = require('sinon')

describe('database - saveUser', () => {
  let spyDynamo
  beforeEach(async () => {
    AWSMock.setSDKInstance(AWS)
    spyDynamo = sinon.spy((params, callback) => {
      callback(null, "successfully put item in database");
    })
    AWSMock.mock('DynamoDB.DocumentClient', 'put', spyDynamo);
  })

  afterEach(async () => {
    AWSMock.restore('DynamoDB.DocumentClient', 'put')
  })

  it('Should save user in DynamoDB successfully', async () => {
    const user = {
      email: 'test@lateralview.net',
      name: 'Test LV'
    }
    const response = await saveUser.handler({
      Records: [{Sns: {Message: JSON.stringify(user)}}]
    })
    expect(response.message).to.exist
    expect(spyDynamo.callCount).to.equals(1)
    expect(spyDynamo).to.have.been.calledWithMatch({
      TableName: process.env.usersTable,
      Item: user
    })
  })
})
