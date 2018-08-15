# Newsletter Subscription - Serverless example

## Requirements
- [Node.js](https://nodejs.org)
- [Serverless framework](https://serverless.com/)

## How it works?
![Screenshot](https://i.imgur.com/fddI5Uo.png)

## How to deploy?
- Install dependencies -> `npm i`
- Set the `sendgridAPIKey` on the `sender` function.

```yml
# ---- Mailer ----
  sendEmail:
    handler: src/handlers/mailer/sendEmail.handler
    environment:
      sendgridAPIKey: ''
    ...
```

- Run `sls deploy`

## How to remove the Stack?
Just run `sls remove`. If you have non-empty s3 buckets, you can add the `--force` option (use it carefully).

## TODO
- Improve IAMRole
- Add tests
- Manage batch errors in mailer
