const {expect} = require('chai')
const AWS = require('aws-sdk')
const AWSMock = require('aws-sdk-mock')
const subscribeFromAPI = require('../../src/handlers/subscription/subscribeFromAPI')

describe('subscribeFromAPI', () => {
  beforeEach(async () => {
    AWSMock.setSDKInstance(AWS)
    AWSMock.mock('SNS', 'publish', 'Success !!!')
  })

  afterEach(async () => {
    AWSMock.restore('SNS', 'publish')
  })

  it('Should subscribe from API successfully', async () => {
    const response = await subscribeFromAPI.handler({
      body: JSON.stringify({
        email: 'test@lateralview.net',
        name: 'Test LV'
      })
    })
    expect(response.statusCode).to.equals(200)
    const body = JSON.parse(response.body)
    expect(body.message).to.exist
  })
})
