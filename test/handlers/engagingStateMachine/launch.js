const {expect} = require('chai')
const AWSMock = require('aws-sdk-mock')
const launch = require('../../../src/handlers/engagingStateMachine/launch')
const sinon = require('sinon')

describe('engagingStateMachine - launch', () => {
  let spyStateMachine
  beforeEach(async () => {
    spyStateMachine = sinon.spy((params, callback) => {
      callback(null, "State machine successfully started");
    })
    AWSMock.mock('StepFunctions', 'startExecution', spyStateMachine);
  })

  afterEach(async () => {
    AWSMock.restore('StepFunctions', 'startExecution')
  })

  it('Should launch the state machine successfully', async () => {
    const users = [
      {
        name: 'Test1 LV',
        email: 'test1@lateralview.net',
        confirmed: false,
        source: 'api'
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
              },
              source: {
                S: user.source
              }
            }
          }
        }
      })
    }
    const response = await launch.handler(input)
    expect(response.message).to.exist
    expect(spyStateMachine.callCount).to.equals(1)
    expect(spyStateMachine).to.have.been.calledWithMatch({
      stateMachineArn: process.env.stateMachineARN,
      input: JSON.stringify(users[0])
    })
  })

  it('Should not launch the state machine if the user is already confirmed', async () => {
    const users = [
      {
        email: 'test1@lateralview.net',
        name: 'Test1 LV',
        confirmed: true,
        source: 'api'
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
              },
              source: {
                S: user.source
              }
            }
          }
        }
      })
    }
    const response = await launch.handler(input)
    expect(response.message).to.exist
    expect(spyStateMachine.callCount).to.equals(0)
  })
})
