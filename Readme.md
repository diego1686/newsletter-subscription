# Newsletter Subscription - Serverless example

## Requirements
- [Node.js](https://nodejs.org)
- [Serverless framework](https://serverless.com/)

## How it works?
![Screenshot](https://i.imgur.com/fddI5Uo.png)

## How to deploy?
- Install dependencies -> `npm i`
- Set the `sendgridAPIKey` and the schedule rate (default 1 minute) on the `receiveMessages` function.

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

## How to remove the Stack?
Just run `sls remove`. If you have non-empty s3 buckets, you can add the `--force` option (use it carefully).

## TODO
- OneSignal Client
- Improve IAMRole
- Add tests
- Improve Mailer
