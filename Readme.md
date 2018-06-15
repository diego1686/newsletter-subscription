# Newsletter Subscription - Serverless example

## Requirements
- [Node.js](https://nodejs.org)
- [Serverless framework](https://serverless.com/)

## How it works?
![Screenshot](https://i.imgur.com/fddI5Uo.png)

## How to deploy?
- Set the `sendgridAPIKey` and the schedule rate (default 1 minute) on the `receiveMessages` function

```yml
# ---- Welcome Email Services ----
  receiveMessages:
    handler: src/handlers/welcomeEmail/receiveMessages.handler
    environment:
      sendgridAPIKey: 'YOUR_KEY'
      queueURL:
        Ref: WelcomeEmailQueue
    events:
      - schedule: rate(1 minute)
```

- Run `sls deploy`

## TODO
- OneSignal Client
- Improve IAMRole
- Add tests
- Improve Mailer
