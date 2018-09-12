// Add test environment
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.test')})

// Add sinon chai assertions style
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

// Set sdk mock
const AWS = require('aws-sdk')
const AWSMock = require('aws-sdk-mock')
before(async () => {
  AWSMock.setSDKInstance(AWS)
})