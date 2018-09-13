const {expect} = require('chai')
const AWSMock = require('aws-sdk-mock')
const create = require('../../../src/handlers/welcomeEmail/create')
const sinon = require('sinon')

describe('welcomeEmail - create', () => {
  let spySQS
  beforeEach(async () => {
    spySQS = sinon.spy((input, callback) => {
      return callback(null, "successfully put message into the queue")
    })
    AWSMock.mock('SQS', 'sendMessageBatch', spySQS);
  })

  afterEach(async () => {
    AWSMock.restore('SQS', 'sendMessageBatch')
  })

  it('Should put a batch of mails into the queue', async () => {
    const users = [
      {
        email: 'test1@lateralview.net',
        name: 'Test1 LV',
        confirmed: true
      },
      {
        email: 'test2@lateralview.net',
        name: 'Test2 LV',
        confirmed: false
      }
    ]
    const input = {
      Records: users.map((user) => {
        return {
          eventName: 'INSERT',
          dynamodb: {
            NewImage: {
              name: {
                S: user.name
              },
              email: {
                S: user.email
              },
              confirmed: {
                BOOL: user.confirmed
              }
            }
          }
        }
      })
    }
    const response = await create.handler(input)
    expect(response.message).to.exist
    expect(spySQS.callCount).to.equals(1)
    expect(spySQS).to.have.been.calledWithMatch({
      QueueUrl: process.env.queueURL
    })
    expect(spySQS.getCall(0).args[0].Entries).to.have.lengthOf(users.length)
  })
})
