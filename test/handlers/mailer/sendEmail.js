const {expect} = require('chai')
const AWSMock = require('aws-sdk-mock')
const sendEmail = require('../../../src/handlers/mailer/sendEmail')
const sgMail = require('@sendgrid/mail') 
const sinon = require('sinon')

describe('mailer - sendEmail', () => {
  let mailerStub
  beforeEach(async () => {
    mailerStub = sinon.stub(sgMail, 'send').resolves('Succeed')
  })

  afterEach(async () => {
    mailerStub.restore()
  })

  it('Should send many messages', async () => {
    const emails = [
      {
        to: 'test1@lateralview.net',
        name: 'Test1 LV',
        from: 'testing@lateralview.net',
        subject: "subject",
        html: "message"
      },
      {
        to: 'test2@lateralview.net',
        name: 'Test2 LV',
        subject: "subject",
        html: "message"
      }
    ]
    const input = {
      Records: emails.map(function (email) {
        return {
          body : JSON.stringify({
            name: email.name,
            email: email.email,
            from: email.from,
            subject: email.subject,
            html: email.html
          })
        }
      })
    }
    const response = await sendEmail.handler(input)
    expect(response.message).to.exist
    expect(mailerStub.callCount).to.equals(emails.length)
  })
})
