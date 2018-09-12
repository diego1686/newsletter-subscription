const {expect} = require('chai')
const AWSMock = require('aws-sdk-mock')
const fetchSubscriptorStatus = require('../../../src/handlers/engagingStateMachine/fetchSubscriptorStatus')
const sinon = require('sinon')

describe('engagingStateMachine - fetchSubscriptorStatus', () => {
  it('Should fetch subscriptor status from DynamoDB successfully', async () => {
    const user = {
      email: 'test@lateralview.net',
      confirmed: false,
      name: 'Test LV'
    }
    const dynamoDBResponse = {
      Item: {
        email: {S: user.email},
        name: {S: user.name},
        confirmed: {BOOL: user.confirmed}
      }
    }
    const spyDynamo = sinon.spy((params, callback) => {
      callback(null, dynamoDBResponse);
    })
    AWSMock.mock('DynamoDB', 'getItem', spyDynamo);
    
    const response = await fetchSubscriptorStatus.handler(user)
    expect(spyDynamo.callCount).to.equals(1)
    expect(spyDynamo).to.have.been.calledWithMatch({
      TableName: process.env.usersTable
    })
    expect(response).to.deep.equals(user)

    AWSMock.restore('DynamoDB', 'getItem')
  })
})
