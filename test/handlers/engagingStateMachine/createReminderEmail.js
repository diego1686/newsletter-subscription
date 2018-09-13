const {expect} = require('chai')
const AWSMock = require('aws-sdk-mock')
const createReminderEmail = require('../../../src/handlers/engagingStateMachine/createReminderEmail')
const sinon = require('sinon')

describe('engagingStateMachine - createReminderEmail', () => {
  let spySQS
  beforeEach(async () => {
    spySQS = sinon.spy((input, callback) => {
      return callback(null, "successfully put message into the queue")
    })
    AWSMock.mock('SQS', 'sendMessage', spySQS);
  })

  afterEach(async () => {
    AWSMock.restore('SQS', 'sendMessage')
  })

  it('Should put a batch of mails into the queue', async () => {
    const user = {
      email: 'test1@lateralview.net',
      name: 'Test1 LV'
    }
    const response = await createReminderEmail.handler(user)
    expect(spySQS.callCount).to.equals(1)
    expect(spySQS).to.have.been.calledWithMatch({
      QueueUrl: process.env.queueURL
    })
    expect(response.email).to.equals(user.email)
  })
})
